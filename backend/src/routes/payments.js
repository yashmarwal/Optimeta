const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../config/supabase');
const razorpay = require('../config/razorpay');
const authMiddleware = require('../middleware/auth');

const PLAN_IDS = {
  pro: process.env.RAZORPAY_PLAN_PRO,
  ultra: process.env.RAZORPAY_PLAN_ULTRA,
};

const now = () => new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonth = (d) => { const r = new Date(d); r.setMonth(r.getMonth() + 1); return r; };

// POST /api/payments/create-subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['pro', 'ultra'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Choose pro or ultra.' });
    }

    const planId = PLAN_IDS[plan];
    if (!planId) {
      return res.status(500).json({ success: false, message: `Plan ID for "${plan}" is not configured on the server.` });
    }

    // Block if user already has an active subscription
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', req.userId)
      .in('status', ['active', 'created', 'pending'])
      .limit(1)
      .single();

    if (existing) {
      return res.status(409).json({ success: false, message: 'You already have an active subscription. Cancel it before switching plans.' });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: {
        user_id: req.userId,
        plan,
      },
    });

    await supabase.from('subscriptions').insert({
      user_id: req.userId,
      razorpay_subscription_id: subscription.id,
      plan,
      status: 'pending',
    });

    return res.json({
      success: true,
      data: {
        subscription_id: subscription.id,
        razorpay_key_id: process.env.RAZORPAY_KEY_ID,
        user_email: req.user.email,
        user_name: req.user.fullName,
      },
    });
  } catch (err) {
    console.error('[Payments] create-subscription error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create subscription.' });
  }
});

// POST /api/payments/verify
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = req.body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed — invalid signature.' });
    }

    // Determine plan from DB record if not passed
    const { data: subRecord } = await supabase
      .from('subscriptions')
      .select('plan, user_id')
      .eq('razorpay_subscription_id', razorpay_subscription_id)
      .single();

    const activePlan = plan || subRecord?.plan || 'pro';
    const periodStart = now();
    const periodEnd = addDays(periodStart, 30);

    // Activate subscription in DB
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        razorpay_payment_id,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .eq('razorpay_subscription_id', razorpay_subscription_id);

    // Upgrade user profile
    await supabase
      .from('profiles')
      .update({
        plan: activePlan,
        campaigns_used: 0,
        billing_cycle_start: periodStart.toISOString(),
      })
      .eq('id', req.userId);

    // Return fresh user data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    return res.json({
      success: true,
      data: {
        message: 'Payment verified. Subscription activated.',
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          plan: profile.plan,
          campaignsUsed: profile.campaigns_used,
        },
      },
    });
  } catch (err) {
    console.error('[Payments] verify error:', err);
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

// POST /api/payments/webhook — Razorpay sends raw body
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body; // express.raw() is mounted at index level for this path

    if (!webhookSecret || !signature) {
      return res.status(400).send('Missing webhook secret or signature.');
    }

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      console.warn('[Webhook] Invalid signature — rejected.');
      return res.status(400).send('Invalid webhook signature.');
    }

    const event = JSON.parse(rawBody.toString());
    const { event: eventType, payload } = event;

    console.log(`[Webhook] ${eventType}`);

    switch (eventType) {

      case 'subscription.activated': {
        const sub = payload.subscription.entity;
        const planType = sub.notes?.plan || 'pro';
        const start = now();
        const end = addDays(start, 30);

        await supabase
          .from('subscriptions')
          .update({ status: 'active', current_period_start: start.toISOString(), current_period_end: end.toISOString() })
          .eq('razorpay_subscription_id', sub.id);

        const { data: dbSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('razorpay_subscription_id', sub.id)
          .single();

        if (dbSub) {
          await supabase
            .from('profiles')
            .update({ plan: planType, campaigns_used: 0, billing_cycle_start: start.toISOString() })
            .eq('id', dbSub.user_id);
        }
        console.log(`[Webhook] Subscription activated: ${sub.id}`);
        break;
      }

      case 'subscription.charged': {
        // Monthly renewal — reset usage and extend period
        const sub = payload.subscription.entity;
        const start = now();
        const end = addDays(start, 30);

        const { data: dbSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('razorpay_subscription_id', sub.id)
          .single();

        await supabase
          .from('subscriptions')
          .update({ current_period_start: start.toISOString(), current_period_end: end.toISOString(), status: 'active' })
          .eq('razorpay_subscription_id', sub.id);

        if (dbSub) {
          await supabase
            .from('profiles')
            .update({ campaigns_used: 0, billing_cycle_start: start.toISOString() })
            .eq('id', dbSub.user_id);
        }
        console.log(`[Webhook] Subscription renewed: ${sub.id}`);
        break;
      }

      case 'subscription.cancelled': {
        // User keeps access until period_end — do NOT downgrade plan yet
        const sub = payload.subscription.entity;
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', cancelled_at: now().toISOString() })
          .eq('razorpay_subscription_id', sub.id);
        console.log(`[Webhook] Subscription cancelled: ${sub.id}`);
        break;
      }

      case 'subscription.expired':
      case 'subscription.completed': {
        // Downgrade to free now
        const sub = payload.subscription.entity;
        const { data: dbSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('razorpay_subscription_id', sub.id)
          .single();

        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('razorpay_subscription_id', sub.id);

        if (dbSub) {
          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', dbSub.user_id);
        }
        console.log(`[Webhook] Subscription expired: ${sub.id}`);
        break;
      }

      case 'payment.failed': {
        // 3-day grace period — keep access, mark status
        const sub = payload.subscription?.entity;
        if (sub?.id) {
          await supabase
            .from('subscriptions')
            .update({ status: 'payment_failed' })
            .eq('razorpay_subscription_id', sub.id);
        }
        console.log('[Webhook] Payment failed — grace period active.');
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return res.json({ received: true }); // always 200 to prevent Razorpay retries on our bugs
  }
});

// GET /api/payments/subscription
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, campaigns_used, billing_cycle_start')
      .eq('id', req.userId)
      .single();

    const PLAN_LIMITS = { free: 1, pro: 15, ultra: 50 };
    const plan = profile?.plan || 'free';
    const limit = PLAN_LIMITS[plan];
    const used = profile?.campaigns_used || 0;

    const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end) : null;
    const daysRemaining = periodEnd
      ? Math.max(0, Math.ceil((periodEnd - now()) / (1000 * 60 * 60 * 24)))
      : null;

    return res.json({
      success: true,
      data: {
        subscription: sub ? { ...sub, days_remaining: daysRemaining } : null,
        plan,
        limit,
        used,
        remaining: plan === 'free' ? Math.max(0, limit - used) : Math.max(0, limit - used),
        cycle_end: periodEnd?.toISOString() || null,
        percent_used: limit > 0 ? Math.round((used / limit) * 100) : 0,
      },
    });
  } catch (err) {
    console.error('[Payments] subscription fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch subscription.' });
  }
});

// POST /api/payments/cancel
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('razorpay_subscription_id')
      .eq('user_id', req.userId)
      .in('status', ['active', 'payment_failed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!sub) {
      return res.status(404).json({ success: false, message: 'No active subscription found.' });
    }

    // cancel_at_cycle_end: true — user keeps access until period end
    await razorpay.subscriptions.cancel(sub.razorpay_subscription_id, true);

    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: now().toISOString() })
      .eq('razorpay_subscription_id', sub.razorpay_subscription_id);

    return res.json({
      success: true,
      data: { message: 'Subscription cancelled. You keep access until your current billing period ends.' },
    });
  } catch (err) {
    console.error('[Payments] cancel error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Cancellation failed.' });
  }
});

module.exports = router;

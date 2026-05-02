const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../config/supabase');
const razorpay = require('../config/razorpay');
const authMiddleware = require('../middleware/auth');
const { sendPaymentFailedEmail } = require('../services/emailService');

const PLAN_IDS = {
  pro: process.env.RAZORPAY_PLAN_PRO,
  ultra: process.env.RAZORPAY_PLAN_ULTRA,
};

const now = () => new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

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

    // Block only if there is a truly active subscription (not abandoned pending attempts)
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', req.userId)
      .eq('status', 'active')
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

    // Fetch plan from existing DB record (if it exists)
    const { data: subRecord } = await supabase
      .from('subscriptions')
      .select('plan, user_id')
      .eq('razorpay_subscription_id', razorpay_subscription_id)
      .single();

    const activePlan = plan || subRecord?.plan || 'pro';
    const periodStart = now();
    const periodEnd = addDays(periodStart, 30);

    // Upsert subscription record — handles the case where the pending record
    // was never saved to DB (e.g. DB insert failed during create-subscription)
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: req.userId,
        razorpay_subscription_id,
        razorpay_payment_id,
        plan: activePlan,
        status: 'active',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        payment_retry_count: 0,
      }, { onConflict: 'razorpay_subscription_id' });

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
          .update({
            current_period_start: start.toISOString(),
            current_period_end: end.toISOString(),
            status: 'active',
            payment_retry_count: 0,
          })
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
        // Get subscription ID from whichever payload field is present
        const subId =
          payload?.subscription?.entity?.id ||
          payload?.payment?.entity?.subscription_id;

        if (!subId) {
          console.log('[Webhook] payment.failed — no subscription ID found, skipping.');
          break;
        }

        // Fetch subscription + profile from DB
        const { data: dbSub } = await supabase
          .from('subscriptions')
          .select('*, profiles(*)')
          .eq('razorpay_subscription_id', subId)
          .single();

        if (!dbSub) {
          console.log('[Webhook] payment.failed — no DB record for subscription:', subId);
          break;
        }

        const retryCount = (dbSub.payment_retry_count || 0) + 1;
        console.log(`[Webhook] Payment failed. Retry ${retryCount}/3 for user: ${dbSub.user_id}`);

        if (retryCount >= 3) {
          // 3 failures — cancel subscription immediately
          try {
            await razorpay.subscriptions.cancel(subId, { cancel_at_cycle_end: false });
          } catch (e) {
            console.error('[Webhook] Razorpay cancel error:', e.message);
          }

          await supabase
            .from('subscriptions')
            .update({ status: 'cancelled', payment_retry_count: retryCount, cancelled_at: now().toISOString() })
            .eq('razorpay_subscription_id', subId);

          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', dbSub.user_id);

          const email = dbSub.profiles?.email;
          const name = dbSub.profiles?.full_name;
          if (email) await sendPaymentFailedEmail(email, name, true);

          console.log('[Webhook] Subscription cancelled after 3 failed payments:', dbSub.user_id);
        } else {
          await supabase
            .from('subscriptions')
            .update({ payment_retry_count: retryCount, status: 'payment_failed' })
            .eq('razorpay_subscription_id', subId);

          const email = dbSub.profiles?.email;
          const name = dbSub.profiles?.full_name;
          if (email) await sendPaymentFailedEmail(email, name, false, retryCount);

          console.log(`[Webhook] Payment failure warning sent. Attempt ${retryCount}/3`);
        }
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

    const PLAN_LIMITS = { free: 1, pro: 5, ultra: 10 };
    const plan = profile?.plan || 'free';
    const limit = PLAN_LIMITS[plan];
    const used = profile?.campaigns_used || 0;

    // Use subscription period_end if available, otherwise derive from billing_cycle_start
    const periodEnd = sub?.current_period_end
      ? new Date(sub.current_period_end)
      : profile?.billing_cycle_start
        ? new Date(new Date(profile.billing_cycle_start).getTime() + 30 * 24 * 60 * 60 * 1000)
        : null;

    const daysRemaining = periodEnd
      ? Math.max(0, Math.ceil((periodEnd - now()) / (1000 * 60 * 60 * 24)))
      : null;

    // Build subscription object, enriching with daysRemaining even if record is sparse
    const subscriptionData = sub
      ? { ...sub, daysRemaining, current_period_end: periodEnd?.toISOString() || sub.current_period_end }
      : null;

    return res.json({
      success: true,
      data: {
        subscription: subscriptionData,
        plan,
        limit,
        used,
        remaining: Math.max(0, limit - used),
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
    // Try to find an active or payment_failed subscription record
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('razorpay_subscription_id, status')
      .eq('user_id', req.userId)
      .in('status', ['active', 'payment_failed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sub?.razorpay_subscription_id) {
      // Normal path: subscription record found — cancel via Razorpay
      try {
        await razorpay.subscriptions.cancel(sub.razorpay_subscription_id, true);
      } catch (rzpErr) {
        // If Razorpay cancel fails (already cancelled, not found, etc.) log and continue
        console.error('[Payments] Razorpay cancel error (continuing):', rzpErr.message);
      }

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', cancelled_at: now().toISOString() })
        .eq('razorpay_subscription_id', sub.razorpay_subscription_id);

      return res.json({
        success: true,
        data: { message: 'Subscription cancelled. You keep access until your current billing period ends.' },
      });
    }

    // Fallback: no subscription record in DB but user may have pro/ultra plan
    // (happens if verify route failed to upsert the subscription record)
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', req.userId)
      .single();

    if (!profile || profile.plan === 'free') {
      return res.status(404).json({ success: false, message: 'No active subscription found.' });
    }

    // Downgrade the user directly since we can't reach Razorpay without a subscription ID
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('id', req.userId);

    console.log('[Payments] Fallback cancel — downgraded user directly:', req.userId);

    return res.json({
      success: true,
      data: { message: 'Subscription cancelled successfully.' },
    });
  } catch (err) {
    console.error('[Payments] cancel error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Cancellation failed.' });
  }
});

module.exports = router;

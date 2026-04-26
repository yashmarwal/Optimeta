const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../config/supabase');
const razorpay = require('../config/razorpay');
const authMiddleware = require('../middleware/auth');
const {
  createSubscription,
  activateSubscription,
  handleSubscriptionCharged,
  handleSubscriptionCancelled,
  handleSubscriptionExpired,
  cancelSubscription,
} = require('../services/subscriptionService');

// POST /api/payments/create-subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['pro', 'ultra'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Choose pro or ultra.' });
    }

    const subscription = await createSubscription(req.userId, plan);

    return res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to create subscription.' });
  }
});

// POST /api/payments/verify — verify payment signature after checkout
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = req.body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    await activateSubscription(razorpay_subscription_id, razorpay_payment_id, plan);

    return res.json({
      success: true,
      data: { message: 'Payment verified. Subscription activated.' },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

// GET /api/payments/subscription — get current subscription
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!sub) {
      return res.json({
        success: true,
        data: { subscription: null, plan: req.user.plan },
      });
    }

    const now = new Date();
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
    const daysRemaining = periodEnd
      ? Math.max(0, Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24)))
      : null;

    return res.json({
      success: true,
      data: {
        subscription: {
          ...sub,
          daysRemaining,
        },
        plan: req.user.plan,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subscription.' });
  }
});

// POST /api/payments/cancel
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const result = await cancelSubscription(req.userId);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Cancellation failed.' });
  }
});

// POST /api/payments/webhook — Razorpay webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const event = JSON.parse(body.toString());
    const { event: eventType, payload } = event;

    console.log(`[Webhook] Received: ${eventType}`);

    switch (eventType) {
      case 'subscription.activated': {
        const sub = payload.subscription.entity;
        await activateSubscription(sub.id, null, sub.notes?.plan || 'pro');
        break;
      }
      case 'subscription.charged': {
        const sub = payload.subscription.entity;
        await handleSubscriptionCharged(sub.id);
        break;
      }
      case 'subscription.cancelled': {
        const sub = payload.subscription.entity;
        await handleSubscriptionCancelled(sub.id);
        break;
      }
      case 'subscription.expired': {
        const sub = payload.subscription.entity;
        await handleSubscriptionExpired(sub.id);
        break;
      }
      case 'payment.failed': {
        // Grace period — keep access for 3 days (handled via period_end)
        console.log('[Webhook] Payment failed for subscription.');
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event: ${eventType}`);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }
});

module.exports = router;

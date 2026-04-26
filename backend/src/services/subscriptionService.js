const supabase = require('../config/supabase');
const razorpay = require('../config/razorpay');

const PLAN_IDS = {
  pro: process.env.RAZORPAY_PLAN_PRO,
  ultra: process.env.RAZORPAY_PLAN_ULTRA,
};

const createSubscription = async (userId, plan) => {
  const planId = PLAN_IDS[plan];
  if (!planId) throw new Error('Invalid plan selected.');

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: 12,
    notes: { userId, plan },
  });

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    razorpay_subscription_id: subscription.id,
    plan,
    status: 'created',
  }, { onConflict: 'user_id' });

  return subscription;
};

const activateSubscription = async (subscriptionId, paymentId, plan) => {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', subscriptionId)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      razorpay_payment_id: paymentId,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })
    .eq('razorpay_subscription_id', subscriptionId);

  await supabase
    .from('profiles')
    .update({
      plan,
      campaigns_used: 0,
      billing_cycle_start: now.toISOString(),
    })
    .eq('id', sub.user_id);
};

const handleSubscriptionCharged = async (subscriptionId) => {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', subscriptionId)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })
    .eq('razorpay_subscription_id', subscriptionId);

  await supabase
    .from('profiles')
    .update({
      campaigns_used: 0,
      billing_cycle_start: now.toISOString(),
    })
    .eq('id', sub.user_id);
};

const handleSubscriptionCancelled = async (subscriptionId) => {
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('razorpay_subscription_id', subscriptionId);
};

const handleSubscriptionExpired = async (subscriptionId) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', subscriptionId)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('razorpay_subscription_id', subscriptionId);

  await supabase
    .from('profiles')
    .update({ plan: 'free' })
    .eq('id', sub.user_id);
};

const cancelSubscription = async (userId) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('razorpay_subscription_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!sub) throw new Error('No active subscription found.');

  await razorpay.subscriptions.cancel(sub.razorpay_subscription_id, true);

  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('razorpay_subscription_id', sub.razorpay_subscription_id);

  return { message: 'Subscription cancelled. Access continues until period end.' };
};

module.exports = {
  createSubscription,
  activateSubscription,
  handleSubscriptionCharged,
  handleSubscriptionCancelled,
  handleSubscriptionExpired,
  cancelSubscription,
};

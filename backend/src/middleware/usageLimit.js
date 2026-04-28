const supabase = require('../config/supabase');

const PLAN_LIMITS = {
  free: 1,
  pro: 10,
  ultra: 30,
};

const usageLimitMiddleware = async (req, res, next) => {
  try {
    const { id: userId, plan, campaigns_used, billing_cycle_start } = req.user;

    const limit = PLAN_LIMITS[plan] ?? 1;

    if (plan === 'free') {
      // Free plan: lifetime limit (1 campaign total, ever)
      const { count, error } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;

      if (count >= limit) {
        return res.status(403).json({
          success: false,
          message: 'Free plan limit reached. Upgrade to Pro to generate more campaigns.',
          limitReached: true,
        });
      }
    } else {
      // Paid plans: reset monthly
      const cycleStart = new Date(billing_cycle_start);
      const now = new Date();
      const cycleEnd = new Date(cycleStart);
      cycleEnd.setMonth(cycleEnd.getMonth() + 1);

      if (now > cycleEnd) {
        // Billing cycle rolled over — reset counter
        await supabase
          .from('profiles')
          .update({ campaigns_used: 0, billing_cycle_start: now.toISOString() })
          .eq('id', userId);
        req.user.campaigns_used = 0;
      }

      if ((req.user.campaigns_used ?? 0) >= limit) {
        return res.status(403).json({
          success: false,
          message: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan limit of ${limit} campaigns/month reached. Upgrade for more.`,
          limitReached: true,
        });
      }
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Usage check failed.' });
  }
};

module.exports = usageLimitMiddleware;

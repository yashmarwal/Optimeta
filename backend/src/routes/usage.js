const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const PLAN_LIMITS = { free: 1, pro: 5, ultra: 10 };

// GET /api/usage — get current usage stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { plan, campaigns_used, billing_cycle_start } = req.user;
    const limit = PLAN_LIMITS[plan] ?? 1;

    let used = campaigns_used || 0;
    let cycleEnd = null;

    if (plan !== 'free') {
      const cycleStart = new Date(billing_cycle_start);
      cycleEnd = new Date(cycleStart);
      cycleEnd.setMonth(cycleEnd.getMonth() + 1);

      const now = new Date();
      if (now > cycleEnd) {
        await supabase
          .from('profiles')
          .update({ campaigns_used: 0, billing_cycle_start: now.toISOString() })
          .eq('id', req.userId);
        used = 0;
        cycleEnd = new Date(now);
        cycleEnd.setMonth(cycleEnd.getMonth() + 1);
      }
    } else {
      const { count } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', req.userId);
      used = count || 0;
    }

    return res.json({
      success: true,
      data: {
        plan,
        limit,
        used,
        remaining: Math.max(0, limit - used),
        cycleEnd: cycleEnd?.toISOString() || null,
        percentUsed: Math.round((used / limit) * 100),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch usage.' });
  }
});

module.exports = router;

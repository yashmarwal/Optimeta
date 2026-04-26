const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const usageLimitMiddleware = require('../middleware/usageLimit');
const { generateCampaignBlueprint } = require('../services/aiService');
const { storeFingerprint } = require('../services/fingerprintService');
const { generateBlueprintHTML } = require('../services/pdfService');

// All campaign routes require auth
router.use(authMiddleware);

// GET /api/campaigns — list user's campaigns
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, campaign_name, created_at, business_inputs, blueprint')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const campaigns = data.map(c => ({
      id: c.id,
      campaignName: c.campaign_name || c.blueprint?.campaign_name,
      createdAt: c.created_at,
      industry: c.business_inputs?.industry,
      goal: c.business_inputs?.campaignGoal,
      executiveSummary: c.blueprint?.executive_summary?.slice(0, 120) + '...',
    }));

    return res.json({ success: true, data: { campaigns } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch campaigns.' });
  }
});

// GET /api/campaigns/:id — get single campaign
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    return res.json({ success: true, data: { campaign: data } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch campaign.' });
  }
});

// POST /api/campaigns/generate — generate new campaign
router.post('/generate', usageLimitMiddleware, async (req, res) => {
  try {
    const { businessInputs, screenResolution, timezone, canvasHash } = req.body;

    if (!businessInputs) {
      return res.status(400).json({ success: false, message: 'Business inputs are required.' });
    }

    const required = ['businessName', 'industry', 'businessDescription', 'productName',
      'price', 'keyBenefit1', 'keyBenefit2', 'keyBenefit3', 'usp',
      'targetAudience', 'campaignGoal', 'targetLocations', 'biggestChallenge'];

    for (const field of required) {
      if (!businessInputs[field]) {
        return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
      }
    }

    // Generate blueprint via Gemini
    const blueprint = await generateCampaignBlueprint(businessInputs);

    // Save to DB
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: req.userId,
        campaign_name: blueprint.campaign_name,
        business_inputs: businessInputs,
        blueprint,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment campaigns_used
    await supabase
      .from('profiles')
      .update({ campaigns_used: (req.user.campaigns_used || 0) + 1 })
      .eq('id', req.userId);

    // Store fingerprint for free users
    if (req.user.plan === 'free') {
      const ip = req.ip || req.connection.remoteAddress || '0.0.0.0';
      const userAgent = req.headers['user-agent'] || '';
      await storeFingerprint({
        userId: req.userId,
        email: req.user.email,
        ip,
        userAgent,
        screenResolution: screenResolution || 'unknown',
        timezone: timezone || 'unknown',
      });
    }

    return res.status(201).json({
      success: true,
      data: { campaign },
    });
  } catch (err) {
    console.error('Campaign generation error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Campaign generation failed. Please try again.',
    });
  }
});

// DELETE /api/campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;

    return res.json({ success: true, data: { message: 'Campaign deleted.' } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete campaign.' });
  }
});

// GET /api/campaigns/:id/export — export blueprint as HTML (for PDF printing)
router.get('/:id/export', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    // Only pro/ultra can export
    if (req.user.plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'PDF export is available on Pro and Ultra plans.',
      });
    }

    const html = generateBlueprintHTML(data);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="optimeta-blueprint-${data.id}.html"`);
    return res.send(html);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

module.exports = router;

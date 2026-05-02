const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const usageLimitMiddleware = require('../middleware/usageLimit');
const { generateCampaignBlueprint, generateOptimisedBlueprint } = require('../services/aiService');
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
    console.log('=== GENERATE ROUTE HIT ===');
    console.log('User ID:', req.user?.id || req.userId);
    console.log('Body keys:', Object.keys(req.body));

    const inputs = req.body;

    if (!inputs.businessName || !inputs.businessDescription || !inputs.productName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: businessName, businessDescription, productName',
      });
    }

    console.log('Calling AI service...');
    const blueprint = await generateCampaignBlueprint(inputs);
    console.log('Blueprint generated:', blueprint.campaign_name);

    const userId = req.user?.id || req.userId;

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        campaign_name: blueprint.campaign_name || `${inputs.businessName} Campaign`,
        business_inputs: inputs,
        blueprint,
      })
      .select()
      .single();

    if (error) {
      console.error('DB save error:', error);
      throw new Error('Failed to save campaign');
    }

    // Increment campaigns_used (fetch first to avoid race on raw SQL)
    const { data: profile } = await supabase
      .from('profiles')
      .select('campaigns_used')
      .eq('id', userId)
      .single();

    await supabase
      .from('profiles')
      .update({ campaigns_used: (profile?.campaigns_used || 0) + 1 })
      .eq('id', userId);

    console.log('Campaign saved:', campaign.id);

    return res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Generate error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate campaign',
    });
  }
});

// POST /api/campaigns/optimise — generate optimised campaign from existing one
router.post('/optimise', usageLimitMiddleware, async (req, res) => {
  try {
    const { campaignId, optimisationInputs } = req.body;
    const userId = req.user?.id || req.userId;

    if (!campaignId || !optimisationInputs) {
      return res.status(400).json({ success: false, message: 'Missing campaignId or optimisationInputs.' });
    }

    const { data: originalCampaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !originalCampaign) {
      return res.status(404).json({ success: false, message: 'Original campaign not found.' });
    }

    const blueprint = await generateOptimisedBlueprint(originalCampaign, optimisationInputs);

    // Find existing optimised versions of this campaign to determine version number
    const { data: existingVersions } = await supabase
      .from('campaigns')
      .select('id')
      .eq('user_id', userId)
      .like('campaign_name', `${originalCampaign.campaign_name} — Optimised v%`);

    const version = (existingVersions?.length || 0) + 1;
    const newName = `${originalCampaign.campaign_name} — Optimised v${version}`;

    const { data: campaign, error: saveError } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        campaign_name: newName,
        business_inputs: {
          ...originalCampaign.business_inputs,
          optimisationInputs,
          isOptimisation: true,
          originalCampaignId: campaignId,
        },
        blueprint,
      })
      .select()
      .single();

    if (saveError) {
      console.error('DB save error:', saveError);
      throw new Error('Failed to save optimised campaign');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('campaigns_used')
      .eq('id', userId)
      .single();

    await supabase
      .from('profiles')
      .update({ campaigns_used: (profile?.campaigns_used || 0) + 1 })
      .eq('id', userId);

    return res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Optimise error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Failed to optimise campaign.' });
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

module.exports = router;

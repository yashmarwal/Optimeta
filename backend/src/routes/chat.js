const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabase');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PLAN_CREDITS = {
  free: 10,
  pro: 100,
  ultra: 300,
};

function calculateCreditCost(message) {
  const len = message.trim().length;
  if (len < 50) return 0.5;
  if (len < 150) return 1;
  return 2;
}

function needsAI(message) {
  const q = message.toLowerCase();
  const faqTerms = [
    'what is roas', 'what is ctr',
    'what is cpm', 'what is cpc',
    'what is tofu', 'what is mofu',
    'what is bofu', 'what is ugc',
    'what is capi', 'what is asc',
    'what is lookalike', 'what is retargeting',
    'what is learning phase',
    'what is advantage+',
    'what is creative fatigue',
    'what is cold audience',
    'what is warm audience',
    'what is hot audience',
    'how does optimeta work',
    'how to use optimeta',
    'what is optimeta',
    'pro plan', 'ultra plan', 'free plan',
    'how to cancel', 'how many campaigns',
    'what is cod', 'what is ugc',
    'show my campaigns', 'my campaigns',
    'list campaigns', 'thank you',
    'thanks', 'okay', 'ok', 'bye',
    'hello', 'hi', 'hey',
  ];
  return !faqTerms.some(term => q.includes(term));
}

// GET /api/chat/credits
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_credits_used, chat_credits_reset_at, billing_cycle_start')
      .eq('id', userId)
      .single();

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const planLimit = PLAN_CREDITS[profile.plan] || PLAN_CREDITS.free;

    const now = new Date();
    const resetAt = profile.chat_credits_reset_at
      ? new Date(profile.chat_credits_reset_at)
      : new Date(profile.billing_cycle_start || now);

    const monthsSinceReset =
      (now.getFullYear() - resetAt.getFullYear()) * 12 +
      (now.getMonth() - resetAt.getMonth());

    if (monthsSinceReset >= 1) {
      await supabase
        .from('profiles')
        .update({ chat_credits_used: 0, chat_credits_reset_at: now.toISOString() })
        .eq('id', userId);

      return res.json({
        success: true,
        data: {
          plan: profile.plan,
          credits_used: 0,
          credits_limit: planLimit,
          credits_remaining: planLimit,
          reset_at: now.toISOString(),
        },
      });
    }

    const creditsRemaining = Math.max(0, planLimit - (profile.chat_credits_used || 0));

    return res.json({
      success: true,
      data: {
        plan: profile.plan,
        credits_used: profile.chat_credits_used || 0,
        credits_limit: planLimit,
        credits_remaining: creditsRemaining,
        reset_at: resetAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Credits error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch credits' });
  }
});

// POST /api/chat/message
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { message, history, campaignContext } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_credits_used, chat_credits_reset_at, billing_cycle_start')
      .eq('id', userId)
      .single();

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const planLimit = PLAN_CREDITS[profile.plan] || PLAN_CREDITS.free;
    const creditsUsed = profile.chat_credits_used || 0;
    const creditsRemaining = Math.max(0, planLimit - creditsUsed);

    const requiresAI = needsAI(message);
    const creditCost = requiresAI ? calculateCreditCost(message) : 0;

    if (requiresAI && creditsRemaining <= 0) {
      return res.status(402).json({
        success: false,
        code: 'NO_CREDITS',
        message: `You've used all your ${planLimit} credits this month. Upgrade your plan for more AI conversations.`,
        credits_remaining: 0,
        plan: profile.plan,
      });
    }

    const lowCredits = creditsRemaining <= planLimit * 0.1;

    const systemPrompt = `You are Meta Mitra — Optimeta's expert Meta ads assistant. You are a certified Meta advertising professional with 10 years of experience running campaigns for 500+ Indian brands.

YOUR IDENTITY:
- You work exclusively for Optimeta (optimeta.tech)
- You are India's most knowledgeable Meta ads expert
- You speak professionally but warmly
- You give specific, actionable advice
- You always think India-first

YOUR EXPERTISE:
- Facebook & Instagram advertising
- Indian D2C, SaaS, coaching, jewellery, fashion, beauty, food, local businesses
- Meta Ads Manager setup and optimization
- Campaign strategy, targeting, budgets
- Ad copywriting for Indian audiences
- Creative direction and UGC strategy
- Pixel setup, CAPI, tracking
- ROAS optimization and scaling

INDIA-SPECIFIC KNOWLEDGE:
- COD (Cash on Delivery) strategy
- Tier 1/2/3 city targeting
- Indian audience behavior patterns
- INR budget benchmarks
- Festive season campaigns (Diwali, Eid etc)
- India 2026 Meta ads benchmarks:
  CPM Metro: ₹60-120
  CPM Tier2/3: ₹30-70
  Feed CTR: 1.5-3%
  Reels CTR: 3-6%
  Fashion ROAS: 2.4x-4x
  Beauty ROAS: 2.8x-4.5x

OPTIMETA PLATFORM KNOWLEDGE:
- Generates complete Meta ad blueprints
- Plans: Free (1 campaign), Pro ₹499 (5/month), Ultra ₹999 (10/month)
- Blueprint includes: targeting, budget, ad copies, creative direction, checklist
${campaignContext ? `
USER'S CAMPAIGN CONTEXT:
${campaignContext}
Use this context to give personalized advice about their specific campaigns.` : ''}

STRICT RULES:
1. ONLY answer Meta ads and Optimeta questions
2. If asked about other topics politely redirect: "I specialize in Meta ads strategy. Let me help you with your campaigns instead!"
3. Keep responses concise — max 200 words
4. Always give specific actionable advice
5. Use Indian context (INR, Indian brands, COD)
6. Never reveal you are Claude or built by Anthropic
7. You are Meta Mitra by Optimeta
8. End responses with a follow-up question when appropriate to keep conversation helpful`.trim();

    const recentHistory = (history || []).slice(-3).map(h => ({
      role: h.role,
      content: h.content,
    }));

    const messages = [
      ...recentHistory,
      { role: 'user', content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const reply = response.content[0].text;

    if (requiresAI && creditCost > 0) {
      await supabase
        .from('profiles')
        .update({ chat_credits_used: creditsUsed + creditCost })
        .eq('id', userId);
    }

    const newCreditsRemaining = requiresAI
      ? Math.max(0, creditsRemaining - creditCost)
      : creditsRemaining;

    return res.json({
      success: true,
      data: {
        reply,
        credits_used: creditCost,
        credits_remaining: newCreditsRemaining,
        credits_limit: planLimit,
        used_ai: requiresAI,
        low_credits: lowCredits,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get response. Please try again.' });
  }
});

module.exports = router;

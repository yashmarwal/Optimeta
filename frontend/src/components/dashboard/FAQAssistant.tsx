'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, ChevronRight, ArrowLeft } from 'lucide-react';

// ── Knowledge base & logic (unchanged) ───────────────────────
const KNOWLEDGE_BASE = [
  {
    keywords: ['thank you', 'thanks', 'thankyou', 'thank u', 'ty', 'shukriya', 'dhanyawad'],
    answer: "You're welcome! Happy to help. Feel free to ask anything else about your campaigns or Meta ads. 😊",
  },
  {
    keywords: ['ok', 'okay', 'alright', 'got it', 'understood', 'noted', 'sure', 'fine'],
    answer: "Great! Let me know if you need anything else. I'm here to help with your Meta ads campaigns. 👍",
  },
  {
    keywords: ['anything else', 'what else', 'what can you do', 'what can you help', 'help me with'],
    answer: 'I can help you with:\n\n📊 Your campaigns — targeting, ad copies, budget, checklist\n📈 Meta ads terms — ROAS, CTR, CPM, Learning Phase\n💡 Strategy — COD tips, UGC, retargeting\n⚙️ Optimeta — plans, features, how to use\n\nJust ask anything!',
  },
  {
    keywords: ['good', 'great', 'awesome', 'perfect', 'excellent', 'nice', 'helpful', 'amazing'],
    answer: "Glad I could help! 🎯 Anything else you'd like to know about your campaigns or Meta ads strategy?",
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'take care', 'later'],
    answer: 'Goodbye! Best of luck with your Meta campaigns. Feel free to come back anytime. 🚀',
  },
  {
    keywords: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'are you human'],
    answer: "I'm Meta Mitra — your personal Meta ads expert by Optimeta. I can answer questions about your campaigns and Meta advertising strategy. For account or billing help, reach us at optimeta@outlook.com",
  },
  {
    keywords: ['not helpful', 'wrong answer', 'incorrect', 'that is wrong', 'not right'],
    answer: "I'm sorry about that! For more detailed help, please email us at optimeta@outlook.com — we respond within 24 hours. You can also open your full campaign blueprint for complete details.",
  },
  {
    keywords: ['how are you', 'how r u', 'whats up', "what's up"],
    answer: "I'm doing great and ready to help! 😊 Ask me about your Meta campaigns or any advertising questions.",
  },
  {
    keywords: ['what is optimeta', 'optimeta', 'platform', 'about optimeta'],
    answer: 'Optimeta is an AI-powered Meta ad campaign architect built for Indian brands. You answer questions about your business and we generate a complete Facebook & Instagram campaign blueprint — including targeting, budget, ad copies, creative direction and launch checklist.',
  },
  {
    keywords: ['how does it work', 'how to use', 'steps', 'get started', 'how to start'],
    answer: "It's simple! 1. Click \"New Campaign\" 2. Fill in 5 steps about your business, product, audience and goals 3. Click Generate 4. Get your complete campaign blueprint in 15-20 seconds. Then follow the launch checklist to set it up in Meta Ads Manager.",
  },
  {
    keywords: ['free plan', 'free', 'free campaign', 'free trial'],
    answer: 'The Free plan gives you 1 campaign blueprint lifetime — enough to try the full platform. Upgrade to Pro (₹499/month) for 5 campaigns/month or Ultra (₹999/month) for 10 campaigns/month.',
  },
  {
    keywords: ['pro plan', 'pro', '499', 'upgrade pro'],
    answer: 'Pro plan is ₹499/month and includes 5 campaign blueprints per month, PDF export, campaign history and priority support. Cancel anytime from Settings.',
  },
  {
    keywords: ['ultra plan', 'ultra', '999', 'upgrade ultra'],
    answer: 'Ultra plan is ₹999/month and includes 10 campaign blueprints per month, PDF export, campaign history, advanced targeting insights and priority support.',
  },
  {
    keywords: ['cancel', 'cancellation', 'cancel subscription', 'stop subscription'],
    answer: 'You can cancel anytime from Dashboard → Settings → Subscription → Cancel. You keep access until the end of your current billing period. Your campaigns are saved in read-only mode after cancellation.',
  },
  {
    keywords: ['export', 'pdf', 'download', 'pdf export'],
    answer: 'You can export any campaign blueprint as a PDF. Open the campaign, click the "Export PDF" button in the top right corner. PDF export is available on Pro and Ultra plans.',
  },
  {
    keywords: ['delete campaign', 'remove campaign'],
    answer: 'To delete a campaign, go to your Dashboard, find the campaign card and click the trash icon. You will be asked to confirm before deletion. Deleted campaigns cannot be recovered.',
  },
  {
    keywords: ['how many campaigns', 'campaign limit', 'campaigns remaining', 'limit'],
    answer: 'Free plan: 1 campaign lifetime. Pro plan: 5 campaigns per month. Ultra plan: 10 campaigns per month. Your remaining campaigns reset every month on your billing date.',
  },
  {
    keywords: ['optimise', 'optimize', 'existing campaign', 'improve campaign'],
    answer: 'Yes! Click "New Campaign" and choose "Optimise Existing" to improve a campaign you already generated. Select which campaign to optimise, answer a few questions about your current results, and get an improved blueprint.',
  },
  {
    keywords: ['contact', 'support', 'help', 'email', 'reach out'],
    answer: 'You can reach us at optimeta@outlook.com. We respond within 24 hours. You can also check our blog at optimeta.tech/blog for Meta ads guides.',
  },
  {
    keywords: ['roas', 'return on ad spend'],
    answer: 'ROAS (Return on Ad Spend) = Revenue ÷ Ad Spend. ROAS of 3x means you earn ₹3 for every ₹1 spent on ads. Indian D2C benchmark: Fashion 2.4x-4x, Beauty 2.8x-4.5x, Jewellery 2x-3.5x.',
  },
  {
    keywords: ['ctr', 'click through rate'],
    answer: 'CTR (Click Through Rate) = Clicks ÷ Impressions × 100. Good CTR for India: Feed ads 1.5-3%, Reels ads 3-6%. Low CTR means your creative or targeting needs improvement.',
  },
  {
    keywords: ['cpm', 'cost per thousand', 'cost per impression'],
    answer: 'CPM (Cost Per 1000 Impressions) = how much you pay for 1000 people to see your ad. India benchmarks: Metro cities ₹60-120, Tier 2/3 cities ₹30-70.',
  },
  {
    keywords: ['cpc', 'cost per click'],
    answer: 'CPC (Cost Per Click) = total spend ÷ total clicks. Lower CPC means more people clicking for your budget. Typical India CPC: ₹3-15 depending on industry and audience.',
  },
  {
    keywords: ['cpa', 'cost per acquisition', 'cost per result'],
    answer: 'CPA (Cost Per Acquisition) = total spend ÷ conversions. This is how much you pay to get one customer or lead. Lower CPA = more efficient campaign.',
  },
  {
    keywords: ['tofu', 'top of funnel', 'awareness'],
    answer: 'TOFU = Top of Funnel. These are people who have never heard of your brand. Use awareness and reach objectives. Cold audience. Focus on introducing your product and stopping the scroll.',
  },
  {
    keywords: ['mofu', 'middle of funnel', 'consideration'],
    answer: 'MOFU = Middle of Funnel. People who know your brand but have not bought yet. Warm audience. Use engagement, traffic or lead gen objectives. Show proof, reviews and benefits.',
  },
  {
    keywords: ['bofu', 'bottom of funnel', 'conversion'],
    answer: 'BOFU = Bottom of Funnel. People ready to buy. Hot audience — website visitors, cart abandoners, past customers. Use Sales objective with retargeting. Show offer, urgency and social proof.',
  },
  {
    keywords: ['pixel', 'meta pixel', 'facebook pixel', 'tracking'],
    answer: 'Meta Pixel is a code you install on your website that tracks visitor actions. It helps Meta show ads to the right people and measure results. Without pixel, use Traffic objective first to collect data.',
  },
  {
    keywords: ['capi', 'conversions api', 'server side'],
    answer: 'CAPI (Conversions API) is server-side tracking that works alongside the pixel. It captures conversions that iOS privacy blocks from pixel tracking. Essential for accurate reporting on iOS devices.',
  },
  {
    keywords: ['learning phase', 'learning', 'optimization'],
    answer: 'Learning Phase is the first 7-14 days of a campaign where Meta AI tests different audiences and placements. Needs 50 optimization events to exit. Do NOT edit campaigns during this period — it resets learning.',
  },
  {
    keywords: ['lookalike', 'lookalike audience'],
    answer: 'Lookalike Audience = Meta finds new people similar to your existing customers. Upload your customer list or use pixel data as seed. 1% lookalike from 500+ purchasers performs best.',
  },
  {
    keywords: ['retargeting', 'remarketing'],
    answer: 'Retargeting = showing ads to people who already visited your website or engaged with your brand. Use 7-day window for impulse products, 30-day for considered purchases. Always exclude past purchasers from cold campaigns.',
  },
  {
    keywords: ['advantage plus', 'advantage+', 'asc'],
    answer: "Advantage+ Shopping (ASC) is Meta's AI-powered campaign type. It automates targeting, creative delivery and budget allocation. Works best with ₹1000+/day budget and pixel data. Outperforms manual campaigns by 17-32% on average.",
  },
  {
    keywords: ['ugc', 'user generated content', 'creator'],
    answer: 'UGC (User Generated Content) = videos or photos created by real customers or creators in a natural, authentic style. Shot on phone beats professional studio content. UGC gets 3-5x better CTR and costs less to produce (₹3,000-8,000 per creator).',
  },
  {
    keywords: ['creative fatigue', 'ad fatigue', 'frequency'],
    answer: 'Creative Fatigue happens when your audience has seen your ad too many times — CTR drops, CPM rises, ROAS falls. Signs: frequency above 3, CTR dropping week over week. Fix: add fresh creatives every 3-4 weeks.',
  },
  {
    keywords: ['cod', 'cash on delivery'],
    answer: 'COD (Cash on Delivery) is a major trust signal for Indian D2C brands. Mentioning COD in ad copies increases CTR by 20-40%. If you offer COD, always include it in your primary ad text and target Tier 2/3 cities aggressively.',
  },
  {
    keywords: ['budget', 'how much to spend', 'minimum budget'],
    answer: 'Minimum viable budget: ₹500/day per ad set to exit learning phase. Monthly breakdown: Under ₹5k = 1 ad set only. ₹5k-15k = 2 ad sets. ₹15k-30k = full funnel (3 ad sets). ₹30k+ = scale and test lookalikes.',
  },
  {
    keywords: ['cold audience', 'cold traffic'],
    answer: 'Cold Audience = people who have never interacted with your brand. Requires more trust-building. Best formats: Reels with strong hook, UGC style, problem-solution approach. Allocate 60-70% of budget to cold prospecting.',
  },
  {
    keywords: ['warm audience', 'warm traffic'],
    answer: 'Warm Audience = people who visited your website, watched your videos or engaged with your content. More likely to buy than cold. Use shorter, offer-focused ads. Retargeting window: 7 days for impulse, 30 days for considered purchases.',
  },
  {
    keywords: ['instagram reels', 'reels', 'video ads'],
    answer: 'Reels outperform static images 3-5x for cold traffic in India. First 3 seconds are everything — must stop the scroll. UGC style (shot on phone) beats studio production. Keep Reels 15-30 seconds for best results.',
  },
  {
    keywords: ['interest targeting', 'interests', 'targeting'],
    answer: 'Use specific brand interests (Nykaa, Myntra, Mamaearth) not generic categories. Always include "Engaged Shoppers" behavior for D2C. Broad targeting now beats hyper-niche — Meta AI handles discovery. Provide 8-10 relevant interests.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste'],
    answer: "Hello! I'm Meta Mitra, your Optimeta AI assistant. I can help you with Meta ads terms, your campaigns, plan details and strategy tips. What would you like to know?",
  },
];

function truncateName(name: string, maxLen = 30): string {
  if (!name) return 'Your Campaign';
  return name.length > maxLen ? name.substring(0, maxLen) + '...' : name;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAnswer(query: string, campaigns: any[]): string {
  const q = query.toLowerCase().trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getName = (c: any, i?: number) => {
    const raw =
      c.campaignName ||
      c.campaign_name ||
      (c.business_inputs?.businessName ? c.business_inputs.businessName + ' Campaign' : null) ||
      `Campaign ${(i ?? 0) + 1}`;
    return truncateName(raw);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaignNameMatch = campaigns.find(c =>
    q.includes(getName(c).toLowerCase().substring(0, 10)) ||
    q.includes(c.business_inputs?.businessName?.toLowerCase() || '')
  );

  if (q.includes('my campaign') || q.includes('all campaign') || q.includes('list campaign') || q.includes('show campaign') || q.includes('campaigns i have') || q.includes('generated campaign')) {
    if (campaigns.length === 0) return 'You have not generated any campaigns yet. Click "New Campaign" to create your first Meta ad campaign blueprint.';
    const list = campaigns.slice(0, 5).map((c: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const name = truncateName(getName(c, i), 28);
      let dateStr = 'Recent';
      try {
        const dateVal = c.createdAt || c.created_at;
        if (dateVal) { const d = new Date(dateVal); if (!isNaN(d.getTime())) dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
      } catch { dateStr = 'Recent'; }
      return `${i + 1}. ${name}\n   📅 ${dateStr}`;
    }).join('\n\n');
    return `You have ${campaigns.length} campaign${campaigns.length > 1 ? 's' : ''}:\n\n${list}\n\nAsk me about any specific campaign for details.`;
  }

  if (q.includes('latest campaign') || q.includes('last campaign') || q.includes('recent campaign') || q.includes('my last')) {
    if (campaigns.length === 0) return 'You have not generated any campaigns yet. Click "New Campaign" to get started.';
    const latest = campaigns[0];
    const bp = latest.blueprint;
    const inputs = latest.business_inputs;
    return `Your latest campaign is "${getName(latest)}" for ${inputs?.businessName || 'your business'}.\n\nObjective: ${bp?.campaign_objective?.recommended || 'N/A'}\nDaily Budget: ₹${bp?.budget_strategy?.recommended_daily_budget_inr || 'N/A'}\nFunnel Stage: ${bp?.funnel_strategy?.stage || 'N/A'}\n\nOpen the campaign to see full targeting, ad copies and checklist.`;
  }

  if ((q.includes('targeting') || q.includes('audience') || q.includes('interests') || q.includes('behaviors')) && campaigns.length > 0) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const targeting = bp?.targeting;
    if (!targeting) return `Open "${getName(campaign)}" from your dashboard to see the full targeting — interests, behaviors, locations and audience combinations.`;
    const interests = targeting?.primary_audience?.interests?.slice(0, 5)?.join(', ') || 'N/A';
    const behaviors = targeting?.primary_audience?.behaviors?.slice(0, 3)?.join(', ') || 'N/A';
    return `Targeting for "${getName(campaign)}":\n\nAudience: ${targeting?.primary_audience?.age_range || ''} ${targeting?.primary_audience?.gender || ''}\nLocations: ${targeting?.primary_audience?.locations?.join(', ') || 'N/A'}\nTop Interests: ${interests}\nBehaviors: ${behaviors}\nApproach: ${targeting?.approach || 'N/A'}\n\nOpen the full blueprint for complete targeting combinations.`;
  }

  if ((q.includes('ad copy') || q.includes('copies') || q.includes('ad text') || q.includes('headline') || q.includes('hook')) && campaigns.length > 0) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const copies = bp?.ad_copies;
    if (!copies || copies.length === 0) return `Open "${getName(campaign)}" from your dashboard to see all 3 ad copies — primary text, headline, CTA and placement for each.`;
    const first = copies[0];
    return `First ad copy for "${getName(campaign)}":\n\n🎯 Hook: ${first.hook}\n\nPrimary Text: ${first.primary_text?.substring(0, 120)}...\n\nHeadline: ${first.headline}\nCTA: ${first.cta}\nPlacement: ${first.placement}\n\nOpen the full blueprint to see all 3 ad copies.`;
  }

  if ((q.includes('budget') || q.includes('spend') || q.includes('daily budget') || q.includes('how much')) && campaigns.length > 0 && q.includes('campaign')) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const budget = bp?.budget_strategy;
    if (!budget) return `Open "${getName(campaign)}" from your dashboard to see the full budget strategy and daily spend recommendation.`;
    return `Budget for "${getName(campaign)}":\n\nDaily Budget: ₹${budget.recommended_daily_budget_inr}\nMonthly Total: ₹${budget.total_monthly_inr}\n\nSplit:\n• Cold Prospecting: ${budget.split?.cold_prospecting}\n• Warm Retargeting: ${budget.split?.warm_retargeting}\n• Lookalike: ${budget.split?.lookalike}\n\nScaling: ${budget.scaling_logic}`;
  }

  if ((q.includes('objective') || q.includes('goal') || q.includes('campaign type')) && campaigns.length > 0) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const obj = bp?.campaign_objective;
    if (!obj) return `Open "${getName(campaign)}" from your dashboard to see the recommended campaign objective and Meta Ads Manager settings.`;
    return `Campaign objective for "${getName(campaign)}":\n\nRecommended: ${obj.recommended}\nIn Meta Ads Manager select: "${obj.meta_objective_name}"\n\nWhy: ${obj.reason}\n\nAvoid: ${obj.what_to_avoid}`;
  }

  if (q.includes('checklist') || q.includes('launch') || q.includes('steps to launch') || q.includes('how to launch')) {
    if (campaigns.length > 0) {
      const campaign = campaignNameMatch || campaigns[0];
      const bp = campaign.blueprint;
      const checklist = bp?.launch_checklist;
      if (checklist && checklist.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const steps = checklist.slice(0, 5).map((item: any) => `${item.step}. ${item.action} (${item.time_estimate})`).join('\n');
        return `Launch checklist for "${getName(campaign)}":\n\n${steps}\n\nOpen the full blueprint to see all steps and check them off as you complete them.`;
      }
    }
    return 'To launch your Meta campaign: 1. Install Meta Pixel on website 2. Set up Conversions API 3. Create campaign in Meta Ads Manager 4. Set up ad sets with recommended targeting 5. Upload creatives 6. Set budget and schedule 7. Review and publish 8. Monitor for 7 days without editing.';
  }

  if ((q.includes('benchmark') || q.includes('expected roas') || q.includes('expected ctr') || q.includes('performance')) && campaigns.length > 0) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const perf = bp?.performance_benchmarks;
    if (!perf) return `Open "${getName(campaign)}" from your dashboard to see expected ROAS, CTR, CPM and CPC benchmarks.`;
    return `Expected performance for "${getName(campaign)}":\n\nTarget ROAS: ${perf.your_target_roas}\nExpected CTR (Feed): ${perf.expected_ctr_feed}\nExpected CTR (Reels): ${perf.expected_ctr_reels}\nExpected CPM: ₹${perf.expected_cpm_inr}\nExpected CPC: ₹${perf.expected_cpc_inr}\nLearning Phase: ${perf.learning_phase_duration}`;
  }

  if (q.includes('7 days') || q.includes('seven days') || q.includes('first week') || q.includes('what to do after launch')) {
    if (campaigns.length > 0) {
      const campaign = campaignNameMatch || campaigns[0];
      const bp = campaign.blueprint;
      const plan = bp?.first_7_days_plan;
      if (plan) return `First 7 days plan for "${getName(campaign)}":\n\nDay 1-3: ${plan.day_1_3}\n\nDay 4-7: ${plan.day_4_7}\n\nWhen to edit: ${plan.when_to_edit}\n\n✅ Green flags: ${plan.green_flags?.join(', ')}\n\n🚨 Red flags: ${plan.red_flags?.join(', ')}`;
    }
    return 'First 7 days after launching Meta ads: Day 1-3: Do NOT touch anything. Let Meta learn. Day 4-7: Check CPM and CTR only. If CTR below 0.5% after day 5, consider new creative. Never edit targeting or budget in first 7 days — it resets the learning phase.';
  }

  if (q.includes('how many campaigns left') || q.includes('campaigns remaining') || q.includes('campaigns left') || q.includes('limit remaining')) {
    return 'Check your campaigns remaining counter in the dashboard header — it shows how many blueprints you have left this month. Free: 1 lifetime. Pro: 5/month. Ultra: 10/month.';
  }

  let bestMatch = null;
  let bestScore = 0;
  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (q.includes(keyword.toLowerCase())) score += keyword.length;
    }
    if (score > bestScore) { bestScore = score; bestMatch = item; }
  }
  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return `I don't have a specific answer for that. ${campaigns.length > 0 ? `You can ask me about your ${campaigns.length} campaign${campaigns.length > 1 ? 's' : ''} — try "show my campaigns", "latest campaign", or "what is ROAS". ` : ''}For more help email optimeta@outlook.com`;
}

const PLAN_CREDITS: Record<string, number> = { free: 10, pro: 100, ultra: 300 };

function calculateCreditCost(msg: string): number {
  const len = msg.trim().length;
  if (len < 50) return 0.5;
  if (len < 150) return 1;
  return 2;
}

function needsAI(message: string): boolean {
  const q = message.toLowerCase();
  const faqTerms = [
    'what is roas','what is ctr','what is cpm','what is cpc','what is tofu','what is mofu',
    'what is bofu','what is ugc','what is capi','what is asc','what is lookalike',
    'what is retargeting','what is learning phase','what is advantage+','what is creative fatigue',
    'what is cold audience','what is warm audience','how does optimeta work','how to use optimeta',
    'what is optimeta','pro plan','ultra plan','free plan','how to cancel','how many campaigns',
    'what is cod','show my campaigns','my campaigns','list campaigns','thank you',
    'thanks','okay','ok','bye','hello','hi','hey',
  ];
  return !faqTerms.some(t => q.includes(t));
}

// ── Types ─────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  creditsUsed?: number;
  fromCache?: boolean;
}

interface Credits {
  credits_remaining: number;
  credits_limit: number;
  credits_used: number;
  plan: string;
}

// ── Galaxy animation data (deterministic to avoid SSR mismatch) ─
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: ((i * 137.508) % 100).toFixed(1),
  y: ((i * 61.803) % 100).toFixed(1),
  size: i % 4 === 0 ? 1.5 : 1,
  opacity: 0.08 + (i % 8) * 0.08,
  duration: 2 + (i % 4) * 0.7,
  delay: (i % 7) * 0.35,
}));

const GALAXY_RINGS = [
  { r: 80,  dur: 7,  rev: false, op: 0.28, dot: 5 },
  { r: 130, dur: 12, rev: true,  op: 0.18, dot: 4 },
  { r: 195, dur: 18, rev: false, op: 0.12, dot: 3 },
  { r: 270, dur: 26, rev: true,  op: 0.07, dot: 2 },
];

// ── Galaxy intro screen ───────────────────────────────────────
function GalaxyScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      // Circle expands from where the floating button sits (bottom-right)
      initial={{ clipPath: 'circle(4% at calc(100% - 52px) calc(100% - 52px))' }}
      animate={{ clipPath: 'circle(200% at calc(100% - 52px) calc(100% - 52px))' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0e0520 0%, #030308 65%)',
      }}
    >
      {/* Star field */}
      {STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.15, s.opacity] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* Nebula glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,190,0.18) 0%, rgba(192,38,211,0.08) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Galaxy rings with orbiting dots */}
      {GALAXY_RINGS.map((ring, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ring.r * 2,
            height: ring.r * 2,
            border: `1px solid rgba(${i % 2 === 0 ? '123,47,190' : '192,38,211'},${ring.op})`,
          }}
          animate={{ rotate: ring.rev ? -360 : 360 }}
          transition={{ duration: ring.dur, repeat: Infinity, ease: 'linear' }}
        >
          {/* Orbiting dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: ring.dot,
              height: ring.dot,
              top: -ring.dot / 2,
              left: `calc(50% - ${ring.dot / 2}px)`,
              background: i % 2 === 0 ? '#7B2FBE' : '#C026D3',
              boxShadow: `0 0 ${ring.dot * 2}px ${i % 2 === 0 ? '#7B2FBE' : '#C026D3'}`,
            }}
          />
        </motion.div>
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(123,47,190,0.5), rgba(192,38,211,0.8), rgba(123,47,190,0.5), transparent)',
          boxShadow: '0 0 12px rgba(192,38,211,0.6)',
        }}
        initial={{ top: '-5%' }}
        animate={{ top: '105%' }}
        transition={{ duration: 2.5, ease: 'linear', repeat: Infinity, delay: 0.8 }}
      />

      {/* Center orb + text (springs in after screen expands) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6, type: 'spring', stiffness: 180 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Large orb */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer rotating conic ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #7B2FBE, #C026D3, #ff6ef7, #7B2FBE00, #7B2FBE)',
              padding: '3px',
            }}
          >
            <div className="w-full h-full rounded-full" style={{ background: '#0e0520' }} />
          </motion.div>

          {/* Pulse glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.35) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(123,47,190,0.25) 0%, transparent 70%)' }}
            animate={{ scale: [1, 2.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.8, delay: 0.4, repeat: Infinity }}
          />

          {/* Inner glowing orb */}
          <motion.div
            className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(123,47,190,0.7), 0 0 50px rgba(123,47,190,0.3)',
                '0 0 35px rgba(192,38,211,1), 0 0 70px rgba(192,38,211,0.5)',
                '0 0 20px rgba(123,47,190,0.7), 0 0 50px rgba(123,47,190,0.3)',
              ],
            }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <motion.span
              className="text-white font-black text-3xl leading-none select-none"
              animate={{ scale: [0.88, 1.14, 0.88] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              M
            </motion.span>
            <motion.span
              className="absolute -top-2 -right-2 text-[11px] text-[#C026D3] select-none"
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 0.4], rotate: [0, 200, 360] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              ✦
            </motion.span>
          </motion.div>
        </div>

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.55 }}
          className="text-center"
        >
          <p className="text-white font-black text-2xl tracking-wide">Meta Mitra</p>
          <p className="text-[#9B6FDE] text-sm mt-0.5">AI-powered Meta ads expert</p>
          <p className="text-[#5B3F8E] text-xs mt-0.5">by Optimeta</p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: i % 2 === 0 ? '#7B2FBE' : '#C026D3' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-7 h-7`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08 }}
          style={{
            borderTop: i < 2 ? '1px solid rgba(123,47,190,0.35)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(123,47,190,0.35)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(123,47,190,0.35)' : 'none',
            borderRight: i % 2 === 1 ? '1px solid rgba(123,47,190,0.35)' : 'none',
          }}
        />
      ))}
    </motion.div>
  );
}

// ── Small animated orb for chat header ───────────────────────
function AnimatedOrb({ thinking }: { thinking: boolean }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: thinking ? 1.6 : 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{
          background: thinking
            ? 'conic-gradient(from 0deg, #C026D3, #7B2FBE, #C026D300, #C026D3)'
            : 'conic-gradient(from 0deg, #7B2FBE, #C026D3, #7B2FBE00, #7B2FBE)',
          padding: '2px',
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#030308' }} />
      </motion.div>

      {thinking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      )}

      <motion.div
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}
        animate={{
          boxShadow: thinking
            ? ['0 0 12px rgba(192,38,211,0.7)', '0 0 26px rgba(123,47,190,1)', '0 0 12px rgba(192,38,211,0.7)']
            : ['0 0 8px rgba(123,47,190,0.4)', '0 0 16px rgba(192,38,211,0.6)', '0 0 8px rgba(123,47,190,0.4)'],
        }}
        transition={{ duration: thinking ? 0.7 : 2, repeat: Infinity }}
      >
        <motion.span
          className="text-white font-black text-lg leading-none select-none"
          animate={thinking ? { scale: [0.8, 1.2, 0.8] } : { scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: thinking ? 0.55 : 2, repeat: Infinity }}
        >
          M
        </motion.span>
        <motion.span
          className="absolute -top-1 -right-1 text-[8px] text-[#C026D3] select-none"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
        >
          ✦
        </motion.span>
      </motion.div>
    </div>
  );
}

// ── Credits badge ─────────────────────────────────────────────
function CreditsBadge({ credits }: { credits: Credits | null }) {
  if (!credits) return null;
  const pct = credits.credits_remaining / credits.credits_limit;
  const color = pct > 0.3 ? '#22c55e' : pct > 0.1 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm">
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-[10px] font-semibold" style={{ color }}>{credits.credits_remaining.toFixed(1)}</span>
      <span className="text-[10px] text-white/40">credits</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function FAQAssistant() {
  const [phase, setPhase] = useState<'closed' | 'galaxy' | 'chat'>('closed');
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [credits, setCredits] = useState<Credits | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('optimeta_token') : null;

  const fetchCredits = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCredits(data.data);
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const list = data.data?.campaigns || data.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCampaigns((Array.isArray(list) ? list : []).filter((c: any) =>
          c && (c.campaignName || c.campaign_name || c.business_inputs?.businessName)
        ));
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (phase === 'chat') setTimeout(() => inputRef.current?.focus(), 400);
  }, [phase]);

  const handleOpen = () => {
    fetchCredits();
    if (hasOpened) {
      // Skip galaxy on return visits — go straight to chat
      setPhase('chat');
    } else {
      setHasOpened(true);
      setPhase('galaxy');
    }
  };

  const handleGalaxyComplete = () => {
    setPhase('chat');
    if (messages.length === 0) {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: `Hey! I'm **Meta Mitra** — your personal Meta ads expert by Optimeta. 🚀\n\nI can help you with:\n• Your campaign targeting & strategy\n• Ad copy and creative direction\n• Budget planning and ROAS optimization\n• Meta ads terms and best practices\n\nWhat would you like to know?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const sendMessage = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || thinking) return;

    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query, time }]);
    setThinking(true);

    if (!needsAI(query)) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: getAnswer(query, campaigns),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          creditsUsed: 0,
          fromCache: true,
        }]);
        setThinking(false);
      }, 500);
      return;
    }

    if (!token) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Please log in to use the AI assistant.', time }]);
      setThinking(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaignContext = campaigns.slice(0, 3).map((c: any) => {
      const name = truncateName(c.campaignName || c.campaign_name || (c.business_inputs?.businessName ? c.business_inputs.businessName + ' Campaign' : 'Unnamed'));
      const bp = c.blueprint;
      return [`Campaign: ${name}`, `Objective: ${bp?.campaign_objective?.recommended || 'N/A'}`, `Budget: ₹${bp?.budget_strategy?.recommended_daily_budget_inr || 'N/A'}/day`, `Target: ${[bp?.targeting?.primary_audience?.age_range, bp?.targeting?.primary_audience?.gender].filter(Boolean).join(' ')}`].join('\n');
    }).join('\n\n');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: query, history: history.slice(-3), campaignContext }),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.code === 'NO_CREDITS') {
          setMessages(prev => [...prev, {
            id: Date.now().toString(), role: 'assistant',
            content: `You've used all your credits for this month. ${data.plan === 'free' ? 'Upgrade to Pro for 100 credits/month!' : data.plan === 'pro' ? 'Upgrade to Ultra for 300 credits/month!' : 'Your credits reset on your next billing date.'}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
          setThinking(false);
          return;
        }
        throw new Error(data.message);
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: data.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        creditsUsed: data.data.credits_used,
      }]);
      setHistory(prev => [...prev.slice(-4), { role: 'user', content: query }, { role: 'assistant', content: data.data.reply }]);
      if (credits) setCredits(prev => prev ? { ...prev, credits_remaining: data.data.credits_remaining, credits_used: prev.credits_limit - data.data.credits_remaining } : null);

      if (data.data.low_credits) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + 'w', role: 'assistant',
            content: `⚠️ You're running low on credits (${data.data.credits_remaining.toFixed(1)} remaining). Upgrade your plan to continue getting AI-powered advice.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
        }, 1000);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const SUGGESTIONS = campaigns.length > 0
    ? ['Show my campaigns', 'Latest campaign targeting', 'My ad copies', 'Expected ROAS', 'First 7 days plan']
    : ['How does Optimeta work?', 'What is ROAS?', 'Minimum budget for India?', 'What is Learning Phase?', 'COD strategy for ads?'];

  return (
    <>
      {/* ── Floating button (visible when closed) ── */}
      <AnimatePresence>
        {phase === 'closed' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5 group"
            aria-label="Open Meta Mitra AI"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[10px] font-semibold text-[#A0A0C0] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0F0F1A]/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#1E1E3A] whitespace-nowrap"
            >
              Optimeta AI
            </motion.span>

            <div className="relative w-14 h-14">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ background: 'conic-gradient(from 0deg, #7B2FBE, #C026D3, #7B2FBE00, #7B2FBE)', padding: '2px' }}
              >
                <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.3) 0%, transparent 70%)' }}
              />
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0F0F1A] to-[#141428] flex items-center justify-center border border-[#7B2FBE]/20">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ boxShadow: ['0 0 8px rgba(123,47,190,0.6)', '0 0 16px rgba(192,38,211,0.8)', '0 0 8px rgba(123,47,190,0.6)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(#0F0F1A, #0F0F1A) padding-box, linear-gradient(135deg, #7B2FBE, #C026D3) border-box', border: '2px solid transparent' }}
                  >
                    <motion.div
                      animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)', boxShadow: '0 0 8px rgba(192,38,211,0.8)' }}
                    />
                  </motion.div>
                  <motion.span
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -top-1 -right-1 text-[8px] text-[#C026D3]"
                  >✦</motion.span>
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Galaxy intro (first open only) ── */}
      <AnimatePresence>
        {phase === 'galaxy' && <GalaxyScreen onComplete={handleGalaxyComplete} />}
      </AnimatePresence>

      {/* ── Full-screen chat ── */}
      <AnimatePresence>
        {phase === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{
              background: 'radial-gradient(ellipse at top center, rgba(123,47,190,0.13) 0%, #030308 55%)',
              backgroundImage: `
                radial-gradient(ellipse at top center, rgba(123,47,190,0.13) 0%, #030308 55%),
                linear-gradient(rgba(123,47,190,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(123,47,190,0.03) 1px, transparent 1px)
              `,
              backgroundSize: 'auto, 44px 44px, 44px 44px',
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-white/5">
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPhase('closed')}
                className="flex items-center gap-1.5 text-[#606080] hover:text-white transition-colors text-sm"
              >
                <ArrowLeft size={15} />
                <span className="text-xs">Back</span>
              </motion.button>

              <span className="text-[11px] text-[#404060] font-medium tracking-widest uppercase">Meta Mitra AI</span>

              <CreditsBadge credits={credits} />
            </div>

            {/* Logo section — always visible in center-top */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2 py-5">
              <AnimatedOrb thinking={thinking} />
              <div className="text-center">
                <p className="text-white font-black text-lg leading-none">Meta Mitra</p>
                <p className="text-[#7B2FBE] text-[11px] mt-0.5">AI-powered Meta ads expert · by Optimeta</p>
              </div>
              {/* Glowing divider */}
              <div
                className="w-full max-w-sm h-px mt-3"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(123,47,190,0.4) 30%, rgba(192,38,211,0.4) 50%, rgba(123,47,190,0.4) 70%, transparent)' }}
              />
            </div>

            {/* Messages — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 flex flex-col gap-3 min-h-0">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mb-1"
                      style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}>
                      <span className="text-white text-[9px] font-black">M</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] sm:max-w-[65%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-sm text-white'
                          : 'rounded-bl-sm text-[#D0D0E8] border border-white/8'
                      }`}
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #7B2FBE, #C026D3)'
                          : 'rgba(15,8,30,0.85)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] text-[#404060]">{msg.time}</span>
                      {msg.creditsUsed !== undefined && msg.creditsUsed > 0 && (
                        <span className="text-[10px] text-[#404060] flex items-center gap-0.5">
                          <Zap size={8} />{msg.creditsUsed} cr
                        </span>
                      )}
                      {msg.fromCache && <span className="text-[10px] text-[#22c55e]">free</span>}
                    </div>
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}>
                    <span className="text-white text-[9px] font-black">M</span>
                  </div>
                  <div className="bg-[#0F081E] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5" style={{ backdropFilter: 'blur(10px)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE]"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.length <= 1 && !thinking && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => sendMessage(s)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[#0F081E]/80 border border-white/10 text-[#A0A0C0] hover:border-[#7B2FBE]/50 hover:text-white transition-all"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      <ChevronRight size={10} />
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar — pinned to bottom */}
            <div
              className="flex-shrink-0 px-4 py-3 border-t border-white/5"
              style={{ background: 'rgba(3,3,8,0.85)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex gap-2 max-w-2xl mx-auto">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about Meta ads strategy..."
                  maxLength={500}
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-[#404060] focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(15,8,30,0.9)',
                    border: '1px solid rgba(123,47,190,0.2)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(123,47,190,0.55)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(123,47,190,0.2)'; }}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || thinking}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: input.trim() && !thinking
                      ? 'linear-gradient(135deg, #7B2FBE, #C026D3)'
                      : 'rgba(30,20,50,0.8)',
                    boxShadow: input.trim() && !thinking ? '0 0 16px rgba(192,38,211,0.4)' : 'none',
                  }}
                >
                  <Send size={16} />
                </motion.button>
              </div>

              {credits && (
                <div className="flex items-center justify-between mt-2 max-w-2xl mx-auto">
                  <span className="text-[10px] text-[#404060]">Simple questions are free · AI answers use credits</span>
                  {credits.plan === 'free' && credits.credits_remaining < 3 && (
                    <button
                      onClick={() => { window.location.href = '/dashboard/upgrade?plan=pro'; }}
                      className="text-[10px] text-[#7B2FBE] font-semibold hover:text-[#C026D3] transition-colors"
                    >
                      Upgrade →
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';

const KNOWLEDGE_BASE = [
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
    answer: "Hello! I'm the Optimeta Help Assistant. I can help you with Meta ads terms, how to use Optimeta, plan details and campaign tips. What would you like to know?",
  },
];

interface Message {
  type: 'user' | 'bot';
  text: string;
  time: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAnswer(query: string, campaigns: any[]): string {
  const q = query.toLowerCase().trim();

  // ── Campaign-specific queries ──────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaignNameMatch = campaigns.find(c =>
    q.includes(c.campaign_name?.toLowerCase().substring(0, 10)) ||
    q.includes(c.business_inputs?.businessName?.toLowerCase())
  );

  if (
    q.includes('my campaign') ||
    q.includes('all campaign') ||
    q.includes('list campaign') ||
    q.includes('show campaign') ||
    q.includes('campaigns i have') ||
    q.includes('generated campaign')
  ) {
    if (campaigns.length === 0) {
      return 'You have not generated any campaigns yet. Click "New Campaign" to create your first Meta ad campaign blueprint.';
    }
    const list = campaigns
      .slice(0, 5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any, i: number) =>
        `${i + 1}. ${c.campaign_name || c.business_inputs?.businessName + ' Campaign'} (${new Date(c.created_at).toLocaleDateString('en-IN')})`
      )
      .join('\n');
    return `You have ${campaigns.length} campaign${campaigns.length > 1 ? 's' : ''}:\n\n${list}\n\nAsk me about any specific campaign for details.`;
  }

  if (
    q.includes('latest campaign') ||
    q.includes('last campaign') ||
    q.includes('recent campaign') ||
    q.includes('my last')
  ) {
    if (campaigns.length === 0) {
      return 'You have not generated any campaigns yet. Click "New Campaign" to get started.';
    }
    const latest = campaigns[0];
    const bp = latest.blueprint;
    const inputs = latest.business_inputs;
    return `Your latest campaign is "${latest.campaign_name}" for ${inputs?.businessName || 'your business'}.\n\nObjective: ${bp?.campaign_objective?.recommended || 'N/A'}\nDaily Budget: ₹${bp?.budget_strategy?.recommended_daily_budget_inr || 'N/A'}\nFunnel Stage: ${bp?.funnel_strategy?.stage || 'N/A'}\n\nAsk me for targeting, ad copies, or checklist details.`;
  }

  if (
    (q.includes('targeting') || q.includes('audience') || q.includes('interests') || q.includes('behaviors')) &&
    campaigns.length > 0
  ) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const targeting = bp?.targeting;
    if (!targeting) {
      return 'Targeting details not found for this campaign. Please open the full campaign blueprint to view targeting.';
    }
    const interests = targeting?.primary_audience?.interests?.slice(0, 5)?.join(', ') || 'N/A';
    const behaviors = targeting?.primary_audience?.behaviors?.slice(0, 3)?.join(', ') || 'N/A';
    return `Targeting for "${campaign.campaign_name}":\n\nAudience: ${targeting?.primary_audience?.age_range || ''} ${targeting?.primary_audience?.gender || ''}\nLocations: ${targeting?.primary_audience?.locations?.join(', ') || 'N/A'}\nTop Interests: ${interests}\nBehaviors: ${behaviors}\nApproach: ${targeting?.approach || 'N/A'}\n\nOpen the full blueprint for complete targeting combinations.`;
  }

  if (
    (q.includes('ad copy') || q.includes('copies') || q.includes('ad text') || q.includes('headline') || q.includes('hook')) &&
    campaigns.length > 0
  ) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const copies = bp?.ad_copies;
    if (!copies || copies.length === 0) {
      return 'Ad copies not found. Please open the full campaign blueprint to view your ad copies.';
    }
    const first = copies[0];
    return `First ad copy for "${campaign.campaign_name}":\n\n🎯 Hook: ${first.hook}\n\nPrimary Text: ${first.primary_text?.substring(0, 120)}...\n\nHeadline: ${first.headline}\nCTA: ${first.cta}\nPlacement: ${first.placement}\n\nOpen the full blueprint to see all 3 ad copies.`;
  }

  if (
    (q.includes('budget') || q.includes('spend') || q.includes('daily budget') || q.includes('how much')) &&
    campaigns.length > 0 &&
    q.includes('campaign')
  ) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const budget = bp?.budget_strategy;
    if (!budget) {
      return 'Budget details not found. Open the full blueprint to view budget strategy.';
    }
    return `Budget for "${campaign.campaign_name}":\n\nDaily Budget: ₹${budget.recommended_daily_budget_inr}\nMonthly Total: ₹${budget.total_monthly_inr}\n\nSplit:\n• Cold Prospecting: ${budget.split?.cold_prospecting}\n• Warm Retargeting: ${budget.split?.warm_retargeting}\n• Lookalike: ${budget.split?.lookalike}\n\nScaling: ${budget.scaling_logic}`;
  }

  if (
    (q.includes('objective') || q.includes('goal') || q.includes('campaign type')) &&
    campaigns.length > 0
  ) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const obj = bp?.campaign_objective;
    if (!obj) {
      return 'Objective details not found. Open the full blueprint for campaign details.';
    }
    return `Campaign objective for "${campaign.campaign_name}":\n\nRecommended: ${obj.recommended}\nIn Meta Ads Manager select: "${obj.meta_objective_name}"\n\nWhy: ${obj.reason}\n\nAvoid: ${obj.what_to_avoid}`;
  }

  if (
    q.includes('checklist') ||
    q.includes('launch') ||
    q.includes('steps to launch') ||
    q.includes('how to launch')
  ) {
    if (campaigns.length > 0) {
      const campaign = campaignNameMatch || campaigns[0];
      const bp = campaign.blueprint;
      const checklist = bp?.launch_checklist;
      if (checklist && checklist.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const steps = checklist.slice(0, 5).map((item: any) => `${item.step}. ${item.action} (${item.time_estimate})`).join('\n');
        return `Launch checklist for "${campaign.campaign_name}":\n\n${steps}\n\nOpen the full blueprint to see all steps and check them off as you complete them.`;
      }
    }
    return 'To launch your Meta campaign: 1. Install Meta Pixel on website 2. Set up Conversions API 3. Create campaign in Meta Ads Manager 4. Set up ad sets with recommended targeting 5. Upload creatives 6. Set budget and schedule 7. Review and publish 8. Monitor for 7 days without editing.';
  }

  if (
    (q.includes('benchmark') || q.includes('expected roas') || q.includes('expected ctr') || q.includes('performance')) &&
    campaigns.length > 0
  ) {
    const campaign = campaignNameMatch || campaigns[0];
    const bp = campaign.blueprint;
    const perf = bp?.performance_benchmarks;
    if (!perf) {
      return 'Performance benchmarks not found. Open the full blueprint for expected metrics.';
    }
    return `Expected performance for "${campaign.campaign_name}":\n\nTarget ROAS: ${perf.your_target_roas}\nExpected CTR (Feed): ${perf.expected_ctr_feed}\nExpected CTR (Reels): ${perf.expected_ctr_reels}\nExpected CPM: ₹${perf.expected_cpm_inr}\nExpected CPC: ₹${perf.expected_cpc_inr}\nLearning Phase: ${perf.learning_phase_duration}`;
  }

  if (
    q.includes('7 days') ||
    q.includes('seven days') ||
    q.includes('first week') ||
    q.includes('what to do after launch')
  ) {
    if (campaigns.length > 0) {
      const campaign = campaignNameMatch || campaigns[0];
      const bp = campaign.blueprint;
      const plan = bp?.first_7_days_plan;
      if (plan) {
        return `First 7 days plan for "${campaign.campaign_name}":\n\nDay 1-3: ${plan.day_1_3}\n\nDay 4-7: ${plan.day_4_7}\n\nWhen to edit: ${plan.when_to_edit}\n\n✅ Green flags: ${plan.green_flags?.join(', ')}\n\n🚨 Red flags: ${plan.red_flags?.join(', ')}`;
      }
    }
    return 'First 7 days after launching Meta ads: Day 1-3: Do NOT touch anything. Let Meta learn. Day 4-7: Check CPM and CTR only. If CTR below 0.5% after day 5, consider new creative. Never edit targeting or budget in first 7 days — it resets the learning phase.';
  }

  if (
    q.includes('how many campaigns left') ||
    q.includes('campaigns remaining') ||
    q.includes('campaigns left') ||
    q.includes('limit remaining')
  ) {
    return 'Check your campaigns remaining counter in the dashboard header — it shows how many blueprints you have left this month. Free: 1 lifetime. Pro: 5/month. Ultra: 10/month.';
  }

  // ── General knowledge base ─────────────────────────────────

  let bestMatch = null;
  let bestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return `I don't have a specific answer for that. ${campaigns.length > 0 ? `You can also ask me about your ${campaigns.length} generated campaign${campaigns.length > 1 ? 's' : ''} — targeting, ad copies, budget, checklist or performance benchmarks. ` : ''}For more help email optimeta@outlook.com`;
}

export function FAQAssistant() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignsLoaded, setCampaignsLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: "Hi! I'm your Optimeta assistant. I can answer Meta ads questions and help you understand your generated campaigns. Ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('optimeta_token');
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCampaigns(data.data.campaigns ?? data.data);
        }
      } catch (e) {
        console.error('Campaign fetch error:', e);
      } finally {
        setCampaignsLoaded(true);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const suggestions = campaigns.length > 0
    ? ['Show my campaigns', 'Latest campaign targeting', 'My last ad copies', 'Expected ROAS', 'First 7 days plan', 'What is ROAS?', 'Minimum budget?', 'What is Learning Phase?']
    : ['How does Optimeta work?', 'What is ROAS?', 'What is Learning Phase?', 'Minimum budget?', 'What is UGC?', 'What is Advantage+?', 'How to cancel?', 'What is COD strategy?'];

  const sendMessage = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { type: 'user', text: query, time }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const answer = getAnswer(query, campaigns);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setTyping(false);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] shadow-[0_4px_20px_rgba(123,47,190,0.5)] flex items-center justify-center text-white"
            aria-label="Open help assistant"
          >
            <MessageCircle size={22} />
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[520px] flex flex-col bg-[#0F0F1A] border border-[#1E1E3A] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(123,47,190,0.2)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#7B2FBE]/20 to-[#C026D3]/20 border-b border-[#1E1E3A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] flex items-center justify-center text-white text-sm font-bold">
                  O
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">Optimeta Assistant</p>
                  <p className="text-[#606080] text-xs mt-0.5">
                    {!campaignsLoaded && (
                      <span className="animate-pulse">Loading your campaigns...</span>
                    )}
                    {campaignsLoaded && campaigns.length > 0 && (
                      <span className="text-[#22c55e]">{campaigns.length} campaign{campaigns.length > 1 ? 's' : ''} loaded</span>
                    )}
                    {campaignsLoaded && campaigns.length === 0 && (
                      <span>Meta ads help</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1E1E3A] flex items-center justify-center text-[#606080] hover:text-white hover:bg-[#2E2E4A] transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] text-white rounded-br-sm'
                        : 'bg-[#141428] text-[#A0A0C0] border border-[#1E1E3A] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-white/60 text-right' : 'text-[#606080]'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-[#141428] border border-[#1E1E3A] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#7B2FBE] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#141428] border border-[#1E1E3A] text-[#A0A0C0] hover:border-[#7B2FBE]/50 hover:text-white transition-all whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#1E1E3A] flex gap-2 flex-shrink-0 bg-[#0A0A0F]">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about Meta ads or your campaigns..."
                className="flex-1 bg-[#141428] border border-[#1E1E3A] rounded-xl px-3 py-2 text-sm text-white placeholder-[#606080] focus:outline-none focus:border-[#7B2FBE]/50 transition-colors"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B2FBE] to-[#C026D3] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_12px_rgba(123,47,190,0.4)] transition-all flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

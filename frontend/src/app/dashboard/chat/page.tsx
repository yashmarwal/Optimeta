'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, ChevronRight } from 'lucide-react';

// ── Galaxy Orb ─────────────────────────────────────────────────────────────

function GalaxyOrb({
  phase,
  size = 80,
}: {
  phase: 'center' | 'galaxy' | 'expanding';
  size?: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Ring 1 — slow outer */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: phase === 'galaxy' ? 3 : 6,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, #7B2FBE, #C026D3, transparent, #7B2FBE)`,
          padding: '1.5px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Ring 2 — counter rotate */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: phase === 'galaxy' ? 2 : 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute rounded-full"
        style={{
          inset: '10%',
          background: `conic-gradient(from 180deg, #C026D3, transparent, #7B2FBE, transparent)`,
          padding: '1px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Ring 3 — fast inner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: phase === 'galaxy' ? 1.2 : 2.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute rounded-full"
        style={{
          inset: '22%',
          background: `conic-gradient(from 90deg, #7B2FBE, #C026D300, #C026D3, #7B2FBE00)`,
          padding: '1px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0A0A0F]" />
      </motion.div>

      {/* Orbiting particle dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            duration: phase === 'galaxy' ? 1.5 + i * 0.2 : 3 + i * 0.4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1,
          }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
        >
          <motion.div
            animate={{
              opacity: phase === 'galaxy' ? [0.4, 1, 0.4] : [0.2, 0.6, 0.2],
              scale: phase === 'galaxy' ? [0.8, 1.3, 0.8] : [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: '4%',
              left: '50%',
              transform: `translateX(-50%) rotate(${deg}deg) translateY(-${size * 0.42}px)`,
              background: i % 2 === 0 ? '#7B2FBE' : '#C026D3',
              boxShadow: `0 0 6px ${i % 2 === 0 ? '#7B2FBE' : '#C026D3'}`,
            }}
          />
        </motion.div>
      ))}

      {/* Pulse glow ring 1 */}
      <motion.div
        animate={{
          scale: phase === 'galaxy' ? [1, 1.8, 1] : [1, 1.3, 1],
          opacity: phase === 'galaxy' ? [0.4, 0, 0.4] : [0.2, 0, 0.2],
        }}
        transition={{ duration: phase === 'galaxy' ? 1 : 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(192,38,211,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Pulse glow ring 2 */}
      <motion.div
        animate={{
          scale: phase === 'galaxy' ? [1, 2.4, 1] : [1, 1.6, 1],
          opacity: phase === 'galaxy' ? [0.3, 0, 0.3] : [0.15, 0, 0.15],
        }}
        transition={{
          duration: phase === 'galaxy' ? 1 : 2,
          delay: 0.4,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(123,47,190,0.3) 0%, transparent 70%)',
        }}
      />

      {/* Center core */}
      <motion.div
        animate={{
          boxShadow:
            phase === 'galaxy'
              ? [
                  '0 0 20px rgba(123,47,190,0.8), 0 0 40px rgba(192,38,211,0.4)',
                  '0 0 40px rgba(192,38,211,1), 0 0 80px rgba(123,47,190,0.6)',
                  '0 0 20px rgba(123,47,190,0.8), 0 0 40px rgba(192,38,211,0.4)',
                ]
              : [
                  '0 0 10px rgba(123,47,190,0.5)',
                  '0 0 20px rgba(192,38,211,0.7)',
                  '0 0 10px rgba(123,47,190,0.5)',
                ],
        }}
        transition={{
          duration: phase === 'galaxy' ? 0.8 : 2,
          repeat: Infinity,
        }}
        className="absolute rounded-full"
        style={{
          inset: '30%',
          background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
        }}
      />
    </div>
  );
}

// ── Knowledge base ──────────────────────────────────────────────────────────

const KNOWLEDGE_BASE = [
  {
    keywords: ['what is optimeta', 'optimeta', 'platform', 'about optimeta'],
    answer:
      'Optimeta is an AI-powered Meta ad campaign architect built for Indian brands. You answer questions about your business and we generate a complete Facebook & Instagram campaign blueprint — including targeting, budget, ad copies, creative direction and launch checklist.',
  },
  {
    keywords: ['how does it work', 'how to use', 'steps', 'get started', 'how to start'],
    answer:
      "It's simple! 1. Click \"New Campaign\" 2. Fill in 5 steps about your business, product, audience and goals 3. Click Generate 4. Get your complete campaign blueprint in 15-20 seconds. Then follow the launch checklist to set it up in Meta Ads Manager.",
  },
  {
    keywords: ['free plan', 'free', 'free campaign', 'free trial'],
    answer:
      'The Free plan gives you 1 campaign blueprint lifetime — enough to try the full platform. Upgrade to Pro (₹499/month) for 5 campaigns/month or Ultra (₹999/month) for 10 campaigns/month.',
  },
  {
    keywords: ['pro plan', 'pro', '499', 'upgrade pro'],
    answer:
      'Pro plan is ₹499/month and includes 5 campaign blueprints per month, PDF export, campaign history and priority support. Cancel anytime from Settings.',
  },
  {
    keywords: ['ultra plan', 'ultra', '999', 'upgrade ultra'],
    answer:
      'Ultra plan is ₹999/month and includes 10 campaign blueprints per month, PDF export, campaign history, advanced targeting insights and priority support.',
  },
  {
    keywords: ['cancel', 'cancellation', 'cancel subscription', 'stop subscription'],
    answer:
      'You can cancel anytime from Dashboard → Settings → Subscription → Cancel. You keep access until the end of your current billing period. Your campaigns are saved in read-only mode after cancellation.',
  },
  {
    keywords: ['export', 'pdf', 'download', 'pdf export'],
    answer:
      'You can export any campaign blueprint as a PDF. Open the campaign, click the "Export PDF" button in the top right corner. PDF export is available on Pro and Ultra plans.',
  },
  {
    keywords: ['delete campaign', 'remove campaign'],
    answer:
      'To delete a campaign, go to your Dashboard, find the campaign card and click the trash icon. You will be asked to confirm before deletion. Deleted campaigns cannot be recovered.',
  },
  {
    keywords: ['how many campaigns', 'campaign limit', 'campaigns remaining', 'limit'],
    answer:
      'Free plan: 1 campaign lifetime. Pro plan: 5 campaigns per month. Ultra plan: 10 campaigns per month. Your remaining campaigns reset every month on your billing date.',
  },
  {
    keywords: ['optimise', 'optimize', 'existing campaign', 'improve campaign'],
    answer:
      'Yes! Click "New Campaign" and choose "Optimise Existing" to improve a campaign you already generated. Select which campaign to optimise, answer a few questions about your current results, and get an improved blueprint.',
  },
  {
    keywords: ['contact', 'support', 'help', 'email', 'reach out'],
    answer:
      'You can reach us at optimeta@outlook.com. We respond within 24 hours. You can also check our blog at optimeta.tech/blog for Meta ads guides.',
  },
  {
    keywords: ['roas', 'return on ad spend'],
    answer:
      'ROAS (Return on Ad Spend) = Revenue ÷ Ad Spend. ROAS of 3x means you earn ₹3 for every ₹1 spent on ads. Indian D2C benchmark: Fashion 2.4x-4x, Beauty 2.8x-4.5x, Jewellery 2x-3.5x.',
  },
  {
    keywords: ['ctr', 'click through rate'],
    answer:
      'CTR (Click Through Rate) = Clicks ÷ Impressions × 100. Good CTR for India: Feed ads 1.5-3%, Reels ads 3-6%. Low CTR means your creative or targeting needs improvement.',
  },
  {
    keywords: ['cpm', 'cost per thousand', 'cost per impression'],
    answer:
      'CPM (Cost Per 1000 Impressions) = how much you pay for 1000 people to see your ad. India benchmarks: Metro cities ₹60-120, Tier 2/3 cities ₹30-70.',
  },
  {
    keywords: ['cpc', 'cost per click'],
    answer:
      'CPC (Cost Per Click) = total spend ÷ total clicks. Lower CPC means more people clicking for your budget. Typical India CPC: ₹3-15 depending on industry and audience.',
  },
  {
    keywords: ['cpa', 'cost per acquisition', 'cost per result'],
    answer:
      'CPA (Cost Per Acquisition) = total spend ÷ conversions. This is how much you pay to get one customer or lead. Lower CPA = more efficient campaign.',
  },
  {
    keywords: ['tofu', 'top of funnel', 'awareness'],
    answer:
      'TOFU = Top of Funnel. These are people who have never heard of your brand. Use awareness and reach objectives. Cold audience. Focus on introducing your product and stopping the scroll.',
  },
  {
    keywords: ['mofu', 'middle of funnel', 'consideration'],
    answer:
      'MOFU = Middle of Funnel. People who know your brand but have not bought yet. Warm audience. Use engagement, traffic or lead gen objectives. Show proof, reviews and benefits.',
  },
  {
    keywords: ['bofu', 'bottom of funnel', 'conversion'],
    answer:
      'BOFU = Bottom of Funnel. People ready to buy. Hot audience — website visitors, cart abandoners, past customers. Use Sales objective with retargeting. Show offer, urgency and social proof.',
  },
  {
    keywords: ['pixel', 'meta pixel', 'facebook pixel', 'tracking'],
    answer:
      'Meta Pixel is a code you install on your website that tracks visitor actions. It helps Meta show ads to the right people and measure results. Without pixel, use Traffic objective first to collect data.',
  },
  {
    keywords: ['capi', 'conversions api', 'server side'],
    answer:
      'CAPI (Conversions API) is server-side tracking that works alongside the pixel. It captures conversions that iOS privacy blocks from pixel tracking. Essential for accurate reporting on iOS devices.',
  },
  {
    keywords: ['learning phase', 'learning', 'optimization'],
    answer:
      'Learning Phase is the first 7-14 days of a campaign where Meta AI tests different audiences and placements. Needs 50 optimization events to exit. Do NOT edit campaigns during this period — it resets learning.',
  },
  {
    keywords: ['lookalike', 'lookalike audience'],
    answer:
      'Lookalike Audience = Meta finds new people similar to your existing customers. Upload your customer list or use pixel data as seed. 1% lookalike from 500+ purchasers performs best.',
  },
  {
    keywords: ['retargeting', 'remarketing'],
    answer:
      'Retargeting = showing ads to people who already visited your website or engaged with your brand. Use 7-day window for impulse products, 30-day for considered purchases. Always exclude past purchasers from cold campaigns.',
  },
  {
    keywords: ['advantage plus', 'advantage+', 'asc'],
    answer:
      "Advantage+ Shopping (ASC) is Meta's AI-powered campaign type. It automates targeting, creative delivery and budget allocation. Works best with ₹1000+/day budget and pixel data. Outperforms manual campaigns by 17-32% on average.",
  },
  {
    keywords: ['ugc', 'user generated content', 'creator'],
    answer:
      'UGC (User Generated Content) = videos or photos created by real customers or creators in a natural, authentic style. Shot on phone beats professional studio content. UGC gets 3-5x better CTR and costs less to produce (₹3,000-8,000 per creator).',
  },
  {
    keywords: ['creative fatigue', 'ad fatigue', 'frequency'],
    answer:
      'Creative Fatigue happens when your audience has seen your ad too many times — CTR drops, CPM rises, ROAS falls. Signs: frequency above 3, CTR dropping week over week. Fix: add fresh creatives every 3-4 weeks.',
  },
  {
    keywords: ['cod', 'cash on delivery'],
    answer:
      'COD (Cash on Delivery) is a major trust signal for Indian D2C brands. Mentioning COD in ad copies increases CTR by 20-40%. If you offer COD, always include it in your primary ad text and target Tier 2/3 cities aggressively.',
  },
  {
    keywords: ['budget', 'how much to spend', 'minimum budget'],
    answer:
      'Minimum viable budget: ₹500/day per ad set to exit learning phase. Monthly breakdown: Under ₹5k = 1 ad set only. ₹5k-15k = 2 ad sets. ₹15k-30k = full funnel (3 ad sets). ₹30k+ = scale and test lookalikes.',
  },
  {
    keywords: ['cold audience', 'cold traffic'],
    answer:
      'Cold Audience = people who have never interacted with your brand. Requires more trust-building. Best formats: Reels with strong hook, UGC style, problem-solution approach. Allocate 60-70% of budget to cold prospecting.',
  },
  {
    keywords: ['warm audience', 'warm traffic'],
    answer:
      'Warm Audience = people who visited your website, watched your videos or engaged with your content. More likely to buy than cold. Use shorter, offer-focused ads. Retargeting window: 7 days for impulse, 30 days for considered purchases.',
  },
  {
    keywords: ['instagram reels', 'reels', 'video ads'],
    answer:
      'Reels outperform static images 3-5x for cold traffic in India. First 3 seconds are everything — must stop the scroll. UGC style (shot on phone) beats studio production. Keep Reels 15-30 seconds for best results.',
  },
  {
    keywords: ['interest targeting', 'interests', 'targeting'],
    answer:
      'Use specific brand interests (Nykaa, Myntra, Mamaearth) not generic categories. Always include "Engaged Shoppers" behavior for D2C. Broad targeting now beats hyper-niche — Meta AI handles discovery. Provide 8-10 relevant interests.',
  },
  // Conversational
  {
    keywords: ['thank you', 'thanks', 'thankyou', 'thank u', 'ty', 'shukriya', 'dhanyawad'],
    answer: "You're welcome! 😊 Happy to help with your Meta ads. Feel free to ask anything else!",
  },
  {
    keywords: ['ok', 'okay', 'alright', 'got it', 'understood', 'noted', 'sure', 'fine', 'great', 'perfect', 'awesome', 'nice', 'cool'],
    answer: 'Got it! Let me know if you have more questions about your campaigns or Meta ads strategy. 👍',
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'take care', 'later', 'cya'],
    answer: 'Goodbye! Best of luck with your Meta campaigns. Come back anytime you need help! 🚀',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'hii', 'helo', 'good morning', 'good evening', 'good afternoon'],
    answer: "Hello! 👋 I'm Optimeta AI — your Meta ads expert. Ask me anything about your campaigns, targeting, budgets or Meta ads strategy!",
  },
  {
    keywords: ['how are you', 'how r u', 'whats up', "what's up", 'kaise ho', 'how are'],
    answer: "I'm doing great and ready to help! 😊 Ask me about your Meta campaigns or any advertising questions.",
  },
  {
    keywords: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'are you human', 'what is this'],
    answer: "I'm Optimeta AI — a specialized Meta ads assistant built into the Optimeta platform. I can answer questions about Meta advertising strategy, help you understand your generated campaigns and guide you on best practices for Indian brands.",
  },
  {
    keywords: ['not helpful', 'wrong', 'incorrect', 'that is wrong', 'bad answer', 'not right'],
    answer: 'I apologize for that! For more detailed help please email optimeta@outlook.com — we respond within 24 hours. You can also open your full campaign blueprint for complete details.',
  },
  {
    keywords: ['customer care', 'customer support', 'help desk', 'contact support', 'talk to human', 'speak to someone'],
    answer: 'For support reach us at:\n📧 optimeta@outlook.com\n🌐 optimeta.tech\n\nWe respond within 24 hours. For billing issues mention your registered email in the message.',
  },
  {
    keywords: ['refund', 'money back', 'cancel and refund', 'get my money back'],
    answer: 'For refund queries please email optimeta@outlook.com with your registered email and payment details. Our team will review and respond within 24-48 hours.',
  },
  {
    keywords: ['billing', 'invoice', 'payment history', 'receipt'],
    answer: 'For billing details go to Dashboard → Settings → Subscription. You can view your current plan and billing date there. For invoices email optimeta@outlook.com',
  },
  // Meta Ads Setup
  {
    keywords: ['how to setup meta ads', 'how to start meta ads', 'how to run facebook ads', 'setup facebook ads', 'start meta ads', 'begin meta ads', 'meta ads for beginners', 'how to advertise on facebook', 'how to advertise on instagram', 'setup meta ads account', 'create meta ads account'],
    answer: 'Complete Meta ads setup guide:\n\n1️⃣ Create Meta Business Suite\nGo to business.facebook.com → Create account\n\n2️⃣ Add your Facebook Page + Instagram\nSettings → Accounts → Pages/Instagram\n\n3️⃣ Create Ad Account\nSettings → Accounts → Ad Accounts → Create New\nSelect currency: INR\n\n4️⃣ Add Payment Method\nBilling → Add Payment (UPI/card/net banking)\n\n5️⃣ Install Meta Pixel\nEvents Manager → Connect Data Sources → Web\nInstall code on your website\n\n6️⃣ Set up Conversions API (CAPI)\nEvents Manager → Settings → Conversions API\nEssential for iOS tracking accuracy\n\n7️⃣ Generate Campaign with Optimeta\nUse your blueprint for targeting + copy\n\n8️⃣ Create Campaign in Ads Manager\nadsmanager.facebook.com\nFollow your Optimeta blueprint step by step\n\nTotal setup time: 2-4 hours for first time',
  },
  {
    keywords: ['what is meta pixel', 'how to install pixel', 'pixel setup', 'install facebook pixel', 'meta pixel setup'],
    answer: 'Meta Pixel setup:\n\n1. Go to Events Manager in Meta Business Suite\n2. Click "Connect Data Sources" → Web\n3. Choose "Meta Pixel" → Get Started\n4. Enter your website URL\n5. Choose install method:\n   • Manual: copy code to website <head>\n   • Partner: use Shopify/WooCommerce app\n6. Verify using Meta Pixel Helper (Chrome extension)\n7. Test events using Test Events tool\n\nFor Shopify: Install Meta app from Shopify App Store — no coding needed!\n\nFor WordPress: Use PixelYourSite plugin',
  },
  {
    keywords: ['what is meta business suite', 'business manager', 'meta business manager', 'facebook business manager'],
    answer: 'Meta Business Suite (formerly Business Manager) is the central hub for managing your Facebook and Instagram business presence.\n\nIt includes:\n• Ad Accounts\n• Facebook Pages\n• Instagram Accounts\n• Pixels and tracking\n• Commerce Manager\n• Meta Ads Manager\n\nCreate it free at business.facebook.com',
  },
  {
    keywords: ['how to create ad account', 'create facebook ad account', 'ad account setup', 'facebook ad account'],
    answer: 'To create a Meta Ad Account:\n\n1. Go to business.facebook.com\n2. Settings → Accounts → Ad Accounts\n3. Click "Add" → "Create a new ad account"\n4. Name your account and select currency (INR)\n5. Add payment method (UPI, card, net banking)\n6. Assign yourself as admin\n\nNote: New ad accounts have spending limits initially. These increase as you build payment history.',
  },
  {
    keywords: ['how to create campaign', 'create facebook campaign', 'create meta campaign', 'ads manager campaign', 'create ad campaign'],
    answer: 'Create a Meta campaign:\n\n1. Go to Ads Manager (adsmanager.facebook.com)\n2. Click green "Create" button\n3. Select Objective (from your Optimeta blueprint)\n4. Name campaign: [Brand]_[Objective]_[Date]\n5. Set Campaign Budget Optimization (CBO) ON\n6. Enter daily budget from your blueprint\n7. Create Ad Set:\n   • Audience: use blueprint targeting\n   • Placements: Advantage+ Placements\n   • Schedule: Start immediately\n8. Create Ad:\n   • Upload creative (image/video)\n   • Paste primary text from blueprint\n   • Add headline and CTA\n9. Review everything\n10. Click Publish!\n\nDo NOT edit for first 7 days — let Meta learn',
  },
  {
    keywords: ['what is cbo', 'campaign budget optimization', 'cbo vs abo'],
    answer: "CBO (Campaign Budget Optimization) = Set budget at campaign level, Meta distributes it across ad sets automatically.\n\nABO (Ad Set Budget Optimization) = Set budget for each ad set manually.\n\nFor India 2026: Use CBO when you have 2+ ad sets and trust Meta's algorithm. Use ABO when you want strict budget control per audience. Most experienced advertisers prefer CBO for efficiency.",
  },
  {
    keywords: ['what is broad targeting', 'broad audience', 'no interest targeting', 'open targeting'],
    answer: "Broad targeting = running ads with minimal audience restrictions and letting Meta's AI find buyers automatically.\n\nIn 2026, broad targeting often outperforms detailed interest targeting because:\n• Meta has better data than manual selections\n• Larger audience = cheaper CPM\n• Algorithm optimizes better with more data\n\nBest for: Brands spending ₹30,000+/month with good pixel data and creative assets.",
  },
  {
    keywords: ['how to scale facebook ads', 'how to scale meta ads', 'scaling ads', 'increase budget'],
    answer: 'How to scale Meta ads in India:\n\n📈 Vertical scaling (increase budget):\n• Increase by max 20% every 3-4 days\n• Bigger jumps reset learning phase\n• Best time: when ROAS is consistently above target\n\n📊 Horizontal scaling (duplicate):\n• Duplicate winning ad sets\n• Test new audiences\n• Test new creatives\n\n⚠️ Never edit a winning campaign — duplicate it instead!',
  },
  {
    keywords: ['what is frequency', 'ad frequency', 'high frequency'],
    answer: 'Frequency = average number of times one person has seen your ad.\n\nIdeal frequency:\n• Cold traffic: 1-2 (fresh impression)\n• Retargeting: 3-5 (repetition builds trust)\n• Warning zone: above 6 (creative fatigue)\n\nIf frequency rises above 4 on cold campaigns and CTR is dropping → add new creatives immediately.',
  },
  {
    keywords: ['what is conversion window', 'attribution window', '7 day click', '1 day view'],
    answer: "Attribution window = how long after seeing/clicking an ad Meta credits a conversion to that ad.\n\nDefault setting: 7-day click, 1-day view\nMeaning: If someone clicks your ad and buys within 7 days = counted as your ad's conversion.\n\nFor Indian D2C: 7-day click is recommended. Considered purchases (furniture, jewellery) may need 28-day click window.",
  },
  {
    keywords: ['what is a/b test', 'split test', 'ab testing', 'how to test ads'],
    answer: 'A/B testing = running two versions of an ad to see which performs better.\n\nWhat to test in order:\n1. Hook/opening line (most important)\n2. Creative format (Reel vs static)\n3. Headline\n4. Offer (10% off vs free shipping)\n5. Audience\n\nRules:\n• Test one variable at a time\n• Run for minimum 7 days\n• Need at least 50 results per variant\n• Kill loser, scale winner',
  },
  {
    keywords: ['what is custom audience', 'custom audiences facebook', 'upload customer list'],
    answer: 'Custom Audiences = audiences created from your own data.\n\nTypes:\n• Customer list (upload phone/email)\n• Website visitors (pixel-based)\n• App users\n• Video viewers\n• Instagram/Facebook engagers\n\nBest performing for India:\n1. Customer phone number list (WhatsApp numbers work!)\n2. Purchase event pixel audience\n3. Instagram profile engagers (last 90 days)',
  },
  {
    keywords: ['what is value based lookalike', 'value lookalike', 'high value customers'],
    answer: 'Value-based Lookalike = Meta creates an audience similar to your highest-value customers (those who spent the most).\n\nHow to create:\n1. Upload customer list with purchase values\n2. Go to Audiences in Ads Manager\n3. Create Lookalike → select value-based source\n4. Choose 1% (most similar)\n\nThis typically outperforms regular lookalikes by 30-50% in ROAS for Indian D2C brands.',
  },
  {
    keywords: ['festive ads', 'diwali ads', 'festival season', 'eid ads', 'holi ads', 'festive campaign'],
    answer: 'Festive season Meta ads strategy for India:\n\n📅 Start 2-3 weeks before the festival\n💰 Increase budget 40-60% during peak\n🎯 Add festive interests to targeting\n✍️ Use festive-themed creatives and copy\n🛍️ Create special offers (bundles, discounts)\n\nTop festive seasons for Indian D2C:\n• Diwali (Oct-Nov) — highest spends\n• Eid — fashion and gifting\n• Holi — beauty and fashion\n• Valentine\'s Day — gifting brands\n• Wedding season (Nov-Feb) — jewellery, fashion',
  },
  // New entries
  {
    keywords: ['what is events manager', 'events manager', 'meta events', 'conversion events', 'standard events'],
    answer: 'Events Manager is where you manage all your tracking.\n\nKey events for Indian D2C:\n• PageView — someone visits your site\n• ViewContent — product page viewed\n• AddToCart — added to cart\n• InitiateCheckout — started checkout\n• Purchase — completed order\n\nOptimize for Purchase (if 50+ events/month)\nOtherwise optimize for AddToCart or InitiateCheckout first\n\nAccess at: business.facebook.com → Events Manager',
  },
  {
    keywords: ['what is ads manager', 'facebook ads manager', 'meta ads manager', 'how to use ads manager'],
    answer: 'Meta Ads Manager is where you create, manage and monitor all your Facebook and Instagram ads.\n\nMain sections:\n• Campaigns — overall strategy and objective\n• Ad Sets — audience, budget, schedule\n• Ads — creative, copy, format\n\nKey metrics to watch:\n• ROAS — revenue per ₹1 spent\n• CTR — % clicking your ad\n• CPM — cost per 1000 impressions\n• CPA — cost per result\n• Frequency — how many times shown\n\nAccess: adsmanager.facebook.com',
  },
  {
    keywords: ['what is business suite', 'meta business suite', 'facebook business suite'],
    answer: 'Meta Business Suite is the central hub for managing your entire Meta presence.\n\nIncludes:\n• Ads Manager (create campaigns)\n• Events Manager (track conversions)\n• Commerce Manager (product catalog)\n• Pages (manage Facebook Page)\n• Inbox (messages from customers)\n• Insights (performance data)\n\nCreate free at: business.facebook.com',
  },
  {
    keywords: ['ad account disabled', 'account disabled', 'ad account restricted', 'account banned', 'ads not approved', 'ad rejected'],
    answer: "If your Meta ad account is disabled:\n\n1. Check the email Meta sent — it explains the reason\n2. Go to Account Quality in Business Suite\n3. Click \"Request Review\" if you believe it's a mistake\n4. Wait 24-48 hours for review\n\nCommon reasons in India:\n• Payment failure\n• Policy violation in ad content\n• Suspicious activity\n• New account spending too fast\n\nPrevention tips:\n• Warm up new accounts slowly (₹200/day first week)\n• Avoid restricted content (loans, crypto, weight loss claims)\n• Keep payment method updated\n• Don't edit campaigns too frequently",
  },
  {
    keywords: ['what is commerce manager', 'product catalog', 'meta catalog', 'facebook shop', 'instagram shop'],
    answer: 'Commerce Manager is where you manage your product catalog for Meta ads.\n\nWhy you need it:\n• Required for Advantage+ Shopping Campaigns\n• Enables Dynamic Product Ads\n• Powers Facebook and Instagram Shop\n\nSetup:\n1. Business Suite → Commerce Manager\n2. Create Catalog → Upload products\n3. Connect to your website/Shopify\n4. Link catalog to your Ad Account\n\nFor Shopify: Sync automatically via Meta Sales Channel app',
  },
  {
    keywords: ['how to track roas', 'how to measure roas', 'check roas', 'roas tracking', 'measure results'],
    answer: 'How to track ROAS in Meta Ads Manager:\n\n1. Open Ads Manager\n2. Click "Columns" → Customize Columns\n3. Add: Purchase ROAS, Cost per Purchase, Purchases\n4. Save as preset "ROAS View"\n\nROAS formula: Revenue ÷ Ad Spend\nExample: ₹15,000 sales ÷ ₹5,000 spend = 3x ROAS\n\nIndia benchmarks:\n• Fashion: 2.4x-4x target\n• Beauty: 2.8x-4.5x target\n• Jewellery: 2x-3.5x target\n• Health: 3x-5x target\n\nNote: Meta ROAS may differ from actual ROAS due to attribution. Cross-check with your website analytics.',
  },
  {
    keywords: ['what is advantage plus audience', 'advantage plus targeting', 'advantage audience', 'meta advantage'],
    answer: "Advantage+ Audience is Meta's AI-powered targeting that automatically finds your best customers.\n\nHow it works:\n• You provide \"audience suggestions\" (interests, demographics)\n• Meta's AI expands beyond your suggestions to find more buyers\n• It learns from your pixel data and purchase history\n\nWhen to use:\n• Budget above ₹1,000/day\n• Pixel has 50+ purchase events\n• You want Meta to do the heavy lifting\n\nTip: Still add 8-10 relevant interests as seeds — helps Meta start in the right direction",
  },
  {
    keywords: ['what is dynamic ads', 'dynamic product ads', 'dpa', 'dynamic retargeting'],
    answer: 'Dynamic Ads automatically show people products they viewed on your website.\n\nHow it works:\n1. User views Product A on your website\n2. Pixel records this\n3. Meta shows them an ad for Product A\n4. Personalized automatically — no manual work\n\nRequirements:\n• Meta Pixel installed\n• Product Catalog set up in Commerce Manager\n• Minimum 1,000 monthly website visitors\n\nBest for: E-commerce brands with 20+ products. Very high ROAS as it targets warm audience with relevant products.',
  },
  {
    keywords: ['whatsapp ads', 'click to whatsapp', 'ctwa', 'whatsapp campaign', 'whatsapp lead generation'],
    answer: 'Click-to-WhatsApp (CTWA) ads are extremely effective for Indian brands.\n\nHow to set up:\n1. Connect WhatsApp Business to Meta Business Suite\n2. Create campaign → Objective: Engagement or Leads\n3. Ad Type: Click to WhatsApp\n4. Write ad → CTA button opens WhatsApp chat\n5. Set up automated WhatsApp greeting\n\nWhy it works in India:\n• Indians prefer WhatsApp over forms\n• Higher conversion than website traffic\n• Build direct customer relationship\n• Works brilliantly for coaching, local businesses, D2C\n\nExpected CPL: ₹20-80 for most Indian niches',
  },
  {
    keywords: ['instagram ads', 'instagram advertising', 'reels ads', 'story ads', 'instagram reel ads'],
    answer: 'Instagram ad formats for Indian brands:\n\n📱 Reels Ads (BEST performing 2026)\n• 15-30 seconds vertical video\n• First 3 seconds must hook the viewer\n• UGC style outperforms studio\n• 3-5x higher CTR than static\n\n📸 Feed Ads\n• Square or portrait image/video\n• Good for retargeting warm audience\n• Best with offer/price visible\n\n⏱️ Story Ads\n• Full screen vertical (9:16)\n• 15 seconds max for video\n• Swipe up CTA\n• Good for offers and urgency\n\nRecommendation: Use Advantage+ Placements and let Meta decide where to show your ad for best results.',
  },
  {
    keywords: ['how to write ad copy', 'ad copywriting', 'write facebook ad', 'write instagram ad', 'ad copy tips'],
    answer: 'Ad copy formula for Indian brands:\n\nLine 1: Hook (stop the scroll)\n"Tired of [pain point]?" OR\n"₹499 for [big benefit]? Yes, really."\n\nLine 2: Introduce product\n"Meet [Product] — [one line description]"\n\nLine 3: Key benefits + proof\n"Used by 5,000+ Indian [customers]. [Benefit 1]. [Benefit 2]."\n\nLine 4: Price + offer\n"Just ₹[price]. Free shipping above ₹499."\n\nLine 5: Trust + CTA\n"Cash on Delivery available. Shop now →"\n\nTips:\n• Always mention price for D2C\n• COD increases CTR by 20-40%\n• Use numbers (5,000 customers, 7 days results)\n• Keep sentences short\n• Sound human, not corporate',
  },
  {
    keywords: ['what is meta verified', 'verified badge facebook', 'verified badge instagram', 'blue tick meta'],
    answer: "Meta Verified is a subscription for individuals and businesses to get verified badges.\n\nBenefits:\n• Blue verification badge\n• Proactive account protection\n• Account support access\n• Increased reach and visibility\n\nCost: Starting from ₹699/month\n\nFor advertising: Meta Verified does NOT directly improve ad performance. Focus your budget on actual ad spend rather than verification for better ROI.",
  },
  {
    keywords: ['how to reduce ad cost', 'reduce cpm', 'lower cpc', 'cheaper ads', 'reduce ad spend', 'improve ad performance'],
    answer: 'How to reduce Meta ad costs for Indian brands:\n\n1️⃣ Improve creative quality\nBetter hook = higher CTR = lower CPM\n\n2️⃣ Use Reels format\nReels typically have 30-50% lower CPM than feed\n\n3️⃣ Target Tier 2/3 cities\nCPM ₹30-70 vs ₹60-120 in metros\n\n4️⃣ Avoid peak competition times\nDiwali, wedding season = higher CPMs\n\n5️⃣ Use Advantage+ placements\nMeta finds cheapest placements automatically\n\n6️⃣ Improve landing page\nHigher conversion rate = better ROAS without reducing spend\n\n7️⃣ Use broad targeting\nLarger audience = more competition = lower CPM',
  },
  {
    keywords: ['what is page post engagement', 'engagement campaign', 'post boost', 'boosting posts'],
    answer: 'Page Post Engagement = campaign objective to get likes, comments, shares on your posts.\n\nShould you use it?\nFor D2C sales: NO — use Sales or Traffic instead\nFor brand building: Yes — builds social proof\nFor new page with 0 followers: Yes — get initial engagement\n\nBoosting posts vs Ads Manager:\nNever boost posts for sales — it uses inefficient targeting and wrong objective.\nAlways use Ads Manager for sales campaigns.\n\nBoosting is only useful for building social proof (likes/comments) on a new page.',
  },
  {
    keywords: ['what is reach objective', 'reach campaign', 'brand awareness campaign', 'awareness objective'],
    answer: 'Reach objective = show your ad to maximum unique people within your budget.\n\nWhen to use:\n• Launching in a new market/city\n• Pure brand awareness (not immediate sales)\n• Retargeting with very small audience\n\nWhen NOT to use:\n• If you want sales or leads\n• If you have pixel data\n• If budget is under ₹5,000/month\n\nFor Indian D2C: Sales objective almost always outperforms Reach/Awareness for revenue. Only use Reach if brand building is the explicit goal with no sales expectation.',
  },
];

function getAnswer(query: string, campaigns: any[] = []): string {
  const q = query.toLowerCase().trim();

  if (campaigns.length > 0) {
    if (q.includes('show my campaigns') || q === 'my campaigns') {
      const names = campaigns
        .slice(0, 3)
        .map(
          (c, i) =>
            `${i + 1}. ${c.campaign_name || c.business_inputs?.businessName || 'Campaign'}`
        )
        .join('\n');
      return `You have ${campaigns.length} campaign${campaigns.length > 1 ? 's' : ''}:\n\n${names}${campaigns.length > 3 ? `\n...and ${campaigns.length - 3} more` : ''}\n\nOpen your dashboard to view all campaigns.`;
    }

    if (
      (q.includes('latest') || q.includes('last') || q.includes('recent')) &&
      q.includes('targeting')
    ) {
      const latest = campaigns[0];
      const targeting =
        latest?.blueprint?.targeting || latest?.blueprint?.audienceTargeting;
      if (targeting) {
        const interests = targeting.interests?.slice(0, 4).join(', ') || '';
        const ageRange = targeting.ageRange || targeting.age_range || '';
        return `Latest campaign targeting: ${ageRange ? `Ages ${ageRange}` : ''}${interests ? ` • Interests: ${interests}` : ''}.\n\nOpen your campaign for the full targeting breakdown.`;
      }
      return 'Open your latest campaign from the dashboard to see detailed audience targeting.';
    }

    if (q.includes('ad cop') || q.includes('last ad') || q.includes('my last ad')) {
      const latest = campaigns[0];
      const copies =
        latest?.blueprint?.adCopies || latest?.blueprint?.ad_copies;
      if (copies && Array.isArray(copies) && copies.length > 0) {
        const copy = copies[0];
        const text = copy.headline || copy.primary_text || String(copy);
        return `Here's an ad copy from your latest campaign:\n\n"${text}"\n\nOpen the campaign for all generated copies.`;
      }
      return 'Open your latest campaign from the dashboard to view all generated ad copies.';
    }

    if (
      (q.includes('latest campaign') || q.includes('last campaign') || q.includes('recent campaign')) &&
      !q.includes('targeting')
    ) {
      const latest = campaigns[0];
      const name =
        latest.campaign_name ||
        latest.business_inputs?.businessName ||
        'your latest campaign';
      return `Your latest campaign is "${name}". Open it from your dashboard to see the full blueprint, targeting, ad copies and launch checklist.`;
    }

    if (q.includes('first 7 days') || q.includes('launch plan') || q.includes('7 day plan')) {
      return 'First 7 days plan: Day 1-2 publish ads, set learning phase budget. Day 3-4 monitor reach and frequency. Day 5-7 check CTR vs benchmark (Feed 1.5%, Reels 3%). Do NOT edit targeting or budget during this window — it resets Meta learning.';
    }
  }

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

  return "I don't have a specific answer for that. For detailed help, email us at optimeta@outlook.com or check our blog at optimeta.tech/blog. You can also ask me about: ROAS, CTR, CPM, budget planning, TOFU/MOFU/BOFU, retargeting, UGC, or how to use Optimeta.";
}

// ── Main page ───────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'galaxy' | 'chat'>('galaxy');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('optimeta_token')
      : null;

  // Galaxy intro → chat transition
  useEffect(() => {
    sessionStorage.removeItem('chat_opening');
    const timer = setTimeout(() => {
      setPhase('chat');
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content:
            "Hi! I'm Optimeta AI — your Meta ads assistant. I can help you with your campaigns, targeting strategy, ad copy guidance and Meta ads questions.\n\nWhat would you like to know?",
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch campaigns
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const list = data.data?.campaigns || data.data || [];
        setCampaigns(
          list.filter(
            (c: any) => c && (c.campaign_name || c.business_inputs?.businessName)
          )
        );
      })
      .catch(() => {});
  }, [token]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = (text?: string) => {
    const query = (text || input).trim();
    if (!query || thinking) return;
    setInput('');

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: query, time },
    ]);
    setThinking(true);

    setTimeout(() => {
      const answer = getAnswer(query, campaigns);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + 'r',
          role: 'assistant',
          content: answer,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setThinking(false);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS =
    campaigns.length > 0
      ? [
          'Show my campaigns',
          'Latest campaign targeting',
          'My last ad copies',
          'Expected ROAS',
          'First 7 days plan',
          'What is Learning Phase?',
        ]
      : [
          'How does Optimeta work?',
          'What is ROAS?',
          'Minimum budget for India?',
          'What is Learning Phase?',
          'COD strategy for ads?',
          'What is UGC?',
        ];

  return (
    <div
      className="fixed inset-0 bg-[#0A0A0F] z-40 flex flex-col"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at top right, rgba(123,47,190,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at bottom left, rgba(192,38,211,0.08) 0%, transparent 50%)
        `,
      }}
    >
      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(123,47,190,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(123,47,190,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scan line */}
      <motion.div
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(123,47,190,0.4), rgba(192,38,211,0.6), rgba(123,47,190,0.4), transparent)',
          boxShadow: '0 0 8px rgba(192,38,211,0.4)',
        }}
      />

      {/* ── GALAXY PHASE ── */}
      <AnimatePresence>
        {phase === 'galaxy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.4 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            {/* Corner decorations */}
            {[
              'top-6 left-6 border-t border-l',
              'top-6 right-6 border-t border-r',
              'bottom-6 left-6 border-b border-l',
              'bottom-6 right-6 border-b border-r',
            ].map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`absolute w-8 h-8 ${cls} border-[#7B2FBE]/30`}
              />
            ))}

            {/* Main galaxy orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                delay: 0.2,
              }}
            >
              <GalaxyOrb phase="galaxy" size={160} />
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white font-bold text-2xl tracking-widest uppercase"
                style={{
                  background:
                    'linear-gradient(135deg, #ffffff, #C026D3, #7B2FBE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Optimeta AI
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-[#606080] text-sm mt-2 tracking-widest uppercase"
              >
                Meta Ads Intelligence
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 w-48 h-0.5 bg-[#1E1E3A] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, delay: 1.2, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7B2FBE, #C026D3)',
                  boxShadow: '0 0 8px rgba(192,38,211,0.6)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHAT PHASE ── */}
      <AnimatePresence>
        {phase === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full w-full relative z-10"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E3A] flex-shrink-0"
              style={{
                background: 'rgba(10,10,15,0.9)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#A0A0C0] hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#1E1E3A] group-hover:bg-[#2E2E4A] flex items-center justify-center transition-colors">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-sm hidden sm:block">Dashboard</span>
              </button>

              <div className="flex items-center gap-2.5">
                <GalaxyOrb phase="center" size={36} />
                <div>
                  <p className="text-white font-bold text-sm leading-none">
                    Optimeta AI
                  </p>
                  <p className="text-[#606080] text-xs mt-0.5">
                    Meta ads expert
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0F0F1A] border border-[#1E1E3A] rounded-full px-2.5 py-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"
                />
                <span className="text-[10px] text-[#606080]">Online</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {/* Empty state */}
              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 gap-3"
                >
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-[#606080] text-sm text-center max-w-xs"
                  >
                    Ask me anything about Meta ads or your campaigns
                  </motion.p>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  } items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mb-1 border border-[#7B2FBE]/30"
                      style={{
                        background:
                          'linear-gradient(135deg, #7B2FBE22, #C026D322)',
                      }}
                    >
                      <span
                        className="text-[10px]"
                        style={{
                          background:
                            'linear-gradient(135deg, #7B2FBE, #C026D3)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontWeight: 900,
                        }}
                      >
                        O
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex flex-col max-w-[75%] ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-sm text-white'
                          : 'rounded-bl-sm text-[#C8C8E8] border border-[#1E1E3A]'
                      }`}
                      style={{
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #7B2FBE, #C026D3)'
                            : 'rgba(15,15,26,0.8)',
                        backdropFilter: 'blur(8px)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[#404060] mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Thinking indicator */}
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center border border-[#7B2FBE]/30"
                    style={{
                      background: 'linear-gradient(135deg, #7B2FBE22, #C026D322)',
                    }}
                  >
                    <span
                      className="text-[10px] font-black"
                      style={{
                        background:
                          'linear-gradient(135deg, #7B2FBE, #C026D3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      O
                    </span>
                  </div>
                  <div className="bg-[#0F0F1A] border border-[#1E1E3A] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            'linear-gradient(135deg, #7B2FBE, #C026D3)',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {messages.length <= 1 && !thinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 justify-center mt-2"
                >
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-[#1E1E3A] text-[#A0A0C0] hover:border-[#7B2FBE]/50 hover:text-white transition-all"
                      style={{
                        background: 'rgba(15,15,26,0.8)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <ChevronRight size={10} className="text-[#7B2FBE]" />
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex-shrink-0 border-t border-[#1E1E3A] px-4 py-4 max-w-3xl w-full mx-auto"
              style={{
                background: 'rgba(10,10,15,0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex gap-3 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about Meta ads, your campaigns, strategy..."
                  maxLength={500}
                  className="flex-1 bg-[#0F0F1A] border border-[#1E1E3A] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#404060] focus:outline-none focus:border-[#7B2FBE]/50 transition-colors"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || thinking}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{
                    background:
                      input.trim() && !thinking
                        ? 'linear-gradient(135deg, #7B2FBE, #C026D3)'
                        : '#1E1E3A',
                    boxShadow:
                      input.trim() && !thinking
                        ? '0 0 16px rgba(192,38,211,0.4)'
                        : 'none',
                  }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
              <p className="text-[10px] text-[#404060] text-center mt-2">
                Optimeta AI • Meta ads specialist
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

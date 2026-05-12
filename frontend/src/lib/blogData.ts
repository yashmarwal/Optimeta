export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'pullquote'; text: string }
  | { type: 'fix'; text: string };

export type ArticleSection = {
  heading: string;
  content: ContentBlock[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: ContentBlock[];
  sections: ArticleSection[];
  conclusion: string;
};

export const categoryColors: Record<string, string> = {
  'Meta Ads Guide': 'bg-primary/20 text-primary border-primary/30',
  'Targeting Strategy': 'bg-accent/20 text-accent border-accent/30',
  'Common Mistakes': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Budget Planning': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Campaign Strategy': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Creative Strategy': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Getting Started': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'meta-ads-for-d2c-brands-india-2026',
    title: 'How to Run Meta Ads for D2C Brands in India (2026 Complete Guide)',
    description:
      'Step-by-step guide to running profitable Facebook and Instagram ads for Indian D2C brands. Covers objectives, budgets, targeting, creatives and ROAS benchmarks for 2026.',
    category: 'Meta Ads Guide',
    readTime: '12 min read',
    publishDate: 'April 20, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Meta Ads for D2C Brands India 2026 — Complete Guide',
    metaDescription:
      'Learn how to run profitable Meta ads for your Indian D2C brand in 2026. Budget strategies, targeting tips, creative formats and real ROAS benchmarks included.',
    keywords: 'meta ads india, facebook ads d2c india, instagram ads for d2c brands, meta ads guide india 2026',
    intro: [
      {
        type: 'paragraph',
        text: "Running Meta ads in India in 2026 is completely different from what worked 2-3 years ago. CPMs have risen 40-60%, iOS privacy changes have broken traditional tracking, and Meta's algorithm now does most of the targeting work automatically.",
      },
      {
        type: 'paragraph',
        text: 'The good news: brands that understand the new rules are seeing 3x-5x ROAS consistently. This guide covers everything you need to know.',
      },
    ],
    sections: [
      {
        heading: 'Why Meta Ads Still Work for Indian D2C Brands',
        content: [
          {
            type: 'bullets',
            items: [
              'India has 490M+ Facebook users and 362M+ Instagram users as of 2026',
              "Meta's AI targeting has improved dramatically — broad targeting now beats manual interest stacking",
              'Reels placements give massive reach advantages at lower CPMs',
              'Average D2C ROAS in India: 2.4x-4.5x depending on category',
              'Click-to-WhatsApp ads opening new conversion paths for Indian brands',
            ],
          },
          { type: 'pullquote', text: 'Average D2C ROAS in India: 2.4x–4.5x depending on category.' },
        ],
      },
      {
        heading: 'Choosing the Right Campaign Objective',
        content: [
          {
            type: 'bullets',
            items: [
              'Sales objective: for brands with Meta Pixel installed and 50+ monthly purchases',
              'Leads objective: for coaches, SaaS, service businesses',
              'Traffic objective: for new brands without pixel data yet',
              'Engagement: only for warming up cold audiences before sales campaigns',
              'NEVER use Reach or Brand Awareness for D2C — wastes budget',
            ],
          },
        ],
      },
      {
        heading: 'Budget Planning for Indian D2C Brands',
        content: [
          { type: 'pullquote', text: 'Minimum viable budget: ₹500/day per ad set.' },
          {
            type: 'bullets',
            items: [
              'Learning phase needs 50 optimization events — at ₹500/day this takes 7-14 days typically',
              'Under ₹5,000/month: 1 ad set, Advantage+ Shopping only',
              '₹5,000-15,000/month: 2 ad sets, cold + warm',
              '₹15,000-30,000/month: Full funnel possible',
              '₹30,000+/month: Scale winners + lookalikes',
            ],
          },
        ],
      },
      {
        heading: 'Targeting That Works in India 2026',
        content: [
          {
            type: 'bullets',
            items: [
              'Broad targeting is now better than hyper-niche interest stacking',
              'Always include "Engaged Shoppers" behavior for D2C products',
              'Lookalike from top customers outperforms interest targeting',
              'For COD brands: target Tier 2/3 cities too',
              'Retargeting window: 7 days for impulse products, 30 days for considered purchases',
            ],
          },
        ],
      },
      {
        heading: 'Creative Strategy',
        content: [
          {
            type: 'bullets',
            items: [
              'Reels outperform static 3-5x for cold traffic',
              'UGC (shot on phone) beats studio content consistently',
              'First 3 seconds = everything',
              'Always mention price in Indian D2C ads',
              'COD mention increases CTR 20-40%',
              'Refresh creatives every 3-4 weeks',
              'Test 10-15 creatives per campaign',
            ],
          },
        ],
      },
      {
        heading: 'Common Mistakes to Avoid',
        content: [
          {
            type: 'bullets',
            items: [
              'Editing campaigns in first 7 days (resets learning phase)',
              'Too many ad sets for budget',
              'Not installing Meta Pixel correctly',
              'Ignoring Conversions API (CAPI)',
              'Optimizing for Purchase with under ₹500/day',
              'Generic copy without price or offer',
            ],
          },
        ],
      },
    ],
    conclusion:
      "Meta ads in India reward brands that work with the algorithm, not against it. Focus on creative quality, give Meta's AI enough budget to learn, and use Optimeta to build your complete campaign strategy in minutes.",
  },

  {
    slug: 'facebook-ads-targeting-india-2026',
    title: 'Meta Ad Targeting Strategies That Actually Work in India (2026)',
    description:
      'Master Facebook and Instagram ad targeting for Indian audiences. Interests, behaviors, demographics, lookalikes and Advantage+ targeting explained.',
    category: 'Targeting Strategy',
    readTime: '10 min read',
    publishDate: 'April 18, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Meta Ads Targeting India 2026 — Interests, Behaviors & Lookalikes',
    metaDescription:
      'Discover the Meta ad targeting strategies that work for Indian audiences in 2026. Complete guide to interests, behaviors, demographics and Advantage+ targeting.',
    keywords:
      'meta ads targeting india, facebook ads audience india, instagram ads targeting 2026, advantage plus targeting india',
    intro: [
      {
        type: 'paragraph',
        text: "Meta's targeting has fundamentally changed. In 2026, 90% of Meta's delivery is algorithm-driven. Manual interest stacking is dying. Here's what actually works for Indian audiences now.",
      },
    ],
    sections: [
      {
        heading: 'The New Targeting Reality',
        content: [
          {
            type: 'bullets',
            items: [
              "Meta's AI now handles most audience discovery automatically",
              'Advantage+ Audience replaced traditional detailed targeting as the default',
              'Creative is now the targeting — the right ad finds the right people',
              'First-party data (customer lists, pixel events) is more valuable than ever',
            ],
          },
          {
            type: 'pullquote',
            text: "In 2026, 90% of Meta's delivery is algorithm-driven. Creative is the new targeting.",
          },
        ],
      },
      {
        heading: 'Interest Targeting That Still Works',
        content: [
          {
            type: 'bullets',
            items: [
              'Use brand name interests (Nykaa, Myntra, Mamaearth) not generic categories',
              'Combine 3-4 complementary interests maximum',
              'Layer with Engaged Shoppers behavior always',
              'Avoid: interests that are too broad (Fashion, Shopping)',
            ],
          },
        ],
      },
      {
        heading: 'Behavior Targeting for Indian Audiences',
        content: [
          {
            type: 'bullets',
            items: [
              'Engaged Shoppers: essential for all D2C',
              'Online shoppers: good for first-time buyers',
              'Facebook access (mobile): India is mobile-first',
              'High-value goods buyers: for premium products above ₹2,000',
              'Anniversary: for gifting products',
            ],
          },
        ],
      },
      {
        heading: 'Demographics Targeting',
        content: [
          {
            type: 'bullets',
            items: [
              'Income: Top 25% earners for products above ₹1,500',
              'Education: College grad+ for SaaS and coaching products',
              'Life events: Recently married for home/gifting brands',
              'Parental status: New parents for baby products',
              'Age: be specific — 25-34 converts better than 18-45',
            ],
          },
        ],
      },
      {
        heading: 'Lookalike Audiences',
        content: [
          {
            type: 'bullets',
            items: [
              '1% lookalike from 500-1000 purchasers = best performer',
              'Value-based lookalike from high-LTV customers',
              'WhatsApp contact list upload: gold for Indian brands',
              'Engagement lookalike: people similar to Instagram engagers',
            ],
          },
        ],
      },
      {
        heading: 'Advantage+ Targeting',
        content: [
          {
            type: 'bullets',
            items: [
              "Let Meta's AI find your audience",
              'Feed it good creative — it will find buyers',
              'Provide interest seeds even in broad mode',
              'Works best with ₹1,000+/day budget',
            ],
          },
        ],
      },
    ],
    conclusion:
      'The best targeting strategy in 2026 is simple: give Meta great creative, strong first-party data, and enough budget to learn. The algorithm does the rest. Use Optimeta to get your complete targeting strategy built in minutes.',
  },

  {
    slug: 'why-indian-brands-waste-money-meta-ads',
    title: 'Why Most Indian Brands Waste Money on Meta Ads (And How to Stop)',
    description:
      'The 7 biggest Meta ads mistakes Indian D2C brands make that drain ad budgets without results — and exactly how to fix each one.',
    category: 'Common Mistakes',
    readTime: '8 min read',
    publishDate: 'April 15, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Why Indian Brands Waste Money on Facebook Ads — 7 Mistakes to Avoid',
    metaDescription:
      'Discover the 7 most common Meta ads mistakes Indian brands make and how to fix them. Stop wasting your ad budget and start getting ROAS.',
    keywords:
      'facebook ads mistakes india, meta ads not working india, why facebook ads fail india, improve meta ads roas india',
    intro: [
      {
        type: 'paragraph',
        text: "Most Indian brands burn through ₹30,000-50,000 in Meta ads and see almost no results. Not because Meta ads don't work — but because they're making the same 7 mistakes every time.",
      },
    ],
    sections: [
      {
        heading: 'Mistake 1: Editing Campaigns in the First 7 Days',
        content: [
          {
            type: 'paragraph',
            text: 'Every edit resets the learning phase. Meta needs 50 optimization events to exit learning. Constant edits mean the algorithm never learns.',
          },
          { type: 'fix', text: 'Set it and forget it for at least 7 days minimum.' },
        ],
      },
      {
        heading: 'Mistake 2: Too Many Ad Sets for the Budget',
        content: [
          {
            type: 'paragraph',
            text: 'Running 5 ad sets on ₹500/day means each ad set gets ₹100/day — not enough for Meta to optimize anything.',
          },
          { type: 'fix', text: '1 ad set per ₹500/day minimum. ₹5,000/month = maximum 2 ad sets.' },
        ],
      },
      {
        heading: 'Mistake 3: No Meta Pixel or Broken Tracking',
        content: [
          {
            type: 'paragraph',
            text: 'Without proper pixel + CAPI setup, Meta is flying blind. iOS 14+ means 20-40% of conversions are invisible without server-side tracking.',
          },
          { type: 'fix', text: 'Install pixel + Conversions API before spending a single rupee.' },
        ],
      },
      {
        heading: 'Mistake 4: Wrong Campaign Objective',
        content: [
          {
            type: 'paragraph',
            text: "Using Traffic or Reach for a D2C brand trying to get sales is like asking someone to drive customers who will never buy.",
          },
          {
            type: 'fix',
            text: "Use Sales objective if you have pixel data. Traffic only if you're building audience from scratch.",
          },
        ],
      },
      {
        heading: 'Mistake 5: Generic Ad Copy',
        content: [
          {
            type: 'paragraph',
            text: '"Buy now. Best quality. Free shipping above ₹499." Every brand writes this. Nobody reads it.',
          },
          {
            type: 'fix',
            text: "Lead with the customer's pain. Mention price. Mention COD. Make it specific and human.",
          },
        ],
      },
      {
        heading: 'Mistake 6: Boosting Posts Instead of Running Proper Ads',
        content: [
          {
            type: 'paragraph',
            text: "The Boost button is Meta's most profitable product — for Meta. It uses the worst objectives and least efficient targeting.",
          },
          { type: 'fix', text: 'Always use Ads Manager. Never boost posts for sales.' },
        ],
      },
      {
        heading: 'Mistake 7: No Creative Testing',
        content: [
          {
            type: 'paragraph',
            text: 'Running 1-2 creatives and wondering why results dropped after 3 weeks. Creative fatigue is real — frequency rises, CTR falls.',
          },
          { type: 'fix', text: 'Produce 8-10 creatives minimum per campaign. Refresh every 3-4 weeks.' },
        ],
      },
    ],
    conclusion:
      'Every one of these mistakes is completely avoidable. Optimeta helps you build campaigns that avoid all 7 from day one — giving you a complete blueprint with the right objective, structure, targeting and copy built in.',
  },

  {
    slug: 'meta-ads-budget-india-beginners',
    title: 'How Much to Spend on Meta Ads in India: Budget Guide for Beginners',
    description:
      'Complete budget planning guide for Indian businesses running Meta ads for the first time. Minimum budgets, scaling strategies and ROI expectations explained.',
    category: 'Budget Planning',
    readTime: '7 min read',
    publishDate: 'April 12, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Meta Ads Budget India 2026 — How Much to Spend as a Beginner',
    metaDescription:
      'How much should you spend on Meta ads in India? Complete budget guide for beginners covering minimum spend, scaling and expected results for Indian brands.',
    keywords:
      'meta ads budget india, facebook ads cost india 2026, how much to spend on instagram ads india, meta ads minimum budget india',
    intro: [
      {
        type: 'paragraph',
        text: "One of the most common questions from Indian brand owners new to Meta ads: how much should I spend? The honest answer depends on your goal, product, and stage. Here's the complete breakdown.",
      },
    ],
    sections: [
      {
        heading: 'The Minimum Viable Budget',
        content: [
          {
            type: 'pullquote',
            text: '₹500/day per ad set is the practical minimum. Below this, the algorithm gets too little data to optimize.',
          },
          {
            type: 'bullets',
            items: [
              '₹15,000/month: minimum for meaningful results',
              '₹30,000/month: where real optimization begins',
            ],
          },
        ],
      },
      {
        heading: 'Budget by Business Stage',
        content: [
          {
            type: 'paragraph',
            text: 'Testing phase (month 1-2): ₹15,000-25,000/month — Focus on finding winning creative and audience. Expect losses during this phase.',
          },
          {
            type: 'paragraph',
            text: 'Growth phase (month 3-6): ₹25,000-75,000/month — Focus on scaling what works. ROAS should be 2x+.',
          },
          {
            type: 'paragraph',
            text: 'Scale phase (month 6+): ₹75,000-2,00,000/month — Focus on aggressive expansion with a proven system.',
          },
        ],
      },
      {
        heading: 'Budget Allocation Rules',
        content: [
          {
            type: 'bullets',
            items: [
              '60-70% to cold prospecting (finding new customers)',
              '20-30% to retargeting (converting warm audience)',
              '10% to lookalike audiences',
              "Never spend 100% on retargeting — you'll run out of warm audience",
            ],
          },
        ],
      },
      {
        heading: 'How to Scale Budget',
        content: [
          {
            type: 'bullets',
            items: [
              'Increase by maximum 20% every 3-4 days',
              'Larger jumps reset the learning phase',
              'Duplicate winning ad sets instead of editing them',
              'Scale winners, kill losers fast',
            ],
          },
        ],
      },
      {
        heading: 'ROAS Expectations by Budget',
        content: [
          {
            type: 'bullets',
            items: [
              'Under ₹15,000/month: ROAS 0.5x-1.5x (learning phase)',
              '₹15,000-30,000/month: ROAS 1.5x-2.5x (optimizing)',
              '₹30,000-75,000/month: ROAS 2.5x-4x (scaling)',
              '₹75,000+/month: ROAS 3x-5x (systematic)',
            ],
          },
        ],
      },
    ],
    conclusion:
      'Start with what you can afford to lose while learning. ₹15,000-20,000 for the first month is enough to get real data. Use Optimeta to build your complete budget strategy before spending a single rupee.',
  },

  {
    slug: 'advantage-plus-shopping-campaigns-india',
    title: 'Advantage+ Shopping Campaigns for Indian D2C Brands: 2026 Guide',
    description:
      'How to set up and scale Meta Advantage+ Shopping Campaigns for Indian e-commerce brands. Complete setup guide with budget recommendations and optimization tips.',
    category: 'Campaign Strategy',
    readTime: '9 min read',
    publishDate: 'April 10, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Advantage+ Shopping Campaigns India 2026 — Setup & Optimization Guide',
    metaDescription:
      'Master Meta Advantage+ Shopping Campaigns for your Indian D2C brand. Step-by-step setup, budget recommendations and scaling strategies for 2026.',
    keywords:
      'advantage plus shopping india, meta ASC india, advantage plus campaigns d2c india, facebook shopping campaigns india 2026',
    intro: [
      {
        type: 'paragraph',
        text: "Advantage+ Shopping Campaigns (ASC) have become the default strategy for serious D2C brands on Meta in 2026. Most leading Indian D2C brands have fully migrated their prospecting spend to ASC. Here's everything you need to know.",
      },
    ],
    sections: [
      {
        heading: 'What is Advantage+ Shopping',
        content: [
          {
            type: 'bullets',
            items: [
              "Meta's AI-powered campaign type that automates targeting, creative delivery and budget allocation",
              'Combines prospecting and retargeting in one campaign',
              "Meta's internal data shows ASC outperforms manual campaigns by 17-32% on cost-per-purchase",
              'Best for: D2C brands with pixel data and product catalog',
            ],
          },
          {
            type: 'pullquote',
            text: "Meta's data shows ASC outperforms manual campaigns by 17–32% on cost-per-purchase.",
          },
        ],
      },
      {
        heading: 'When to Use ASC',
        content: [
          {
            type: 'paragraph',
            text: 'Use ASC when you have Meta Pixel installed with 50+ purchase events, monthly ad spend above ₹15,000, a Shopify product catalog, and you want Meta to handle audience optimization automatically.',
          },
          {
            type: 'paragraph',
            text: "Don't use ASC when you have no pixel data, are running ads for the first time, or run a service business without an e-commerce catalog.",
          },
        ],
      },
      {
        heading: 'ASC Setup for Indian Brands',
        content: [
          {
            type: 'bullets',
            items: [
              'Budget: minimum ₹1,000/day for ASC to work properly',
              'Creative: upload 10+ creatives — mix of Reels, static, carousel',
              'Catalog: sync your Shopify catalog to Meta Commerce Manager',
              'Existing customers: upload customer list to exclude from prospecting',
              'Location: India-wide or specific states',
            ],
          },
        ],
      },
      {
        heading: 'Creative for ASC',
        content: [
          { type: 'paragraph', text: 'ASC needs creative variety to test automatically. Upload a mix of content types:' },
          {
            type: 'bullets',
            items: [
              '3-5 Reels/videos',
              '3-5 static images',
              '2-3 carousels',
              'Mix UGC and studio content',
              'Include price and offer in creative',
              'Let ASC pick winners automatically',
            ],
          },
        ],
      },
      {
        heading: 'Optimizing ASC Results',
        content: [
          {
            type: 'bullets',
            items: [
              "Don't touch campaigns for first 7 days",
              'Check results at 7, 14, 30 days',
              'Add new creatives every 3-4 weeks',
              'Increase budget by 20% max at a time',
              'Track: ROAS, CPA, frequency',
            ],
          },
        ],
      },
    ],
    conclusion:
      "ASC is the most powerful Meta ads tool available for Indian D2C brands in 2026. Let Meta's AI do the heavy lifting while you focus on creative. Optimeta builds your complete ASC strategy including creative direction, targeting seeds and budget allocation.",
  },

  {
    slug: 'meta-ads-creative-strategy-india-2026',
    title: 'Meta Ads Creative Strategy for Indian Brands: What Works in 2026',
    description:
      'The complete creative strategy guide for Indian Meta ads. UGC vs studio content, Reels hooks, ad copy formulas and creative testing frameworks that drive ROAS.',
    category: 'Creative Strategy',
    readTime: '11 min read',
    publishDate: 'April 8, 2026',
    author: 'Optimeta Team',
    metaTitle: 'Meta Ads Creative Strategy India 2026 — UGC, Reels & Copy Guide',
    metaDescription:
      'Learn what creative formats work best for Meta ads in India. Complete guide to UGC content, Reels hooks, ad copywriting and creative testing for Indian brands in 2026.',
    keywords: 'meta ads creative india, facebook ads ugc india, instagram reels ads india, meta ad copy india 2026',
    intro: [
      {
        type: 'paragraph',
        text: "In 2026, creative is the most important variable in Meta ads. Not targeting. Not bidding. Not campaign structure. Creative. Meta's own data confirms it: the creative you run is what separates a 1x ROAS campaign from a 4x one. Here's what works for Indian brands.",
      },
    ],
    sections: [
      {
        heading: 'Why Creative Matters More Than Ever',
        content: [
          {
            type: 'bullets',
            items: [
              "Meta's AI handles most targeting — your creative IS your targeting",
              'A hook that resonates with your buyer will find those buyers',
              'Creative fatigue sets in faster in 2026 — higher impression frequency in tighter pools',
              'You need 10-15 creatives per campaign minimum',
            ],
          },
          {
            type: 'pullquote',
            text: 'Creative is the most important variable in Meta ads. The right hook finds the right buyer.',
          },
        ],
      },
      {
        heading: 'Best Performing Formats for India 2026',
        content: [
          {
            type: 'paragraph',
            text: 'Reels (15-30 seconds): Best for cold traffic. 3-5x higher CTR than static. UGC style outperforms studio. First 3 seconds must stop the scroll.',
          },
          {
            type: 'paragraph',
            text: 'Static Images: Best for retargeting. Product closeup + offer works well. Price visible. COD mentioned.',
          },
          {
            type: 'paragraph',
            text: 'Carousel: Best for product range brands. Show multiple products/benefits. Each slide needs its own hook.',
          },
        ],
      },
      {
        heading: 'The Hook Formula',
        content: [
          {
            type: 'paragraph',
            text: 'First 3 seconds = everything. These hooks consistently work for Indian D2C brands:',
          },
          {
            type: 'bullets',
            items: [
              "Problem hook: 'Tired of [pain point]?' / 'Why does your [product] always [problem]?'",
              "Curiosity hook: 'This ₹299 product changed how I [outcome]' / 'Nobody talks about this for [category]'",
              "Social proof hook: '10,000 Indian women switched to this' / 'Our customers keep coming back — here's why'",
              "Price anchor hook: '₹499 for [premium benefit]? Yes, really.' / 'Less than ₹17/day for [outcome]'",
            ],
          },
        ],
      },
      {
        heading: 'UGC vs Studio Content',
        content: [
          {
            type: 'paragraph',
            text: 'UGC wins because it feels authentic, not like an ad. It carries higher trust from Indian consumers, is cheaper to produce (₹3,000-8,000), and performs 3-5x better than studio content.',
          },
          {
            type: 'paragraph',
            text: 'How to get UGC: Ask customers to film unboxing, hire micro-influencers (10K-50K followers), film yourself as founder, or create before/after content (with permission).',
          },
        ],
      },
      {
        heading: 'Ad Copy Formula for India',
        content: [
          { type: 'paragraph', text: 'The proven 5-line formula for Indian D2C brands:' },
          {
            type: 'bullets',
            items: [
              'Line 1: Hook (pain or desire)',
              'Line 2: Product introduction',
              'Line 3: Key benefit + proof',
              'Line 4: Price + offer',
              'Line 5: COD available + CTA',
            ],
          },
          {
            type: 'pullquote',
            text: "\"Tired of moisturizers that leave white patches on your skin?\n\nMeet [Product] — India's first 100% no-residue moisturizer.\n\nUsed by 8,000+ Indian women. Dermatologist tested.\n\nJust ₹399. Free shipping. Cash on Delivery available.\n\nShop now →\"",
          },
        ],
      },
      {
        heading: 'Creative Testing System',
        content: [
          {
            type: 'bullets',
            items: [
              'Test one variable at a time',
              'Hook vs hook first (most important variable)',
              'Then: offer vs offer',
              'Then: format vs format',
              'Run each test for 7 days minimum',
              'Kill losers fast, scale winners',
            ],
          },
        ],
      },
    ],
    conclusion:
      "Creative is where Indian D2C brands win or lose on Meta. The brands growing profitably are producing 10-15 creatives per month and testing systematically. Optimeta gives you the complete creative direction — hooks, UGC briefs, do's and don'ts — in every campaign blueprint.",
  },

  {
    slug: 'how-to-setup-meta-ads-account-india',
    title: 'How to Set Up Your Meta Ads Account in India: Complete 2026 Guide',
    description:
      'Step-by-step guide to setting up Meta Business Suite, Ad Account, Meta Pixel and Conversions API for Indian brands. Everything you need before spending your first rupee on Facebook and Instagram ads.',
    category: 'Getting Started',
    readTime: '10 min read',
    publishDate: 'May 10, 2026',
    author: 'Optimeta Team',
    metaTitle: 'How to Set Up Meta Ads Account India 2026 — Complete Guide',
    metaDescription:
      'Complete step-by-step guide to setting up Meta ads for Indian brands. Business Suite, Ad Account, Pixel, CAPI setup — everything before you spend your first rupee.',
    keywords:
      'meta ads setup india, facebook ads account setup india, how to start facebook ads india, meta business suite setup, meta pixel setup india',
    intro: [
      {
        type: 'paragraph',
        text: 'Before spending a single rupee on Meta ads, you need to set up your account correctly. Most Indian brands skip steps 4 and 5 — and then wonder why their results are poor.',
      },
      {
        type: 'paragraph',
        text: 'This guide covers everything from creating your Business Suite to verifying your pixel is working. Follow these steps in order and you will avoid the most costly beginner mistakes.',
      },
    ],
    sections: [
      {
        heading: 'Step 1: Create Meta Business Suite',
        content: [
          {
            type: 'paragraph',
            text: 'Meta Business Suite is your central hub for all Meta advertising. Go to business.facebook.com and click "Create Account". Enter your business name, your name, and business email. This is different from your personal Facebook — it is a separate business account that houses all your assets.',
          },
          {
            type: 'bullets',
            items: [
              'Use a business email, not Gmail',
              'Add your mobile number for security',
              'Enable two-factor authentication immediately',
              'Add a colleague as admin backup — account lockouts are common',
            ],
          },
        ],
      },
      {
        heading: 'Step 2: Add Your Facebook Page and Instagram Account',
        content: [
          {
            type: 'paragraph',
            text: 'In Business Suite go to Settings → Accounts → Pages → Add. You can add an existing page or create a new one. Then go to Instagram Accounts and connect your Instagram business profile.',
          },
          {
            type: 'paragraph',
            text: 'If you do not have a Facebook Page yet, create one first at facebook.com/pages/create. Choose the right category for your business — this affects how Meta categorizes your ads.',
          },
        ],
      },
      {
        heading: 'Step 3: Create Your Ad Account',
        content: [
          {
            type: 'paragraph',
            text: 'Go to Settings → Accounts → Ad Accounts → Add → Create a New Ad Account. Name it clearly (e.g., "YourBrand - India Ads"). Select Indian Rupee (INR) as your currency — you cannot change this later. Set your time zone to India Standard Time.',
          },
          {
            type: 'fix',
            text: 'New ad accounts have lower spending limits initially. Meta increases these automatically as you build payment history. Do not try to spend ₹10,000 on day one — start with ₹500-1,000/day.',
          },
        ],
      },
      {
        heading: 'Step 4: Add Payment Method',
        content: [
          {
            type: 'paragraph',
            text: 'Go to Billing in your Ad Account. Click Add Payment Method. Indian options: Credit/Debit card (Visa, Mastercard, Rupay), Net banking, UPI (via some cards).',
          },
          {
            type: 'bullets',
            items: [
              'Use a dedicated business credit card for ads — easier accounting and float period',
              'Add a backup payment method to prevent campaign interruptions',
              'Keep the card details updated — expired card = account disabled',
            ],
          },
        ],
      },
      {
        heading: 'Step 5: Install Meta Pixel (Critical Step)',
        content: [
          {
            type: 'paragraph',
            text: 'This is the most important step that most Indian brands skip. Go to Events Manager → Connect Data Sources → Web → Meta Pixel → Get Started.',
          },
          {
            type: 'bullets',
            items: [
              'Shopify: Install the Meta Sales Channel from the Shopify App Store — connects automatically',
              'WordPress: Use the PixelYourSite plugin or add pixel code manually to your theme header',
              'Custom websites: Copy the pixel code and paste it in the <head> section of every page',
              'Verify installation using the Meta Pixel Helper Chrome extension',
            ],
          },
          {
            type: 'pullquote',
            text: 'Brands without Meta Pixel are running blind. Every campaign without pixel data is wasted money.',
          },
        ],
      },
      {
        heading: 'Step 6: Set Up Conversions API (CAPI)',
        content: [
          {
            type: 'paragraph',
            text: 'Conversions API is server-side tracking that works alongside your pixel. After iOS 14, up to 40% of conversions are invisible to pixel tracking alone. CAPI fixes this.',
          },
          {
            type: 'bullets',
            items: [
              'Shopify: The Meta Sales Channel includes CAPI automatically',
              'Others: Events Manager → your pixel → Settings → Conversions API → Set up manually',
              'Verify in Events Manager that you see both browser (pixel) and server (CAPI) events',
              'Event Match Quality score should be above 6',
            ],
          },
        ],
      },
      {
        heading: 'Step 7: Set Up Product Catalog (For E-commerce)',
        content: [
          {
            type: 'paragraph',
            text: 'If you sell products online, set up a catalog for Dynamic Ads and Advantage+ Shopping Campaigns.',
          },
          {
            type: 'bullets',
            items: [
              'Commerce Manager → Create a Catalog → Upload products',
              'Shopify: Sync automatically via Meta Sales Channel',
              'Others: Upload a product feed CSV or use a feed management tool',
              'Link your catalog to your Ad Account once created',
            ],
          },
        ],
      },
      {
        heading: 'Step 8: Generate Your Blueprint with Optimeta',
        content: [
          {
            type: 'paragraph',
            text: 'Before creating your first campaign, use Optimeta to generate a complete campaign blueprint. Answer questions about your business, product, target audience and budget. You will get the exact campaign objective, targeting interests, budget split, ad copies and launch checklist.',
          },
          {
            type: 'paragraph',
            text: 'This saves hours of research and prevents the most common beginner mistakes — wrong objective, wrong budget split, generic targeting.',
          },
        ],
      },
      {
        heading: 'Step 9: Create Your First Campaign',
        content: [
          {
            type: 'paragraph',
            text: 'Go to Ads Manager at adsmanager.facebook.com. Click Create. Select the objective recommended in your Optimeta blueprint.',
          },
          {
            type: 'bullets',
            items: [
              'Naming: [Brand]_[Objective]_[Date] e.g. FitFuel_Sales_May2026',
              'Set up ad set using the exact targeting from your blueprint',
              'Upload your creative and paste the ad copy from your blueprint',
              'Do NOT edit your campaign for the first 7 days — Meta needs this time to exit learning phase',
            ],
          },
        ],
      },
      {
        heading: 'Common Mistakes Indian Brands Make',
        content: [
          {
            type: 'bullets',
            items: [
              'Skipping Pixel installation — running blind without data',
              'Using Boost Post instead of Ads Manager — expensive and inefficient',
              'Editing campaigns in first 7 days — resets learning phase',
              'Running too many ad sets for budget — spreads spend too thin',
              'Not mentioning price in D2C ads — Indian buyers want to know before clicking',
              'Ignoring COD as a trust signal — major conversion booster',
              'Using generic copy — avoid "best quality, fast delivery"',
            ],
          },
          {
            type: 'fix',
            text: 'Never boost posts for sales campaigns. Always use Ads Manager with the correct objective.',
          },
        ],
      },
    ],
    conclusion:
      'Setting up Meta ads correctly takes 2-4 hours the first time, but it pays off in every campaign you run after. Brands that skip steps 5 and 6 are paying 30-40% more per conversion than they should. Once your foundation is set, use Optimeta to generate your complete campaign blueprint and follow the launch checklist step by step.',
  },
];

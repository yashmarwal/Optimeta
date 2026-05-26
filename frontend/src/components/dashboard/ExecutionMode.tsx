'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, ChevronDown,
  ChevronUp, ExternalLink, Info,
  Target, Users, DollarSign,
  Image, Rocket, BarChart3,
  Zap, AlertCircle, ArrowRight,
  Trophy, Flag
} from 'lucide-react';

interface Blueprint {
  campaign_objective?: any;
  funnel_strategy?: any;
  budget_strategy?: any;
  targeting?: any;
  ad_sets?: any;
  ad_copies?: any[];
  creative_direction?: any;
  pixel_recommendations?: any;
  launch_checklist?: any[];
  first_7_days_plan?: any;
  performance_benchmarks?: any;
}

interface ExecutionStep {
  id: string;
  phase: number;
  phaseName: string;
  phaseIcon: any;
  phaseColor: string;
  title: string;
  instruction: string;
  exactValue?: string;
  subSteps?: string[];
  tip?: string;
  warning?: string;
  link?: string;
  linkText?: string;
}

function buildExecutionSteps(
  blueprint: Blueprint,
  campaignName: string
): ExecutionStep[] {
  const obj = blueprint.campaign_objective;
  const budget = blueprint.budget_strategy;
  const targeting = blueprint.targeting;
  const copies = blueprint.ad_copies || [];
  const creative = blueprint.creative_direction;
  const pixel = blueprint.pixel_recommendations;
  const plan = blueprint.first_7_days_plan;
  const benchmarks = blueprint.performance_benchmarks;
  const primaryAudience = targeting?.primary_audience;
  const interests = primaryAudience?.interests || [];
  const behaviors = primaryAudience?.behaviors || [];

  return [
    // PHASE 1 — SETUP
    {
      id: 'open_ads_manager',
      phase: 1,
      phaseName: 'Setup',
      phaseIcon: Target,
      phaseColor: '#7B2FBE',
      title: 'Open Meta Ads Manager',
      instruction: 'Go to Meta Ads Manager to start creating your campaign. Make sure you are logged into the correct ad account.',
      exactValue: 'adsmanager.facebook.com',
      link: 'https://adsmanager.facebook.com',
      linkText: 'Open Ads Manager →',
      tip: 'Use Chrome or Edge for best experience with Meta Ads Manager.',
    },
    {
      id: 'verify_pixel',
      phase: 1,
      phaseName: 'Setup',
      phaseIcon: Target,
      phaseColor: '#7B2FBE',
      title: 'Verify Your Pixel is Active',
      instruction: 'Before creating a campaign, confirm your Meta Pixel is firing correctly on your website.',
      exactValue: pixel?.status || 'Go to Events Manager → Your Pixel → Test Events → Open your website and verify events fire',
      link: 'https://business.facebook.com/events_manager',
      linkText: 'Open Events Manager →',
      tip: pixel?.recommendation || 'Install Meta Pixel Helper Chrome extension to quickly verify pixel status.',
      warning: !pixel?.installed ? 'Pixel not detected. Install pixel before running conversion campaigns.' : undefined,
    },

    // PHASE 2 — CAMPAIGN
    {
      id: 'click_create',
      phase: 2,
      phaseName: 'Campaign',
      phaseIcon: Zap,
      phaseColor: '#9B3FDA',
      title: 'Click Create Campaign',
      instruction: 'In Ads Manager click the green "+ Create" button at the top left to start a new campaign.',
      exactValue: 'Click "+ Create" button',
      tip: 'You will see a popup asking you to choose between "Guided Creation" and "Quick Creation". Choose Guided Creation for better control.',
    },
    {
      id: 'select_objective',
      phase: 2,
      phaseName: 'Campaign',
      phaseIcon: Zap,
      phaseColor: '#9B3FDA',
      title: 'Select Campaign Objective',
      instruction: 'Choose the objective that matches your goal. Based on your business this is the right choice.',
      exactValue: `Select: ${obj?.meta_objective_name || obj?.recommended || 'Sales'}`,
      subSteps: [
        `Click on "${obj?.meta_objective_name || 'Sales'}"`,
        'Click Continue',
      ],
      tip: obj?.reason || 'This objective tells Meta what result to optimize for.',
      warning: obj?.what_to_avoid || undefined,
    },
    {
      id: 'name_campaign',
      phase: 2,
      phaseName: 'Campaign',
      phaseIcon: Zap,
      phaseColor: '#9B3FDA',
      title: 'Name Your Campaign',
      instruction: 'Use a clear naming convention so you can identify this campaign easily later.',
      exactValue: `${campaignName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}`,
      tip: 'Good naming: Brand_Objective_Month_Year. Example: FitFuel_Sales_May26',
    },
    {
      id: 'campaign_budget',
      phase: 2,
      phaseName: 'Campaign',
      phaseIcon: Zap,
      phaseColor: '#9B3FDA',
      title: 'Set Campaign Budget (CBO)',
      instruction: 'Turn ON Campaign Budget Optimization. This lets Meta distribute budget across ad sets automatically for best results.',
      exactValue: `Daily Budget: ₹${budget?.recommended_daily_budget_inr || '500'}`,
      subSteps: [
        'Toggle ON "Campaign Budget Optimization"',
        `Enter daily budget: ₹${budget?.recommended_daily_budget_inr || '500'}`,
        'Keep bid strategy as "Lowest Cost"',
      ],
      tip: budget?.scaling_logic || 'CBO outperforms ABO in most India campaigns. Let Meta optimize.',
    },

    // PHASE 3 — AUDIENCE
    {
      id: 'create_ad_set',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Create Your Ad Set',
      instruction: 'Name your ad set clearly. Use the audience type in the name.',
      exactValue: `${campaignName.replace(/\s+/g, '_')}_Cold_Prospecting`,
      tip: 'One ad set per audience type. Start with cold prospecting.',
    },
    {
      id: 'set_targeting',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Set Audience Targeting',
      instruction: 'Enter the exact targeting details below. These are optimized specifically for your campaign.',
      exactValue: [
        `Age: ${primaryAudience?.age_range || '25-44'}`,
        `Gender: ${primaryAudience?.gender || 'All'}`,
        `Locations: ${primaryAudience?.locations?.join(', ') || 'India'}`,
      ].join('\n'),
      subSteps: [
        `Set age range: ${primaryAudience?.age_range || '25-44'}`,
        `Set gender: ${primaryAudience?.gender || 'All genders'}`,
        `Add locations: ${primaryAudience?.locations?.slice(0, 3).join(', ') || 'India'}`,
        'Leave language as "All"',
      ],
      tip: 'Do NOT narrow audience further. Let Meta find buyers within these parameters.',
    },
    {
      id: 'add_interests',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Add Interest Targeting',
      instruction: 'Search and add these exact interests in the "Detailed Targeting" section. These are India-specific and validated.',
      exactValue: interests.slice(0, 8).join('\n'),
      subSteps: interests.slice(0, 8).map((interest: string, i: number) =>
        `${i + 1}. Search and select: "${interest}"`
      ),
      tip: 'If an interest is not available, skip it. Do not substitute with random interests.',
    },
    {
      id: 'add_behaviors',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Add Behavioral Targeting',
      instruction: 'Add these behaviors to target people with specific purchase intent.',
      exactValue: behaviors.slice(0, 4).join('\n'),
      subSteps: behaviors.slice(0, 4).map((behavior: string, i: number) =>
        `${i + 1}. Add behavior: "${behavior}"`
      ),
      tip: '"Engaged Shoppers" is the most powerful behavior for Indian D2C. Always include it.',
    },
    {
      id: 'set_placements',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Set Ad Placements',
      instruction: 'Use Advantage+ Placements. Meta will automatically find the cheapest and most effective placements.',
      exactValue: 'Select: Advantage+ Placements (Recommended)',
      subSteps: [
        'Click "Advantage+ Placements"',
        'Do NOT manually select placements',
        'Meta will use Feed, Reels, Stories automatically',
      ],
      tip: 'Manual placements often increase CPM. Let Meta decide for lower costs.',
    },
    {
      id: 'set_optimization',
      phase: 3,
      phaseName: 'Audience',
      phaseIcon: Users,
      phaseColor: '#C026D3',
      title: 'Set Optimization Event',
      instruction: 'Tell Meta what you want to optimize for. This is the most important technical setting.',
      exactValue: pixel?.optimize_for || 'Optimize for: Purchase (if 50+ events) OR Add to Cart (if new pixel)',
      subSteps: [
        'Scroll to "Optimization & Delivery"',
        `Select optimization event: ${pixel?.optimize_for || 'Purchase'}`,
        'Set attribution: 7-day click, 1-day view',
        'Keep delivery: Standard',
      ],
      warning: 'If your pixel has less than 50 Purchase events, optimize for Add to Cart or View Content first.',
    },

    // PHASE 4 — CREATIVE
    {
      id: 'create_ad',
      phase: 4,
      phaseName: 'Creative',
      phaseIcon: Image,
      phaseColor: '#E040D0',
      title: 'Create Your Ad',
      instruction: 'Now create the actual ad. Name it clearly with the format type.',
      exactValue: `${campaignName.replace(/\s+/g, '_')}_Ad1_Reel`,
      tip: 'Create one ad first, test it, then duplicate for other formats.',
    },
    {
      id: 'upload_creative',
      phase: 4,
      phaseName: 'Creative',
      phaseIcon: Image,
      phaseColor: '#E040D0',
      title: 'Upload Your Creative',
      instruction: 'Upload your video or image. Follow the creative specifications below for best performance.',
      exactValue: [
        creative?.format || 'Recommended: Vertical video (9:16)',
        `Style: ${creative?.style || 'UGC style — shot on phone performs best'}`,
        creative?.hook_type ? `Hook style: ${creative.hook_type}` : 'First 3 seconds: Must stop the scroll',
        'Video length: 15-30 seconds',
        'Resolution: 1080x1920 for Reels',
      ].join('\n'),
      subSteps: [
        'Click "Add Media"',
        'Upload your video/image',
        'Crop to 9:16 for Reels',
        'Add captions if video has speech',
      ],
      tip: creative?.do_donts?.dos?.[0] || 'UGC style (phone-recorded) consistently outperforms studio content in India.',
      warning: creative?.do_donts?.donts?.[0] || 'Avoid stock footage — Indian audiences can tell and CTR drops.',
    },
    {
      id: 'write_primary_text',
      phase: 4,
      phaseName: 'Creative',
      phaseIcon: Image,
      phaseColor: '#E040D0',
      title: 'Add Primary Text (Ad Copy)',
      instruction: 'Copy and paste this ad copy into the Primary Text field. This is written specifically for your target audience.',
      exactValue: copies[0]?.primary_text || 'Use the ad copy from your blueprint',
      subSteps: [
        'Click on "Primary Text" field',
        'Paste the copy below',
        'Do not edit the copy — it is optimized',
      ],
      tip: 'Keep emojis if included. They increase CTR for Indian audiences.',
    },
    {
      id: 'add_headline',
      phase: 4,
      phaseName: 'Creative',
      phaseIcon: Image,
      phaseColor: '#E040D0',
      title: 'Add Headline and CTA',
      instruction: 'Add the headline and select the right call-to-action button.',
      exactValue: [
        `Headline: ${copies[0]?.headline || 'Your product headline'}`,
        `CTA Button: ${copies[0]?.cta || 'Shop Now'}`,
      ].join('\n'),
      subSteps: [
        `Enter headline: "${copies[0]?.headline || 'Your headline here'}"`,
        `Select CTA: "${copies[0]?.cta || 'Shop Now'}"`,
        'Add your website URL in the destination field',
        'Add UTM parameters for tracking',
      ],
      tip: 'UTM example: ?utm_source=facebook&utm_medium=paid&utm_campaign=may26',
    },

    // PHASE 5 — REVIEW & LAUNCH
    {
      id: 'review_campaign',
      phase: 5,
      phaseName: 'Review',
      phaseIcon: BarChart3,
      phaseColor: '#F040E0',
      title: 'Review Everything',
      instruction: 'Before publishing, review all settings carefully. Check each item below.',
      subSteps: [
        `✓ Campaign objective: ${obj?.meta_objective_name || 'Sales'}`,
        `✓ Daily budget: ₹${budget?.recommended_daily_budget_inr || '500'}`,
        `✓ Audience age: ${primaryAudience?.age_range || '25-44'}`,
        `✓ Locations: ${primaryAudience?.locations?.slice(0, 2).join(', ') || 'India'}`,
        '✓ Placements: Advantage+',
        `✓ Optimization: ${pixel?.optimize_for || 'Purchase'}`,
        '✓ Creative uploaded',
        '✓ Ad copy added',
        '✓ Destination URL correct',
      ],
      tip: 'Spend 2 minutes reviewing. Mistakes here cost money.',
    },
    {
      id: 'publish',
      phase: 5,
      phaseName: 'Review',
      phaseIcon: Rocket,
      phaseColor: '#F040E0',
      title: 'Publish Your Campaign',
      instruction: 'Click Publish. Meta will review your ad (usually 1-24 hours). Once approved it will start delivering.',
      exactValue: 'Click "Publish" button',
      subSteps: [
        'Click the green "Publish" button',
        'Wait for "Campaign Published" confirmation',
        'Check email for approval notification',
        'Ad review typically takes 1-24 hours',
      ],
      tip: 'First ads sometimes take longer to approve. Do not duplicate or edit during review.',
    },

    // PHASE 6 — MONITOR
    {
      id: 'day_1_3',
      phase: 6,
      phaseName: 'Monitor',
      phaseIcon: BarChart3,
      phaseColor: '#7B2FBE',
      title: 'Days 1-3: Do Not Touch',
      instruction: 'Meta is in learning phase. Do NOT edit budget, audience or creative. Just monitor.',
      exactValue: plan?.day_1_3 || 'Check only: Is ad approved? Is it spending? Check CPM and Reach only.',
      subSteps: [
        '✓ Confirm ad is approved and active',
        '✓ Check it is spending budget',
        '✓ Note your CPM (should be ₹60-120 metro)',
        '✗ Do NOT edit anything',
        '✗ Do NOT panic if no sales yet',
      ],
      tip: 'Learning phase needs 50 optimization events. Give it time.',
      warning: 'Editing in first 3 days resets the learning phase and wastes budget.',
    },
    {
      id: 'day_4_7',
      phase: 6,
      phaseName: 'Monitor',
      phaseIcon: BarChart3,
      phaseColor: '#7B2FBE',
      title: 'Days 4-7: Check Performance',
      instruction: 'Now check real performance. Compare against your target benchmarks.',
      exactValue: [
        `Target ROAS: ${benchmarks?.your_target_roas || '3x+'}`,
        `Expected CTR (Feed): ${benchmarks?.expected_ctr_feed || '1.5-3%'}`,
        `Expected CTR (Reels): ${benchmarks?.expected_ctr_reels || '3-6%'}`,
        `Expected CPM: ₹${benchmarks?.expected_cpm_inr || '60-120'}`,
      ].join('\n'),
      subSteps: [
        plan?.green_flags ? `✅ Green flags: ${plan.green_flags.slice(0, 2).join(', ')}` : '✅ CTR above 1.5% = good',
        plan?.red_flags ? `🚨 Red flags: ${plan.red_flags.slice(0, 2).join(', ')}` : '🚨 No spend after 48 hours = check ad approval',
        plan?.when_to_edit || 'Only edit if CTR below 0.5% after day 5',
      ],
      tip: 'Give it full 7 days before making decisions. One bad day does not mean the campaign is failing.',
    },
  ];
}

// Progress phases config
const PHASES = [
  { id: 1, name: 'Setup', icon: Target, color: '#7B2FBE' },
  { id: 2, name: 'Campaign', icon: Zap, color: '#9B3FDA' },
  { id: 3, name: 'Audience', icon: Users, color: '#C026D3' },
  { id: 4, name: 'Creative', icon: Image, color: '#E040D0' },
  { id: 5, name: 'Review', icon: Rocket, color: '#F040E0' },
  { id: 6, name: 'Monitor', icon: BarChart3, color: '#7B2FBE' },
];

interface ExecutionModeProps {
  blueprint: Blueprint;
  campaignName: string;
  campaignId: string;
}

export function ExecutionMode({
  blueprint,
  campaignName,
  campaignId,
}: ExecutionModeProps) {
  const storageKey = `execution_${campaignId}`;

  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const steps = buildExecutionSteps(blueprint, campaignName);

  const totalSteps = steps.length;
  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
    if (completedCount === totalSteps && totalSteps > 0) {
      setShowCelebration(true);
    }
  }, [completed]);

  const toggleStep = (stepId: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
        const currentIndex = steps.findIndex(s => s.id === stepId);
        if (currentIndex < steps.length - 1) {
          const nextStep = steps[currentIndex + 1];
          setTimeout(() => {
            setActiveStep(nextStep.id);
            setCurrentPhase(nextStep.phase);
          }, 300);
        }
      }
      return next;
    });
  };

  const phaseSteps = (phaseId: number) =>
    steps.filter(s => s.phase === phaseId);

  const phaseCompleted = (phaseId: number) =>
    phaseSteps(phaseId).every(s => completed.has(s.id));

  const phaseProgress = (phaseId: number) => {
    const ps = phaseSteps(phaseId);
    const done = ps.filter(s => completed.has(s.id)).length;
    return Math.round((done / ps.length) * 100);
  };

  return (
    <div className="w-full">

      {/* ── TOP PROGRESS BAR ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">
            Campaign Setup Progress
          </span>
          <span
            className="text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #7B2FBE, #C026D3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {completedCount}/{totalSteps} steps
          </span>
        </div>

        <div className="h-2 bg-[#1E1E3A] rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7B2FBE, #C026D3)',
              boxShadow: '0 0 8px rgba(192,38,211,0.5)',
            }}
          />
        </div>

        {/* Phase indicators — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {PHASES.map((phase, i) => {
            const done = phaseCompleted(phase.id);
            const pct = phaseProgress(phase.id);
            const active = currentPhase === phase.id;
            const Icon = phase.icon;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setCurrentPhase(phase.id);
                  const firstStep = phaseSteps(phase.id)[0];
                  if (firstStep) setActiveStep(firstStep.id);
                }}
                className="flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border"
                style={{
                  background: active
                    ? `${phase.color}15`
                    : done
                    ? '#0F0F1A'
                    : '#0A0A0F',
                  borderColor: active
                    ? phase.color
                    : done
                    ? `${phase.color}40`
                    : '#1E1E3A',
                }}
              >
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: done
                        ? phase.color
                        : active
                        ? `${phase.color}30`
                        : '#1E1E3A',
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="text-white" />
                    ) : (
                      <Icon
                        size={14}
                        style={{ color: active ? phase.color : '#606080' }}
                      />
                    )}
                  </div>
                  {!done && pct > 0 && (
                    <svg
                      className="absolute inset-0 -rotate-90"
                      width="32"
                      height="32"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke={phase.color}
                        strokeWidth="2"
                        strokeDasharray={`${pct * 0.88} 88`}
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active || done ? '#ffffff' : '#606080' }}
                >
                  {phase.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phase indicators — mobile */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {PHASES.map(phase => {
            const done = phaseCompleted(phase.id);
            const active = currentPhase === phase.id;
            const Icon = phase.icon;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setCurrentPhase(phase.id);
                  const firstStep = phaseSteps(phase.id)[0];
                  if (firstStep) setActiveStep(firstStep.id);
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
                style={{
                  background: active ? `${phase.color}20` : 'transparent',
                  borderColor: active
                    ? phase.color
                    : done
                    ? `${phase.color}40`
                    : '#1E1E3A',
                  color: active || done ? '#ffffff' : '#606080',
                }}
              >
                {done ? (
                  <CheckCircle2 size={12} style={{ color: phase.color }} />
                ) : (
                  <Icon size={12} />
                )}
                {phase.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEPS LIST ── */}
      <div className="flex flex-col gap-3">
        {steps
          .filter(step => step.phase === currentPhase)
          .map((step, index) => {
            const isCompleted = completed.has(step.id);
            const isActive = activeStep === step.id;
            const Icon = step.phaseIcon;
            const stepNumber = steps.findIndex(s => s.id === step.id) + 1;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                className="rounded-2xl border overflow-hidden transition-all"
                style={{
                  background: isCompleted
                    ? 'rgba(34,197,94,0.05)'
                    : isActive
                    ? 'rgba(123,47,190,0.08)'
                    : '#0F0F1A',
                  borderColor: isCompleted
                    ? 'rgba(34,197,94,0.3)'
                    : isActive
                    ? 'rgba(123,47,190,0.4)'
                    : '#1E1E3A',
                }}
              >
                {/* Step header */}
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setActiveStep(isActive ? null : step.id)}
                >
                  <motion.div
                    animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: isCompleted
                        ? 'rgba(34,197,94,0.2)'
                        : isActive
                        ? `${step.phaseColor}20`
                        : '#0A0A0F',
                      borderColor: isCompleted
                        ? 'rgba(34,197,94,0.4)'
                        : isActive
                        ? `${step.phaseColor}50`
                        : '#1E1E3A',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-[#22c55e]" />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: isActive ? step.phaseColor : '#606080' }}
                      >
                        {stepNumber}
                      </span>
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm leading-snug"
                      style={{
                        color: isCompleted ? '#22c55e' : '#ffffff',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        textDecorationColor: 'rgba(34,197,94,0.4)',
                      }}
                    >
                      {step.title}
                    </p>
                    {!isActive && !isCompleted && (
                      <p className="text-[#606080] text-xs mt-0.5 truncate">
                        {step.instruction.substring(0, 60)}...
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-[#606080]">
                    {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Step content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#1E1E3A] pt-3">

                        <p className="text-[#A0A0C0] text-sm leading-relaxed">
                          {step.instruction}
                        </p>

                        {step.exactValue && (
                          <div
                            className="rounded-xl p-3 border"
                            style={{
                              background: `${step.phaseColor}08`,
                              borderColor: `${step.phaseColor}30`,
                            }}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <ArrowRight size={12} style={{ color: step.phaseColor }} />
                              <span
                                className="text-[10px] font-bold uppercase tracking-widest"
                                style={{ color: step.phaseColor }}
                              >
                                Exact value to use
                              </span>
                            </div>
                            <pre className="text-white text-sm font-mono whitespace-pre-wrap leading-relaxed">
                              {step.exactValue}
                            </pre>
                          </div>
                        )}

                        {step.subSteps && step.subSteps.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <p className="text-[#606080] text-xs font-semibold uppercase tracking-wider">
                              Steps to follow
                            </p>
                            {step.subSteps.map((sub, i) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                                  style={{
                                    background: `${step.phaseColor}20`,
                                    color: step.phaseColor,
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <span className="text-[#A0A0C0] text-sm leading-relaxed">
                                  {sub}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.tip && (
                          <div className="flex items-start gap-2 bg-[#7B2FBE]/10 border border-[#7B2FBE]/20 rounded-xl p-3">
                            <Info size={14} className="text-[#7B2FBE] flex-shrink-0 mt-0.5" />
                            <p className="text-[#A0A0C0] text-xs leading-relaxed">
                              <span className="text-[#7B2FBE] font-semibold">Pro tip: </span>
                              {step.tip}
                            </p>
                          </div>
                        )}

                        {step.warning && (
                          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                            <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-200/80 text-xs leading-relaxed">
                              <span className="text-amber-400 font-semibold">Warning: </span>
                              {step.warning}
                            </p>
                          </div>
                        )}

                        {step.link && (
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold transition-colors w-fit"
                            style={{ color: step.phaseColor }}
                          >
                            <ExternalLink size={14} />
                            {step.linkText || step.link}
                          </a>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleStep(step.id)}
                          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-1"
                          style={{
                            background: isCompleted
                              ? 'rgba(34,197,94,0.15)'
                              : `linear-gradient(135deg, ${step.phaseColor}, #C026D3)`,
                            color: isCompleted ? '#22c55e' : '#ffffff',
                            border: isCompleted ? '1px solid rgba(34,197,94,0.3)' : 'none',
                          }}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 size={16} />
                              Completed — Click to undo
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Mark as Done
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>

      {/* Phase navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={() => setCurrentPhase(p => Math.max(1, p - 1))}
          disabled={currentPhase === 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E1E3A] text-sm font-semibold text-[#A0A0C0] hover:border-[#7B2FBE]/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Previous Phase
        </button>

        <span className="text-[#606080] text-xs">
          Phase {currentPhase} of {PHASES.length}
        </span>

        <button
          onClick={() => setCurrentPhase(p => Math.min(PHASES.length, p + 1))}
          disabled={currentPhase === PHASES.length}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{
            background:
              currentPhase === PHASES.length
                ? '#1E1E3A'
                : 'linear-gradient(135deg, #7B2FBE, #C026D3)',
          }}
        >
          Next Phase →
        </button>
      </div>

      {/* Celebration modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-[#0F0F1A] border border-[#7B2FBE]/40 rounded-2xl p-8 max-w-sm w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white font-black text-2xl mb-2"
              >
                Campaign Ready!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#A0A0C0] text-sm mb-6 leading-relaxed"
              >
                You have completed all {totalSteps} steps. Your Meta ad campaign is set up and running.
                Now monitor it for 7 days without editing.
              </motion.p>

              <div className="bg-[#7B2FBE]/10 border border-[#7B2FBE]/20 rounded-xl p-3 mb-4 text-left">
                <p className="text-[#7B2FBE] text-xs font-bold mb-2 uppercase tracking-wider">
                  Your targets to watch
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-[#A0A0C0] text-xs">
                    Target ROAS: {blueprint.performance_benchmarks?.your_target_roas || '3x+'}
                  </span>
                  <span className="text-[#A0A0C0] text-xs">
                    Expected CTR: {blueprint.performance_benchmarks?.expected_ctr_feed || '1.5-3%'}
                  </span>
                  <span className="text-[#A0A0C0] text-xs">
                    Expected CPM: ₹{blueprint.performance_benchmarks?.expected_cpm_inr || '60-120'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #7B2FBE, #C026D3)' }}
              >
                Go crush it! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

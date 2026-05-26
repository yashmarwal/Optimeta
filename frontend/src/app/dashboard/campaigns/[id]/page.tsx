'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown, ArrowLeft, Copy, Check, TrendingUp, Target, DollarSign, Users,
  Layers, MessageSquare, Palette, CheckSquare, BarChart3, Sparkles, BookOpen,
  AlertTriangle, Zap, Calendar, Eye, Layout, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { CampaignViewSkeleton } from '@/components/ui/Skeleton';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { ExecutionMode } from '@/components/dashboard/ExecutionMode';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Blueprint {
  campaign_name: string;
  executive_summary: string;
  market_insight?: string;
  campaign_objective: {
    recommended: string;
    meta_objective_name?: string;
    reason: string;
    what_to_avoid?: string;
  };
  funnel_strategy: {
    stage: string;
    approach: string;
    cold_warm_split: string;
    budget_note?: string;
  };
  budget_strategy: {
    recommended_daily_budget_inr: string;
    total_monthly_inr?: string;
    split: Record<string, string>;
    scaling_logic: string;
    warning?: string;
  };
  campaign_structure?: {
    recommended_num_campaigns: number;
    recommended_num_adsets: number;
    recommended_num_ads: number;
    structure_reason: string;
    use_advantage_plus: boolean;
    advantage_plus_reason: string;
  };
  targeting: {
    approach?: string;
    approach_reason?: string;
    primary_audience: {
      age_range: string;
      gender: string;
      locations: string[];
      interests: string[];
      behaviors: string[];
      demographics?: {
        education?: string;
        relationship_status?: string;
        life_events?: string[];
        income_level?: string;
        parental_status?: string;
      };
      income_targeting?: string;
    };
    detailed_targeting_combinations?: Array<{
      combination_name: string;
      logic: string;
      interests: string[];
      behaviors: string[];
      demographics: string;
      why_this_combination: string;
    }>;
    lookalike_strategy: string;
    retargeting_strategy: string;
    retargeting_window_days?: number;
    audience_exclusions: string[];
    cod_targeting_note?: string;
  };
  ad_sets: Array<{
    ad_set_name: string;
    audience_type: string;
    objective: string;
    budget_allocation?: string;
    daily_budget_inr?: string;
    targeting_focus: string;
    why_this_audience?: string;
  }>;
  ad_angles: Array<{
    angle_type: string;
    angle_name: string;
    core_message: string;
    why_it_works?: string;
    why_it_works_for_this_brand?: string;
    best_for?: string;
  }>;
  ad_copies: Array<{
    angle: string;
    placement: string;
    hook?: string;
    primary_text: string;
    headline: string;
    sub_headline: string;
    cta: string;
    why_this_works?: string;
  }>;
  creative_direction: {
    priority_format?: string;
    visual_style: string;
    color_palette: string;
    content_formats: string[];
    hooks?: string[];
    video_hooks?: Array<{ hook_text: string; visual_direction: string; why_it_works: string }>;
    ugc_brief?: string;
    do: string[];
    dont: string[];
  };
  pixel_recommendation?: {
    current_status: string;
    immediate_action: string;
    capi_needed: boolean;
    optimization_event: string;
  };
  launch_checklist: Array<{ step: number; action: string; why: string; time_estimate: string } | string>;
  first_7_days_plan?: {
    day_1_3: string;
    day_4_7: string;
    when_to_edit: string;
    green_flags: string[];
    red_flags: string[];
  };
  performance_benchmarks: {
    category_average_roas?: string;
    your_target_roas?: string;
    expected_ctr?: string;
    expected_ctr_feed?: string;
    expected_ctr_reels?: string;
    expected_cpc_inr: string;
    expected_cpm_inr: string;
    expected_cpa_inr?: string;
    roas_target?: string;
    learning_phase_duration?: string;
    break_even_roas?: string;
  };
  budget_warning?: string | null;
  optimisation_diagnosis?: {
    what_went_wrong: string;
    what_to_keep: string;
    what_to_change: string;
    key_differences: string[];
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'summary', label: 'Executive Summary', icon: BookOpen },
  { id: 'objective', label: 'Objective', icon: Target },
  { id: 'funnel-budget', label: 'Funnel & Budget', icon: DollarSign },
  { id: 'structure', label: 'Structure', icon: Layout },
  { id: 'targeting', label: 'Targeting', icon: Users },
  { id: 'adsets', label: 'Ad Sets', icon: Layers },
  { id: 'angles', label: 'Ad Angles', icon: Sparkles },
  { id: 'copies', label: 'Ad Copies', icon: MessageSquare },
  { id: 'creative', label: 'Creative Direction', icon: Palette },
  { id: 'pixel', label: 'Pixel', icon: Zap },
  { id: 'first7days', label: 'First 7 Days', icon: Calendar },
  { id: 'checklist', label: 'Launch Checklist', icon: CheckSquare },
  { id: 'benchmarks', label: 'Performance', icon: BarChart3 },
];

const MOBILE_PILLS = [
  { id: 'm-summary', label: 'Summary' },
  { id: 'm-objective', label: 'Objective' },
  { id: 'm-budget', label: 'Budget' },
  { id: 'm-targeting', label: 'Targeting' },
  { id: 'm-copies', label: 'Copies' },
  { id: 'm-creative', label: 'Creative' },
  { id: 'm-checklist', label: 'Checklist' },
  { id: 'm-benchmarks', label: 'Benchmarks' },
];

const AUDIENCE_COLORS: Record<string, string> = {
  cold: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  warm: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  hot: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const AUDIENCE_TOOLTIP_TERMS: Record<string, string> = {
  cold: 'Cold Audience',
  warm: 'Warm Audience',
  hot: 'Hot Audience',
};

const ANGLE_COLORS: Record<string, string> = {
  pain: 'bg-red-500/10 text-red-400 border-red-500/30',
  desire: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  trust: 'bg-green-500/10 text-green-400 border-green-500/30',
  curiosity: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  social_proof: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  price_value: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  urgency: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

const PLACEMENT_COLORS: Record<string, string> = {
  Feed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Reel: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Story: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
};

// ─── Micro Components ─────────────────────────────────────────────────────────

function CopyButton({ text, size = 14 }: { text: string; size?: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-primary/20 transition-all text-text-muted hover:text-white flex-shrink-0"
      title="Copy"
    >
      {copied ? <Check size={size} className="text-green-400" /> : <Copy size={size} />}
    </button>
  );
}

function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${className || 'bg-primary/10 text-accent border-primary/25'}`}>{children}</span>;
}

function SectionCard({ id, children, delay = 0 }: { id: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className="glass-card p-6 sm:p-8 mb-6"
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-black gradient-text mb-5 pb-4 border-b border-border-color uppercase tracking-wide">{children}</h2>;
}

function MetricBox({ label, value, sub, highlight }: { label: React.ReactNode; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border text-center ${highlight ? 'bg-primary/10 border-primary/30' : 'bg-bg-dark border-border-color'}`}>
      <div className={`text-2xl font-black mb-1 ${highlight ? 'gradient-text' : 'text-white'}`}>{value}</div>
      {sub && <div className="text-xs text-text-muted mb-0.5">{sub}</div>}
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CampaignViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<{ id: string; campaign_name: string; created_at: string; blueprint: Blueprint } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('summary');
  const [activeMobileSection, setActiveMobileSection] = useState('m-summary');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [mode, setMode] = useState<'blueprint' | 'execution'>('blueprint');
  const [isFlipping, setIsFlipping] = useState(false);

  const handleModeSwitch = (newMode: 'blueprint' | 'execution') => {
    if (newMode === mode || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setMode(newMode);
      setIsFlipping(false);
    }, 400);
  };
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${id}`);
    if (saved) setCheckedItems(JSON.parse(saved));
  }, [id]);

  useEffect(() => {
    api.get(`/api/campaigns/${id}`)
      .then(({ data }) => setCampaign(data.data.campaign))
      .catch(() => { toast.error('Campaign not found.'); router.push('/dashboard'); })
      .finally(() => setLoading(false));
  }, [id, router]);

  // Scroll spy for desktop sidebar
  useEffect(() => {
    if (!campaign) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach(({ id: sid }) => {
      const el = document.getElementById(sid);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [campaign]);

  const toggleCheck = useCallback((i: number, total: number) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      localStorage.setItem(`checklist-${id}`, JSON.stringify(next));
      const done = Object.values(next).filter(Boolean).length;
      if (done === total && !allChecked) {
        setAllChecked(true);
        toast.success('🎉 Launch checklist complete! Time to go live.');
      }
      return next;
    });
  }, [id, allChecked]);

  const handleExport = async () => {
    if (user?.plan === 'free') { toast.error('PDF export is available on Pro and Ultra plans.'); return; }
    setExporting(true);
    try {
      const response = await api.get(`/api/campaigns/${id}/export`, { responseType: 'text' });
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Could not open print window. Please allow popups for this site.');
        return;
      }
      printWindow.document.write(response.data as string);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 600);
      toast.success('Print dialog opened — choose "Save as PDF" to download.');
    } catch { toast.error('Export failed.'); }
    finally { setExporting(false); }
  };

  const scrollToMobile = (sectionId: string) => {
    setActiveMobileSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <CampaignViewSkeleton />;

  if (!campaign) return null;

  const bp = campaign.blueprint;
  const checklistItems = bp.launch_checklist || [];
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistProgress = checklistItems.length > 0 ? Math.round((checkedCount / checklistItems.length) * 100) : 0;
  const budgetSplitEntries = Object.entries(bp.budget_strategy?.split || {});
  const createdDate = new Date(campaign.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="w-full max-w-full overflow-x-hidden">

      {/* ═══════════════════════════════════════
          DESKTOP LAYOUT (hidden on mobile)
          ═══════════════════════════════════════ */}
      <div className="hidden md:block max-w-7xl mx-auto pb-8">

        {bp.budget_warning && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold mb-0.5">Budget Advisory</div>
              <div className="text-xs leading-relaxed">{bp.budget_warning}</div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <ArrowLeft size={18} className="text-text-secondary" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white">{bp.campaign_name}</h1>
              <p className="text-xs text-text-muted">Generated {createdDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium btn-ghost">
              <Copy size={14} /> Copy Link
            </button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleExport} disabled={exporting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                user?.plan === 'free' ? 'bg-white/5 border border-border-color text-text-muted cursor-not-allowed' : 'btn-gradient'
              }`}>
              <FileDown size={15} />
              {exporting ? 'Exporting...' : user?.plan === 'free' ? 'Export (Pro)' : 'Export Blueprint'}
            </motion.button>
          </div>
        </div>

        {/* ── Mode Toggle ── */}
        <div className="w-full flex justify-center mb-6">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A]">
            <button
              onClick={() => handleModeSwitch('blueprint')}
              className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: mode === 'blueprint' ? 'linear-gradient(135deg, #7B2FBE, #C026D3)' : 'transparent',
                color: mode === 'blueprint' ? '#ffffff' : '#606080',
              }}
            >
              📋 Blueprint
            </button>
            <button
              onClick={() => handleModeSwitch('execution')}
              className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: mode === 'execution' ? 'linear-gradient(135deg, #7B2FBE, #C026D3)' : 'transparent',
                color: mode === 'execution' ? '#ffffff' : '#606080',
              }}
            >
              🚀 Execution Mode
            </button>
          </div>
        </div>
        {mode === 'execution' && (
          <p className="text-[#606080] text-xs mb-4 flex items-center gap-1.5">
            <span>⚡</span>
            Follow steps in order to set up your campaign in Meta Ads Manager. Your progress is saved automatically.
          </p>
        )}

        <div className="flex gap-6">
          {/* Sidebar nav */}
          {mode === 'blueprint' && (
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 glass-card p-3 space-y-0.5">
              {NAV_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    activeSection === s.id ? 'bg-primary/15 text-white border border-primary/30' : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}>
                  <s.icon size={12} />
                  {s.label}
                  {activeSection === s.id && <ChevronRight size={10} className="ml-auto" />}
                </a>
              ))}
            </div>
          </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* 3D flip card — blueprint on front, execution on back */}
            <div style={{ perspective: '1200px', width: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transform: mode === 'execution' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  minHeight: '400px',
                }}
              >
            {/* FRONT — Blueprint */}
            <div
              style={{
                position: mode === 'blueprint' ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden' as any,
              }}
            >
            {/* Optimisation Diagnosis Card */}
            {bp.optimisation_diagnosis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg">
                    🔍
                  </div>
                  <div>
                    <div className="text-xs text-amber-400 font-semibold uppercase tracking-wide">Optimisation Analysis</div>
                    <div className="text-base font-black text-white">What We Changed & Why</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                    <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1.5">What went wrong</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_went_wrong}</p>
                  </div>
                  <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                    <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5">What to keep</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_to_keep}</p>
                  </div>
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1.5">What changed</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_to_change}</p>
                  </div>
                  {bp.optimisation_diagnosis.key_differences?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">Key Differences</div>
                      <div className="flex flex-wrap gap-2">
                        {bp.optimisation_diagnosis.key_differences.map((d, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <SectionCard id="summary">
              <div className="bg-gradient-to-br from-primary/15 via-accent/10 to-transparent border border-primary/20 rounded-2xl p-6 mb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-2xl font-black text-white leading-tight">{bp.campaign_name}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30 flex-shrink-0">Blueprint Ready</span>
                </div>
                <p className="text-text-secondary leading-relaxed text-sm">{bp.executive_summary}</p>
              </div>
              {bp.market_insight && (
                <div className="border-l-4 border-primary pl-5 py-2">
                  <div className="text-xs text-accent font-semibold mb-1 uppercase tracking-wide">India Market Insight</div>
                  <p className="text-text-secondary text-sm leading-relaxed italic">{bp.market_insight}</p>
                </div>
              )}
            </SectionCard>

            <SectionCard id="objective" delay={0.05}>
              <SectionTitle>Campaign Objective</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                  <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Recommended Objective</div>
                  <div className="text-xl font-black gradient-text mb-1">{bp.campaign_objective?.recommended}</div>
                  {bp.campaign_objective?.meta_objective_name && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-text-muted">In Meta Ads Manager, select:</span>
                      <div className="flex items-center gap-1.5">
                        <code className="px-2 py-0.5 rounded bg-primary/15 text-accent text-xs font-mono border border-primary/25">
                          {bp.campaign_objective.meta_objective_name}
                        </code>
                        <CopyButton text={bp.campaign_objective.meta_objective_name} size={12} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                  <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Why This Objective</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.campaign_objective?.reason}</p>
                </div>
              </div>
              {bp.campaign_objective?.what_to_avoid && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-red-400 font-semibold mb-1">What to Avoid</div>
                    <p className="text-sm text-text-secondary">{bp.campaign_objective.what_to_avoid}</p>
                  </div>
                </div>
              )}
            </SectionCard>

            <div id="funnel-budget" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.05 }} className="glass-card p-6">
                <SectionTitle>Funnel Strategy</SectionTitle>
                <div className="flex gap-2 mb-5">
                  {['TOFU', 'MOFU', 'BOFU'].map((stage, i) => (
                    <div key={stage} className={`flex-1 rounded-xl p-3 border text-center ${
                      i === 0 ? 'bg-blue-500/10 border-blue-500/30' : i === 1 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="text-xs font-black text-white flex items-center justify-center">{stage}<InfoTooltip term={stage} /></div>
                      <div className={`text-xs mt-0.5 ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-orange-400' : 'text-red-400'}`}>
                        {i === 0 ? 'Awareness' : i === 1 ? 'Consider' : 'Convert'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="bg-bg-dark rounded-xl p-3 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Stage Focus</div>
                    <div className="text-sm font-semibold text-white">{bp.funnel_strategy?.stage}</div>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-3 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Cold / Warm Split</div>
                    <div className="text-sm font-semibold gradient-text">{bp.funnel_strategy?.cold_warm_split}</div>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-3 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Approach</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.funnel_strategy?.approach}</p>
                  </div>
                  {bp.funnel_strategy?.budget_note && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-amber-300 leading-relaxed">{bp.funnel_strategy.budget_note}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="glass-card p-6">
                <SectionTitle>Budget Strategy</SectionTitle>
                <div className="text-center mb-5 p-5 bg-gradient-to-b from-primary/15 to-transparent rounded-xl border border-primary/20">
                  <div className="text-xs text-text-muted mb-1">Recommended Daily Budget</div>
                  <div className="text-4xl font-black gradient-text">{bp.budget_strategy?.recommended_daily_budget_inr}</div>
                  {bp.budget_strategy?.total_monthly_inr && (
                    <div className="text-xs text-text-muted mt-1">≈ {bp.budget_strategy.total_monthly_inr} / month</div>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  {budgetSplitEntries.map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-bg-dark rounded-xl border border-border-color">
                      <span className="text-xs text-text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-black gradient-text">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-bg-dark rounded-xl p-3 border border-border-color mb-3">
                  <div className="text-xs text-text-muted mb-1">Scaling Logic</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.budget_strategy?.scaling_logic}</p>
                </div>
                {bp.budget_strategy?.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 leading-relaxed">{bp.budget_strategy.warning}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {bp.campaign_structure && (
              <SectionCard id="structure" delay={0.05}>
                <SectionTitle>Campaign Structure</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  <MetricBox label="Campaigns" value={String(bp.campaign_structure.recommended_num_campaigns)} />
                  <MetricBox label="Ad Sets" value={String(bp.campaign_structure.recommended_num_adsets)} highlight />
                  <MetricBox label="Ads" value={String(bp.campaign_structure.recommended_num_ads)} />
                </div>
                <div className={`flex items-start gap-4 p-4 rounded-xl border mb-4 ${
                  bp.campaign_structure.use_advantage_plus ? 'bg-green-500/5 border-green-500/20' : 'bg-bg-dark border-border-color'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    bp.campaign_structure.use_advantage_plus ? 'bg-green-500/20' : 'bg-bg-card'
                  }`}>
                    {bp.campaign_structure.use_advantage_plus ? <Check size={16} className="text-green-400" /> : <Eye size={16} className="text-text-muted" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-0.5 flex items-center flex-wrap gap-x-0">
                      Advantage+<InfoTooltip term="Advantage+" /> Shopping: {bp.campaign_structure.use_advantage_plus ? 'Recommended' : 'Not recommended'}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{bp.campaign_structure.advantage_plus_reason}</p>
                  </div>
                </div>
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-1">Why this structure</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.campaign_structure.structure_reason}</p>
                </div>
              </SectionCard>
            )}

            <SectionCard id="targeting" delay={0.05}>
              <SectionTitle>Audience Targeting</SectionTitle>
              {bp.targeting.approach && (
                <div className="flex items-center gap-3 mb-5 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <Tag className="bg-primary/20 text-accent border-primary/30">{bp.targeting.approach}</Tag>
                  <p className="text-xs text-text-secondary leading-relaxed">{bp.targeting.approach_reason}</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-1">Age Range</div>
                  <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.age_range}</div>
                </div>
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-1">Gender</div>
                  <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.gender}</div>
                </div>
              </div>
              {bp.targeting?.primary_audience?.income_targeting && (
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-4">
                  <div className="text-xs text-text-muted mb-1">Income Targeting</div>
                  <div className="text-sm text-text-secondary">{bp.targeting.primary_audience.income_targeting}</div>
                </div>
              )}
              <div className="space-y-4 mb-4">
                {[
                  { label: 'Target Locations', items: bp.targeting?.primary_audience?.locations, tagClass: 'bg-blue-500/10 text-blue-400 border-blue-500/25' },
                  { label: 'Interests', items: bp.targeting?.primary_audience?.interests, tagClass: 'bg-primary/10 text-accent border-primary/25' },
                  { label: 'Behaviors', items: bp.targeting?.primary_audience?.behaviors, tagClass: 'bg-teal-500/10 text-teal-400 border-teal-500/25' },
                  { label: 'Audience Exclusions', items: bp.targeting?.audience_exclusions, tagClass: 'bg-red-500/10 text-red-400 border-red-500/25' },
                ].map(({ label, items, tagClass }) => (
                  <div key={label} className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-3">{label}</div>
                    <div className="flex flex-wrap gap-2">
                      {(items || []).map((item: string) => <Tag key={item} className={tagClass}>{item}</Tag>)}
                    </div>
                  </div>
                ))}
              </div>

              {bp.targeting?.primary_audience?.demographics && (() => {
                const d = bp.targeting.primary_audience.demographics;
                const hasAny = d.education || d.income_level || d.relationship_status || d.parental_status || (d.life_events && d.life_events.length > 0);
                return hasAny ? (
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-4">
                    <div className="text-xs text-text-muted mb-3 uppercase tracking-wide">Demographics</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {d.education && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/25">🎓 {d.education}</span>}
                      {d.income_level && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">💰 {d.income_level}</span>}
                      {d.relationship_status && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/25">❤️ {d.relationship_status}</span>}
                      {d.parental_status && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/25">👨‍👩‍👧 {d.parental_status}</span>}
                    </div>
                    {d.life_events && d.life_events.length > 0 && (
                      <div>
                        <div className="text-xs text-text-muted mb-2">Life Events</div>
                        <div className="flex flex-wrap gap-2">
                          {d.life_events.map((ev: string) => (
                            <span key={ev} className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">✨ {ev}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}

              {bp.targeting?.detailed_targeting_combinations && bp.targeting.detailed_targeting_combinations.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-text-muted mb-3 uppercase tracking-wide">Detailed Targeting Combinations</div>
                  <div className="space-y-3">
                    {bp.targeting.detailed_targeting_combinations.map((combo, i) => {
                      const comboText = [
                        `Combination: ${combo.combination_name}`,
                        `Logic: ${combo.logic}`,
                        combo.interests?.length ? `Interests: ${combo.interests.join(', ')}` : '',
                        combo.behaviors?.length ? `Behaviors: ${combo.behaviors.join(', ')}` : '',
                        combo.demographics ? `Demographics: ${combo.demographics}` : '',
                        combo.why_this_combination ? `Why: ${combo.why_this_combination}` : '',
                      ].filter(Boolean).join('\n');
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                          className="bg-bg-dark rounded-xl p-4 border border-border-color">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="font-semibold text-white text-sm">{combo.combination_name}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">{combo.logic}</span>
                            <CopyButton text={comboText} size={12} />
                          </div>
                          {combo.interests?.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-text-muted mb-1.5">Interests</div>
                              <div className="flex flex-wrap gap-1.5">
                                {combo.interests.map((item: string) => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-accent border border-primary/25">{item}</span>)}
                              </div>
                            </div>
                          )}
                          {combo.behaviors?.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-text-muted mb-1.5">Behaviors</div>
                              <div className="flex flex-wrap gap-1.5">
                                {combo.behaviors.map((item: string) => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/25">{item}</span>)}
                              </div>
                            </div>
                          )}
                          {combo.demographics && <div className="text-xs text-text-secondary mb-2">{combo.demographics}</div>}
                          {combo.why_this_combination && <p className="text-xs text-text-muted italic mt-2 leading-relaxed">{combo.why_this_combination}</p>}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2 flex items-center">Lookalike<InfoTooltip term="Lookalike Audience" /> Strategy</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.targeting?.lookalike_strategy}</p>
                </div>
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2 flex items-center">Retargeting<InfoTooltip term="Retargeting" /> Strategy</div>
                  {bp.targeting?.retargeting_window_days && (
                    <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/25">
                      {bp.targeting.retargeting_window_days}-day window
                    </span>
                  )}
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.targeting?.retargeting_strategy}</p>
                </div>
              </div>
              {bp.targeting?.cod_targeting_note && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <Check size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-green-400 font-semibold mb-1">COD Targeting Note</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.targeting.cod_targeting_note}</p>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard id="adsets" delay={0.05}>
              <SectionTitle>Ad Sets</SectionTitle>
              <div className="space-y-4">
                {(bp.ad_sets || []).map((set, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="bg-bg-dark rounded-xl p-5 border border-border-color">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-bold text-white text-sm">{set.ad_set_name}</span>
                        <CopyButton text={set.ad_set_name} size={12} />
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center ${AUDIENCE_COLORS[set.audience_type] || AUDIENCE_COLORS.cold}`}>
                          {set.audience_type?.toUpperCase()}<InfoTooltip term={AUDIENCE_TOOLTIP_TERMS[set.audience_type] || 'Cold Audience'} />
                        </span>
                      </div>
                      <span className="text-sm font-black gradient-text flex-shrink-0">
                        {set.daily_budget_inr ? `${set.daily_budget_inr}/day` : set.budget_allocation}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-text-muted mb-1">Objective</div>
                        <div className="text-sm text-text-secondary">{set.objective}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted mb-1">Targeting Focus</div>
                        <div className="text-sm text-text-secondary">{set.targeting_focus}</div>
                      </div>
                      {set.why_this_audience && (
                        <div className="md:col-span-2 mt-1 p-3 bg-bg-card rounded-lg border border-border-color">
                          <div className="text-xs text-text-muted mb-1">Why this audience</div>
                          <div className="text-sm text-text-secondary italic">{set.why_this_audience}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="angles" delay={0.05}>
              <SectionTitle>Ad Angles</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(bp.ad_angles || []).map((angle, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="bg-bg-dark rounded-xl p-5 border border-border-color">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ANGLE_COLORS[angle.angle_type] || ''}`}>
                        {angle.angle_type?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {angle.best_for && (
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${AUDIENCE_COLORS[angle.best_for] || ''}`}>{angle.best_for}</span>
                      )}
                    </div>
                    <div className="font-semibold text-white text-sm mb-2">{angle.angle_name}</div>
                    <div className="mb-3">
                      <div className="text-xs text-text-muted mb-1">Core Message</div>
                      <div className="text-sm text-text-secondary italic">&quot;{angle.core_message}&quot;</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted mb-1">Why it works</div>
                      <div className="text-xs text-text-secondary leading-relaxed">{angle.why_it_works_for_this_brand || angle.why_it_works}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="copies" delay={0.05}>
              <SectionTitle>Ad Copies</SectionTitle>
              <div className="space-y-6">
                {(bp.ad_copies || []).map((copy, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="bg-bg-dark rounded-2xl border border-border-color overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border-color bg-white/2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PLACEMENT_COLORS[copy.placement] || 'bg-primary/15 text-accent border-primary/30'}`}>
                        {copy.placement}
                      </span>
                      <span className="text-xs text-text-muted">{copy.angle}</span>
                      <div className="ml-auto">
                        <CopyButton text={`HOOK: ${copy.hook || ''}\n\nHEADLINE: ${copy.headline}\n\nPRIMARY TEXT:\n${copy.primary_text}\n\nSUB-HEADLINE: ${copy.sub_headline}\n\nCTA: ${copy.cta}`} />
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {copy.hook && (
                        <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/5 border border-accent/25 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎯</span>
                              <span className="text-xs font-bold text-accent uppercase tracking-wide">Hook — First 3 Seconds</span>
                            </div>
                            <CopyButton text={copy.hook} size={12} />
                          </div>
                          <div className="text-base font-bold text-white leading-snug">{copy.hook}</div>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-muted uppercase tracking-wide">Headline</span>
                          <CopyButton text={copy.headline} size={12} />
                        </div>
                        <div className="text-xl font-black text-white">{copy.headline}</div>
                        {copy.sub_headline && <div className="text-sm text-text-muted mt-1">{copy.sub_headline}</div>}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-text-muted uppercase tracking-wide">Primary Text</span>
                          <CopyButton text={copy.primary_text} size={12} />
                        </div>
                        <div className="text-sm text-text-secondary leading-relaxed p-4 bg-bg-card rounded-xl border border-border-color whitespace-pre-wrap">
                          {copy.primary_text}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-green-500/15 text-green-300 border border-green-500/25 min-h-[44px]">
                          {copy.cta}
                        </span>
                        {copy.why_this_works && (
                          <p className="text-xs text-text-muted italic leading-relaxed">{copy.why_this_works}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="creative" delay={0.05}>
              <SectionTitle>Creative Direction</SectionTitle>
              {bp.creative_direction?.priority_format && (
                <div className="flex items-center gap-3 mb-5 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <span className="text-xs text-text-muted">Priority Format:</span>
                  <Tag className="bg-accent/20 text-accent border-accent/30 font-bold">{bp.creative_direction.priority_format}</Tag>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2">Visual Style</div>
                  <div className="text-sm text-white">{bp.creative_direction?.visual_style}</div>
                </div>
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2">Color Palette</div>
                  <div className="text-sm text-white">{bp.creative_direction?.color_palette}</div>
                </div>
              </div>
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-5">
                <div className="text-xs text-text-muted mb-3">Content Formats</div>
                <div className="flex flex-wrap gap-2">
                  {(bp.creative_direction?.content_formats || []).map((f: string) => <Tag key={f}>{f}</Tag>)}
                </div>
              </div>
              {bp.creative_direction?.video_hooks && bp.creative_direction.video_hooks.length > 0 ? (
                <div className="mb-5">
                  <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-3">Video Hooks</div>
                  <div className="space-y-3">
                    {bp.creative_direction.video_hooks.map((h, i) => (
                      <div key={i} className="bg-bg-dark rounded-xl p-4 border border-border-color">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="text-base font-bold text-white leading-snug">&quot;{h.hook_text}&quot;</div>
                          <CopyButton text={h.hook_text} size={12} />
                        </div>
                        <div className="text-xs text-text-muted mb-1">Visual direction</div>
                        <div className="text-xs text-text-secondary mb-2">{h.visual_direction}</div>
                        <div className="text-xs text-accent italic">{h.why_it_works}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : bp.creative_direction?.hooks && (
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-5">
                  <div className="text-xs text-text-muted mb-3">Scroll-Stopping Hooks</div>
                  <div className="space-y-2">
                    {bp.creative_direction.hooks.map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">{i + 1}</div>
                        <div className="flex-1 flex items-start justify-between gap-2">
                          <div className="text-sm text-text-secondary italic">&quot;{h}&quot;</div>
                          <CopyButton text={h} size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {bp.creative_direction?.ugc_brief && (
                <div className="mb-5 bg-bg-dark rounded-xl p-5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs text-accent font-bold uppercase tracking-wide flex items-center">UGC<InfoTooltip term="UGC" /> Creator Brief</div>
                      <div className="text-xs text-text-muted">Send this exact brief to your UGC creator</div>
                    </div>
                    <CopyButton text={bp.creative_direction.ugc_brief} />
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.creative_direction.ugc_brief}</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                  <div className="text-xs text-green-400 font-bold mb-3 uppercase tracking-wide">✓ DO</div>
                  <div className="space-y-2">
                    {(bp.creative_direction?.do || []).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-green-400 flex-shrink-0 font-bold">✓</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                  <div className="text-xs text-red-400 font-bold mb-3 uppercase tracking-wide">✗ DON&apos;T</div>
                  <div className="space-y-2">
                    {(bp.creative_direction?.dont || []).map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-red-400 flex-shrink-0 font-bold">✗</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {bp.pixel_recommendation && (
              <SectionCard id="pixel" delay={0.05}>
                <SectionTitle>Pixel Recommendation</SectionTitle>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-2">Current Status</div>
                    <div className="text-sm font-semibold text-white">{bp.pixel_recommendation.current_status}</div>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-2">Optimization Event</div>
                    <code className="text-sm text-accent font-mono break-all">{bp.pixel_recommendation.optimization_event}</code>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
                  <div className="text-xs text-accent font-bold mb-2 uppercase tracking-wide">Immediate Action Required</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.pixel_recommendation.immediate_action}</p>
                </div>
                {bp.pixel_recommendation.capi_needed && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/25">
                    <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-amber-400 font-bold mb-1 flex items-center">Conversions API (CAPI<InfoTooltip term="CAPI" />) Required</div>
                      <p className="text-xs text-text-secondary leading-relaxed">Server-side tracking is essential at your scale to avoid data loss from iOS restrictions and ad blockers. Set up CAPI via Shopify app or GTM before launching.</p>
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {bp.first_7_days_plan && (
              <SectionCard id="first7days" delay={0.05}>
                <SectionTitle>First 7 Days Plan</SectionTitle>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">1-3</div>
                      <div className="text-sm font-bold text-white">Days 1–3: Launch</div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.first_7_days_plan.day_1_3}</p>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs font-black text-purple-400">4-7</div>
                      <div className="text-sm font-bold text-white">Days 4–7: Observe</div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.first_7_days_plan.day_4_7}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 mb-5">
                  <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-amber-400 font-bold mb-1">When to Edit</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{bp.first_7_days_plan.when_to_edit}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                    <div className="text-xs text-green-400 font-bold mb-3 uppercase tracking-wide">🟢 Green Flags</div>
                    <div className="space-y-2">
                      {(bp.first_7_days_plan.green_flags || []).map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-green-400 font-bold flex-shrink-0">✓</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                    <div className="text-xs text-red-400 font-bold mb-3 uppercase tracking-wide">🔴 Red Flags</div>
                    <div className="space-y-2">
                      {(bp.first_7_days_plan.red_flags || []).map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-red-400 font-bold flex-shrink-0">✗</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard id="checklist" delay={0.05}>
              <SectionTitle>Launch Checklist</SectionTitle>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">{checkedCount} of {checklistItems.length} completed</span>
                  <span className="text-xs font-bold gradient-text">{checklistProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div className="h-full progress-bar" animate={{ width: `${checklistProgress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
              <div className="space-y-3">
                {checklistItems.map((item, i) => {
                  const isObj = typeof item === 'object' && item !== null;
                  const action = isObj ? item.action : item as string;
                  const why = isObj ? item.why : undefined;
                  const time = isObj ? item.time_estimate : undefined;
                  const stepNum = isObj ? item.step : i + 1;
                  return (
                    <motion.div key={i} whileTap={{ scale: 0.99 }} onClick={() => toggleCheck(i, checklistItems.length)}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all min-h-[52px] ${
                        checkedItems[i] ? 'bg-green-500/5 border-green-500/25' : 'bg-bg-dark border-border-color hover:border-primary/40'
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border mt-0.5 ${
                        checkedItems[i] ? 'bg-green-500 border-green-500' : 'border-border-color bg-bg-dark'
                      }`}>
                        {checkedItems[i] ? <Check size={13} className="text-white" /> : <span className="text-xs font-bold text-text-muted">{stepNum}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium leading-relaxed ${checkedItems[i] ? 'text-text-muted line-through' : 'text-white'}`}>{action}</div>
                        {(why || time) && (
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {why && <div className="text-xs text-text-muted leading-relaxed">{why}</div>}
                            {time && <span className="text-xs text-text-muted bg-bg-card px-2 py-0.5 rounded-lg border border-border-color flex-shrink-0">{time}</span>}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard id="benchmarks" delay={0.05}>
              <SectionTitle>Performance Benchmarks</SectionTitle>
              {(bp.performance_benchmarks?.category_average_roas || bp.performance_benchmarks?.your_target_roas) && (
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {bp.performance_benchmarks.category_average_roas && (
                    <MetricBox label={<span className="flex items-center justify-center">Category Avg ROAS<InfoTooltip term="ROAS" /></span>} value={bp.performance_benchmarks.category_average_roas} />
                  )}
                  {(bp.performance_benchmarks.your_target_roas || bp.performance_benchmarks.roas_target) && (
                    <MetricBox label={<span className="flex items-center justify-center">Your Target ROAS<InfoTooltip term="ROAS" /></span>} value={bp.performance_benchmarks.your_target_roas || bp.performance_benchmarks.roas_target || ''} highlight />
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {[
                  { key: 'CTR Feed', label: <span className="flex items-center justify-center">CTR (Feed)<InfoTooltip term="CTR" /></span>, val: bp.performance_benchmarks?.expected_ctr_feed || bp.performance_benchmarks?.expected_ctr },
                  { key: 'CTR Reels', label: <span className="flex items-center justify-center">CTR (Reels)<InfoTooltip term="CTR" /></span>, val: bp.performance_benchmarks?.expected_ctr_reels },
                  { key: 'CPC', label: <span className="flex items-center justify-center">CPC<InfoTooltip term="CPC" /></span>, val: bp.performance_benchmarks?.expected_cpc_inr },
                  { key: 'CPM', label: <span className="flex items-center justify-center">CPM<InfoTooltip term="CPM" /></span>, val: bp.performance_benchmarks?.expected_cpm_inr },
                  { key: 'CPA', label: <span className="flex items-center justify-center">CPA<InfoTooltip term="CPA" /></span>, val: bp.performance_benchmarks?.expected_cpa_inr },
                  { key: 'Learning Phase', label: <span className="flex items-center justify-center">Learning Phase<InfoTooltip term="Learning Phase" /></span>, val: bp.performance_benchmarks?.learning_phase_duration },
                ].filter((m) => m.val).map((m) => (
                  <MetricBox key={m.key} label={m.label} value={m.val!} />
                ))}
              </div>
              {bp.performance_benchmarks?.break_even_roas && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-amber-400 font-bold uppercase tracking-wide mb-0.5 flex items-center">Break-Even ROAS<InfoTooltip term="Break Even ROAS" /></div>
                    <div className="text-xs text-text-muted">Don&apos;t scale below this number</div>
                  </div>
                  <div className="text-2xl font-black text-amber-300">{bp.performance_benchmarks.break_even_roas}</div>
                </div>
              )}
            </SectionCard>

            </div>

            {/* BACK — Execution Mode */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden' as any,
                transform: 'rotateY(180deg)',
              }}
            >
              <ExecutionMode
                blueprint={campaign.blueprint as any}
                campaignName={campaign.campaign_name || bp.campaign_name}
                campaignId={campaign.id}
              />
            </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MOBILE LAYOUT (hidden on desktop)
          ═══════════════════════════════════════ */}
      <div className="block md:hidden min-h-screen bg-[#0A0A0F] pb-24 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-hidden">

        {/* Mobile sticky header */}
        <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0A0A0F]/95 backdrop-blur-md border-b border-[#1E1E3A] w-full">
          <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 flex-shrink-0">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate min-w-0">{bp.campaign_name}</div>
            <div className="text-xs text-[#505070]">{createdDate}</div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
              <Copy size={16} className="text-[#A0A0C0]" />
            </button>
            <button onClick={handleExport} disabled={exporting}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
              <FileDown size={16} className={user?.plan === 'free' ? 'text-[#505070]' : 'text-white'} />
            </button>
          </div>
        </div>

        {/* ── Mode Toggle (Mobile) ── */}
        <div className="w-full flex justify-center mt-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A]">
            <button
              onClick={() => handleModeSwitch('blueprint')}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: mode === 'blueprint' ? 'linear-gradient(135deg, #7B2FBE, #C026D3)' : 'transparent',
                color: mode === 'blueprint' ? '#ffffff' : '#606080',
              }}
            >
              📋 Blueprint
            </button>
            <button
              onClick={() => handleModeSwitch('execution')}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
              style={{
                background: mode === 'execution' ? 'linear-gradient(135deg, #7B2FBE, #C026D3)' : 'transparent',
                color: mode === 'execution' ? '#ffffff' : '#606080',
              }}
            >
              🚀 Execution
            </button>
          </div>
        </div>

        {mode === 'blueprint' && (<>
        {/* Mobile pill nav */}
        <div style={{ WebkitOverflowScrolling: 'touch' }} className="flex overflow-x-auto gap-2 py-3 px-4 scrollbar-hide sticky top-[52px] bg-[#0A0A0F]/95 backdrop-blur-md z-40 border-b border-[#1E1E3A]/50 w-full">
          {MOBILE_PILLS.map((s) => (
            <button key={s.id} onClick={() => scrollToMobile(s.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeMobileSection === s.id
                  ? 'bg-gradient-to-r from-[#7B2FBE] to-[#C026D3] text-white'
                  : 'bg-[#0F0F1A] border border-[#1E1E3A] text-[#A0A0C0]'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Budget warning */}
        {bp.budget_warning && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">{bp.budget_warning}</p>
          </div>
        )}

        {/* Optimisation Diagnosis (mobile) */}
        {bp.optimisation_diagnosis && (
          <div className="px-4 pt-4">
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5 mb-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🔍</span>
                <div>
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-wide">Optimisation Analysis</div>
                  <div className="text-sm font-black text-white">What We Changed & Why</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                  <div className="text-xs font-semibold text-red-400 mb-1">What went wrong</div>
                  <p className="text-xs text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_went_wrong}</p>
                </div>
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
                  <div className="text-xs font-semibold text-green-400 mb-1">What to keep</div>
                  <p className="text-xs text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_to_keep}</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
                  <div className="text-xs font-semibold text-blue-400 mb-1">What changed</div>
                  <p className="text-xs text-text-secondary leading-relaxed">{bp.optimisation_diagnosis.what_to_change}</p>
                </div>
                {bp.optimisation_diagnosis.key_differences?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bp.optimisation_diagnosis.key_differences.map((d, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">{d}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 1. Summary ── */}
        <div id="m-summary" className="px-4 pt-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7B2FBE]/20 to-[#C026D3]/20 border border-[#7B2FBE]/30 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30 inline-block mb-3">Blueprint Ready</span>
            <h2 className="text-xl font-bold text-white mb-3 break-words">{bp.campaign_name}</h2>
            <p className="text-sm text-[#A0A0C0] leading-relaxed break-words">{bp.executive_summary}</p>
          </div>
          {bp.market_insight && (
            <div className="border-l-4 border-[#7B2FBE] pl-4 py-2 mb-4">
              <div className="text-xs text-accent font-semibold mb-1 uppercase tracking-wide">India Market Insight</div>
              <p className="text-sm text-[#A0A0C0] italic leading-relaxed break-words">{bp.market_insight}</p>
            </div>
          )}
        </div>

        {/* ── 2. Objective ── */}
        <div id="m-objective" className="px-4 pt-6">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Campaign Objective</div>
          <div className="p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A] mb-3">
            <div className="text-xs text-[#505070] mb-1">Recommended</div>
            <div className="text-2xl font-black gradient-text mb-3">{bp.campaign_objective?.recommended}</div>
            {bp.campaign_objective?.meta_objective_name && (
              <div className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-xl border border-[#7B2FBE]/30 mb-3">
                <div>
                  <div className="text-xs text-[#505070] mb-0.5">In Meta Ads Manager, select:</div>
                  <code className="text-sm text-accent font-mono break-all">{bp.campaign_objective.meta_objective_name}</code>
                </div>
                <CopyButton text={bp.campaign_objective.meta_objective_name} size={14} />
              </div>
            )}
            <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.campaign_objective?.reason}</p>
          </div>
          {bp.campaign_objective?.what_to_avoid && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start gap-2 mb-3">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#A0A0C0]">{bp.campaign_objective.what_to_avoid}</p>
            </div>
          )}
        </div>

        {/* ── 3. Budget ── */}
        <div id="m-budget" className="px-4 pt-6">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Budget Strategy</div>
          <div className="p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A] mb-3 text-center">
            <div className="text-xs text-[#505070] mb-1">Recommended Daily Budget</div>
            <div className="text-4xl font-black gradient-text break-all">{bp.budget_strategy?.recommended_daily_budget_inr}</div>
            {bp.budget_strategy?.total_monthly_inr && (
              <div className="text-xs text-[#505070] mt-1 break-words">≈ {bp.budget_strategy.total_monthly_inr} / month</div>
            )}
          </div>
          <div className="space-y-2 mb-3">
            {budgetSplitEntries.map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                <span className="text-xs text-[#505070] capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-sm font-black gradient-text">{val}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1E1E3A] mb-3">
            <div className="text-xs text-[#505070] mb-1">Scaling Logic</div>
            <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.budget_strategy?.scaling_logic}</p>
          </div>
          {bp.budget_strategy?.warning && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2 mb-3">
              <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300 leading-relaxed">{bp.budget_strategy.warning}</p>
            </div>
          )}

          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3 mt-5">Funnel Strategy</div>
          <div className="flex gap-2 mb-3">
            {['TOFU', 'MOFU', 'BOFU'].map((stage, i) => (
              <div key={stage} className={`flex-1 rounded-xl p-3 border text-center ${i === 0 ? 'bg-blue-500/10 border-blue-500/30' : i === 1 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="text-xs font-black text-white flex items-center justify-center">{stage}<InfoTooltip term={stage} /></div>
                <div className={`text-xs mt-0.5 ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-orange-400' : 'text-red-400'}`}>
                  {i === 0 ? 'Awareness' : i === 1 ? 'Consider' : 'Convert'}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Stage Focus</div>
              <div className="text-sm font-semibold text-white">{bp.funnel_strategy?.stage}</div>
            </div>
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Cold / Warm Split</div>
              <div className="text-sm font-semibold gradient-text">{bp.funnel_strategy?.cold_warm_split}</div>
            </div>
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Approach</div>
              <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.funnel_strategy?.approach}</p>
            </div>
          </div>

          {bp.campaign_structure && (
            <>
              <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3 mt-2">Campaign Structure</div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Campaigns', val: String(bp.campaign_structure.recommended_num_campaigns) },
                  { label: 'Ad Sets', val: String(bp.campaign_structure.recommended_num_adsets) },
                  { label: 'Ads', val: String(bp.campaign_structure.recommended_num_ads) },
                ].map((m) => (
                  <div key={m.label} className="rounded-2xl p-3 bg-[#0F0F1A] border border-[#1E1E3A] text-center">
                    <div className="text-2xl font-black gradient-text">{m.val}</div>
                    <div className="text-xs text-[#505070] mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── 4. Targeting ── */}
        <div id="m-targeting" className="px-4 pt-6 overflow-x-hidden">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Audience Targeting</div>

          {bp.targeting?.approach && (
            <div className="mb-3 p-3 bg-[#7B2FBE]/5 border border-[#7B2FBE]/20 rounded-xl">
              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium border bg-[#7B2FBE]/20 text-accent border-[#7B2FBE]/30 mb-2 break-words">{bp.targeting.approach}</span>
              {bp.targeting.approach_reason && <p className="text-xs text-[#A0A0C0] leading-relaxed break-words">{bp.targeting.approach_reason}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Age Range</div>
              <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.age_range}</div>
            </div>
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Gender</div>
              <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.gender}</div>
            </div>
          </div>

          {bp.targeting?.primary_audience?.income_targeting && (
            <div className="mb-3 p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Income Targeting</div>
              <div className="text-sm text-[#A0A0C0] break-words">{bp.targeting.primary_audience.income_targeting}</div>
            </div>
          )}

          {[
            { label: 'Interests', items: bp.targeting?.primary_audience?.interests, cls: 'bg-[#7B2FBE]/10 text-accent border-[#7B2FBE]/25' },
            { label: 'Behaviors', items: bp.targeting?.primary_audience?.behaviors, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/25' },
            { label: 'Locations', items: bp.targeting?.primary_audience?.locations, cls: 'bg-teal-500/10 text-teal-400 border-teal-500/25' },
            { label: 'Exclusions', items: bp.targeting?.audience_exclusions, cls: 'bg-red-500/10 text-red-400 border-red-500/25' },
          ].map(({ label, items, cls }) => (items || []).length > 0 ? (
            <div key={label} className="mb-3 p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-2">{label}</div>
              <div className="flex flex-wrap gap-1.5">
                {(items || []).map((item: string) => (
                  <span key={item} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cls}`}>{item}</span>
                ))}
              </div>
            </div>
          ) : null)}

          {bp.targeting?.primary_audience?.demographics && (() => {
            const d = bp.targeting.primary_audience.demographics!;
            const hasAny = d.education || d.income_level || d.relationship_status || d.parental_status || (d.life_events && d.life_events.length > 0);
            return hasAny ? (
              <div className="mb-3 p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                <div className="text-xs text-[#505070] mb-2 uppercase tracking-wide">Demographics</div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {d.education && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/25">🎓 {d.education}</span>}
                  {d.income_level && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">💰 {d.income_level}</span>}
                  {d.relationship_status && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/25">❤️ {d.relationship_status}</span>}
                  {d.parental_status && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/25">👨‍👩‍👧 {d.parental_status}</span>}
                </div>
                {d.life_events && d.life_events.length > 0 && (
                  <div>
                    <div className="text-xs text-[#505070] mb-1.5">Life Events</div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.life_events.map((ev: string) => (
                        <span key={ev} className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">✨ {ev}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {bp.targeting?.detailed_targeting_combinations && bp.targeting.detailed_targeting_combinations.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-[#505070] mb-2 uppercase tracking-wide">Detailed Targeting Combinations</div>
              <div className="space-y-3">
                {bp.targeting.detailed_targeting_combinations.map((combo, i) => {
                  const comboText = [
                    `Combination: ${combo.combination_name}`,
                    `Logic: ${combo.logic}`,
                    combo.interests?.length ? `Interests: ${combo.interests.join(', ')}` : '',
                    combo.behaviors?.length ? `Behaviors: ${combo.behaviors.join(', ')}` : '',
                    combo.demographics ? `Demographics: ${combo.demographics}` : '',
                    combo.why_this_combination ? `Why: ${combo.why_this_combination}` : '',
                  ].filter(Boolean).join('\n');
                  return (
                    <div key={i} className="p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="font-semibold text-white text-sm break-words">{combo.combination_name}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">{combo.logic}</span>
                        <CopyButton text={comboText} size={12} />
                      </div>
                      {combo.interests?.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-[#505070] mb-1.5">Interests</div>
                          <div className="flex flex-wrap gap-1.5">
                            {combo.interests.map((item: string) => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-[#7B2FBE]/10 text-accent border border-[#7B2FBE]/25">{item}</span>)}
                          </div>
                        </div>
                      )}
                      {combo.behaviors?.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-[#505070] mb-1.5">Behaviors</div>
                          <div className="flex flex-wrap gap-1.5">
                            {combo.behaviors.map((item: string) => <span key={item} className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/25">{item}</span>)}
                          </div>
                        </div>
                      )}
                      {combo.demographics && <div className="text-xs text-[#A0A0C0] mb-2 break-words">{combo.demographics}</div>}
                      {combo.why_this_combination && <p className="text-xs text-[#505070] italic mt-1 leading-relaxed break-words">{combo.why_this_combination}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1E1E3A] mb-3">
            <div className="text-xs text-[#505070] mb-2 flex items-center">Lookalike<InfoTooltip term="Lookalike Audience" /> Strategy</div>
            <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.targeting?.lookalike_strategy}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1E1E3A] mb-3">
            <div className="text-xs text-[#505070] mb-2 flex items-center">Retargeting<InfoTooltip term="Retargeting" /> Strategy</div>
            {bp.targeting?.retargeting_window_days && (
              <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/25">
                {bp.targeting.retargeting_window_days}-day window
              </span>
            )}
            <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.targeting?.retargeting_strategy}</p>
          </div>

          {bp.targeting?.cod_targeting_note && (
            <div className="mb-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-start gap-2">
              <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-green-400 font-semibold mb-1">COD Targeting Note</div>
                <p className="text-sm text-[#A0A0C0] leading-relaxed break-words">{bp.targeting.cod_targeting_note}</p>
              </div>
            </div>
          )}

          {/* Ad Sets horizontal scroll */}
          {(bp.ad_sets || []).length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Ad Sets</div>
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
                {(bp.ad_sets || []).map((set, i) => (
                  <div key={i} className={`w-72 flex-shrink-0 p-4 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A] border-t-2 ${
                    set.audience_type === 'cold' ? 'border-t-blue-500' : set.audience_type === 'warm' ? 'border-t-orange-500' : 'border-t-red-500'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border inline-flex items-center ${AUDIENCE_COLORS[set.audience_type] || AUDIENCE_COLORS.cold}`}>
                        {set.audience_type?.toUpperCase()}<InfoTooltip term={AUDIENCE_TOOLTIP_TERMS[set.audience_type] || 'Cold Audience'} />
                      </span>
                      <span className="text-sm font-black gradient-text ml-auto">
                        {set.daily_budget_inr ? `${set.daily_budget_inr}/day` : set.budget_allocation}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm mb-2">{set.ad_set_name}</div>
                    <div className="text-xs text-[#505070] mb-1">Objective</div>
                    <div className="text-xs text-[#A0A0C0] mb-2">{set.objective}</div>
                    <div className="text-xs text-[#505070] mb-1">Focus</div>
                    <div className="text-xs text-[#A0A0C0]">{set.targeting_focus}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Angles horizontal scroll */}
          {(bp.ad_angles || []).length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Ad Angles</div>
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4">
                {(bp.ad_angles || []).map((angle, i) => (
                  <div key={i} className="w-64 flex-shrink-0 p-4 rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A]">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ANGLE_COLORS[angle.angle_type] || ''} inline-block mb-2`}>
                      {angle.angle_type?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <div className="font-semibold text-white text-sm mb-1">{angle.angle_name}</div>
                    <div className="text-xs text-[#A0A0C0] italic mb-2">&quot;{angle.core_message}&quot;</div>
                    <div className="text-xs text-[#505070] leading-relaxed">{angle.why_it_works_for_this_brand || angle.why_it_works}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 5. Copies ── */}
        <div id="m-copies" className="px-4 pt-6">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Ad Copies</div>
          <div className="space-y-4">
            {(bp.ad_copies || []).map((copy, i) => (
              <div key={i} className="rounded-2xl bg-[#0F0F1A] border border-[#1E1E3A] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E1E3A]">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PLACEMENT_COLORS[copy.placement] || 'bg-[#7B2FBE]/15 text-accent border-[#7B2FBE]/30'}`}>
                    {copy.placement}
                  </span>
                  <span className="text-xs text-[#505070] flex-1 truncate">{copy.angle}</span>
                  <CopyButton text={`HOOK: ${copy.hook || ''}\n\nHEADLINE: ${copy.headline}\n\nPRIMARY TEXT:\n${copy.primary_text}\n\nSUB-HEADLINE: ${copy.sub_headline}\n\nCTA: ${copy.cta}`} size={13} />
                </div>
                <div className="p-4 space-y-3">
                  {copy.hook && (
                    <div className="p-3 bg-[#0A0A0F] rounded-xl border border-accent/25">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-accent">🎯 Hook</span>
                        <CopyButton text={copy.hook} size={13} />
                      </div>
                      <div className="text-base font-bold text-white break-words">{copy.hook}</div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#505070] uppercase tracking-wide">Headline</span>
                      <CopyButton text={copy.headline} size={13} />
                    </div>
                    <div className="text-lg font-black text-white break-words">{copy.headline}</div>
                    {copy.sub_headline && <div className="text-xs text-[#505070] mt-0.5 break-words">{copy.sub_headline}</div>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#505070] uppercase tracking-wide">Primary Text</span>
                      <CopyButton text={copy.primary_text} size={13} />
                    </div>
                    <div className="text-sm text-[#A0A0C0] leading-relaxed p-3 bg-[#0A0A0F] rounded-xl border border-[#1E1E3A] whitespace-pre-wrap break-words w-full overflow-hidden">{copy.primary_text}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-500/15 text-green-300 border border-green-500/25">{copy.cta}</span>
                  </div>
                  {copy.why_this_works && (
                    <p className="text-xs text-[#505070] italic leading-relaxed">{copy.why_this_works}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Creative ── */}
        <div id="m-creative" className="px-4 pt-6">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Creative Direction</div>
          {bp.creative_direction?.priority_format && (
            <div className="mb-3 flex items-center gap-2 p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <span className="text-xs text-[#505070]">Priority Format:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">{bp.creative_direction.priority_format}</span>
            </div>
          )}
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Visual Style</div>
              <div className="text-sm text-white">{bp.creative_direction?.visual_style}</div>
            </div>
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-1">Color Palette</div>
              <div className="text-sm text-white">{bp.creative_direction?.color_palette}</div>
            </div>
            <div className="p-3 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-2">Content Formats</div>
              <div className="flex flex-wrap gap-1.5">
                {(bp.creative_direction?.content_formats || []).map((f: string) => (
                  <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-[#7B2FBE]/10 text-accent border-[#7B2FBE]/25">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {bp.creative_direction?.video_hooks && bp.creative_direction.video_hooks.length > 0 ? (
            <div className="mb-4">
              <div className="text-xs text-[#505070] mb-2 uppercase tracking-wide">Video Hooks</div>
              <div className="space-y-3">
                {bp.creative_direction.video_hooks.map((h, i) => (
                  <div key={i} className="p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-base font-bold text-white leading-snug">&quot;{h.hook_text}&quot;</div>
                      <CopyButton text={h.hook_text} size={13} />
                    </div>
                    <div className="text-xs text-[#505070] mb-1">Visual direction</div>
                    <div className="text-xs text-[#A0A0C0] mb-1">{h.visual_direction}</div>
                    <div className="text-xs text-accent italic">{h.why_it_works}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : bp.creative_direction?.hooks && (
            <div className="mb-4 p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
              <div className="text-xs text-[#505070] mb-3">Scroll-Stopping Hooks</div>
              <div className="space-y-2">
                {bp.creative_direction.hooks.map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#7B2FBE]/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div className="flex-1 flex items-start justify-between gap-2">
                      <div className="text-sm text-[#A0A0C0] italic">&quot;{h}&quot;</div>
                      <CopyButton text={h} size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bp.creative_direction?.ugc_brief && (
            <div className="mb-4 p-4 bg-[#0F0F1A] rounded-xl border border-[#7B2FBE]/20">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-accent font-bold uppercase tracking-wide flex items-center">UGC<InfoTooltip term="UGC" /> Creator Brief</div>
                <CopyButton text={bp.creative_direction.ugc_brief} size={13} />
              </div>
              <p className="text-sm text-[#A0A0C0] leading-relaxed break-words">{bp.creative_direction.ugc_brief}</p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="text-xs text-green-400 font-bold mb-3 uppercase tracking-wide">✓ DO</div>
              <div className="space-y-2">
                {(bp.creative_direction?.do || []).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#A0A0C0]">
                    <span className="text-green-400 flex-shrink-0 font-bold">✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="text-xs text-red-400 font-bold mb-3 uppercase tracking-wide">✗ DON&apos;T</div>
              <div className="space-y-2">
                {(bp.creative_direction?.dont || []).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#A0A0C0]">
                    <span className="text-red-400 flex-shrink-0 font-bold">✗</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {bp.pixel_recommendation && (
            <div className="mb-4">
              <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Pixel Recommendation</div>
              <div className="p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A] mb-3">
                <div className="text-xs text-[#505070] mb-1">Status</div>
                <div className="text-sm font-semibold text-white mb-3 break-words">{bp.pixel_recommendation.current_status}</div>
                <div className="text-xs text-[#505070] mb-1">Optimization Event</div>
                <code className="text-sm text-accent font-mono break-all">{bp.pixel_recommendation.optimization_event}</code>
              </div>
              <div className="p-4 rounded-xl bg-[#7B2FBE]/5 border border-[#7B2FBE]/20 mb-3">
                <div className="text-xs text-accent font-bold mb-2 uppercase tracking-wide">Immediate Action</div>
                <p className="text-sm text-[#A0A0C0] leading-relaxed break-words">{bp.pixel_recommendation.immediate_action}</p>
              </div>
            </div>
          )}

          {bp.first_7_days_plan && (
            <div className="mb-4">
              <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">First 7 Days Plan</div>
              <div className="space-y-3 mb-3">
                <div className="p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">1-3</div>
                    <div className="text-sm font-bold text-white">Days 1–3: Launch</div>
                  </div>
                  <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.first_7_days_plan.day_1_3}</p>
                </div>
                <div className="p-4 bg-[#0F0F1A] rounded-xl border border-[#1E1E3A]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs font-black text-purple-400">4-7</div>
                    <div className="text-sm font-bold text-white">Days 4–7: Observe</div>
                  </div>
                  <p className="text-sm text-[#A0A0C0] leading-relaxed">{bp.first_7_days_plan.day_4_7}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="text-xs text-green-400 font-bold mb-2">🟢 Green Flags</div>
                  <div className="space-y-1.5">
                    {(bp.first_7_days_plan.green_flags || []).map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#A0A0C0]">
                        <span className="text-green-400 font-bold flex-shrink-0">✓</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="text-xs text-red-400 font-bold mb-2">🔴 Red Flags</div>
                  <div className="space-y-1.5">
                    {(bp.first_7_days_plan.red_flags || []).map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#A0A0C0]">
                        <span className="text-red-400 font-bold flex-shrink-0">✗</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 7. Checklist ── */}
        <div id="m-checklist" className="px-4 pt-6">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Launch Checklist</div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#505070]">{checkedCount} of {checklistItems.length} completed</span>
              <span className="text-xs font-bold gradient-text">{checklistProgress}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full progress-bar transition-all duration-500" style={{ width: `${checklistProgress}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            {checklistItems.map((item, i) => {
              const isObj = typeof item === 'object' && item !== null;
              const action = isObj ? item.action : item as string;
              const why = isObj ? item.why : undefined;
              const time = isObj ? item.time_estimate : undefined;
              const stepNum = isObj ? item.step : i + 1;
              return (
                <div key={i} onClick={() => toggleCheck(i, checklistItems.length)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all min-h-[52px] ${
                    checkedItems[i] ? 'bg-green-500/5 border-green-500/25' : 'bg-[#0F0F1A] border-[#1E1E3A]'
                  }`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border mt-0.5 transition-all ${
                    checkedItems[i] ? 'bg-green-500 border-green-500' : 'border-[#1E1E3A] bg-[#0A0A0F]'
                  }`}>
                    {checkedItems[i] ? <Check size={13} className="text-white" /> : <span className="text-xs font-bold text-[#505070]">{stepNum}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium leading-relaxed ${checkedItems[i] ? 'text-[#505070] line-through' : 'text-white'}`}>{action}</div>
                    {(why || time) && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {why && <div className="text-xs text-[#505070] leading-relaxed">{why}</div>}
                        {time && <span className="text-xs text-[#505070] bg-[#0A0A0F] px-2 py-0.5 rounded-lg border border-[#1E1E3A] flex-shrink-0">{time}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {allChecked && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#7B2FBE]/20 to-[#C026D3]/20 border border-[#7B2FBE]/40 text-center">
              <div className="text-lg font-black text-white">🎉 Ready to Launch!</div>
              <div className="text-sm text-[#A0A0C0] mt-1">All checklist items complete</div>
            </div>
          )}
        </div>

        {/* ── 8. Benchmarks ── */}
        <div id="m-benchmarks" className="px-4 pt-6 pb-4">
          <div className="text-xs font-bold text-[#505070] uppercase tracking-widest mb-3">Performance Benchmarks</div>
          {(bp.performance_benchmarks?.category_average_roas || bp.performance_benchmarks?.your_target_roas) && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {bp.performance_benchmarks.category_average_roas && (
                <div className="rounded-2xl bg-[#0F0F1A] p-4 border border-[#1E1E3A] text-center">
                  <div className="text-xl font-black text-white">{bp.performance_benchmarks.category_average_roas}</div>
                  <div className="text-xs text-[#505070] mt-1 flex items-center justify-center">Category Avg ROAS<InfoTooltip term="ROAS" /></div>
                </div>
              )}
              {(bp.performance_benchmarks.your_target_roas || bp.performance_benchmarks.roas_target) && (
                <div className="rounded-2xl p-4 border border-[#7B2FBE]/30 bg-[#7B2FBE]/10 text-center">
                  <div className="text-xl font-black gradient-text">{bp.performance_benchmarks.your_target_roas || bp.performance_benchmarks.roas_target}</div>
                  <div className="text-xs text-[#505070] mt-1 flex items-center justify-center">Your Target ROAS<InfoTooltip term="ROAS" /></div>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { key: 'CTR Feed', label: <span className="flex items-center justify-center">CTR (Feed)<InfoTooltip term="CTR" /></span>, val: bp.performance_benchmarks?.expected_ctr_feed || bp.performance_benchmarks?.expected_ctr },
              { key: 'CTR Reels', label: <span className="flex items-center justify-center">CTR (Reels)<InfoTooltip term="CTR" /></span>, val: bp.performance_benchmarks?.expected_ctr_reels },
              { key: 'CPC', label: <span className="flex items-center justify-center">CPC<InfoTooltip term="CPC" /></span>, val: bp.performance_benchmarks?.expected_cpc_inr },
              { key: 'CPM', label: <span className="flex items-center justify-center">CPM<InfoTooltip term="CPM" /></span>, val: bp.performance_benchmarks?.expected_cpm_inr },
              { key: 'CPA', label: <span className="flex items-center justify-center">CPA<InfoTooltip term="CPA" /></span>, val: bp.performance_benchmarks?.expected_cpa_inr },
              { key: 'Learning Phase', label: <span className="flex items-center justify-center">Learning Phase<InfoTooltip term="Learning Phase" /></span>, val: bp.performance_benchmarks?.learning_phase_duration },
            ].filter((m) => m.val).map((m) => (
              <div key={m.key} className="rounded-2xl bg-[#0F0F1A] p-4 border border-[#1E1E3A] text-center">
                <div className="text-xl font-black text-white">{m.val}</div>
                <div className="text-xs text-[#505070] mt-1">{m.label}</div>
              </div>
            ))}
          </div>
          {bp.performance_benchmarks?.break_even_roas && (
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wide mb-0.5 flex items-center">Break-Even ROAS<InfoTooltip term="Break Even ROAS" /></div>
                <div className="text-xs text-[#505070]">Don&apos;t scale below this</div>
              </div>
              <div className="text-2xl font-black text-amber-300">{bp.performance_benchmarks.break_even_roas}</div>
            </div>
          )}
        </div>

        </>)}
        {mode === 'execution' && (
          <div className="px-4 pt-4 pb-8">
            <p className="text-[#606080] text-xs mb-4 flex items-center gap-1.5">
              <span>⚡</span>
              Follow steps in order to set up your campaign in Meta Ads Manager. Your progress is saved automatically.
            </p>
            <ExecutionMode
              blueprint={campaign.blueprint as any}
              campaignName={campaign.campaign_name || bp.campaign_name}
              campaignId={campaign.id}
            />
          </div>
        )}

      </div>
    </div>
  );
}

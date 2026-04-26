'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileDown, ArrowLeft, Copy, Check, TrendingUp, Target, DollarSign, Users,
  Layers, MessageSquare, Palette, CheckSquare, BarChart3, Sparkles, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Blueprint {
  campaign_name: string;
  executive_summary: string;
  campaign_objective: { recommended: string; reason: string };
  funnel_strategy: { stage: string; approach: string; cold_warm_split: string };
  budget_strategy: { recommended_daily_budget_inr: string; split: { awareness: string; consideration: string; conversion: string }; scaling_logic: string };
  targeting: { primary_audience: { age_range: string; gender: string; locations: string[]; interests: string[]; behaviors: string[] }; lookalike_strategy: string; retargeting_strategy: string; audience_exclusions: string[] };
  ad_sets: Array<{ ad_set_name: string; audience_type: string; objective: string; budget_allocation: string; targeting_focus: string }>;
  ad_angles: Array<{ angle_type: string; angle_name: string; core_message: string; why_it_works: string }>;
  ad_copies: Array<{ angle: string; primary_text: string; headline: string; sub_headline: string; cta: string; placement: string }>;
  creative_direction: { visual_style: string; color_palette: string; content_formats: string[]; hooks: string[]; do: string[]; dont: string[] };
  launch_checklist: string[];
  performance_benchmarks: { expected_ctr: string; expected_cpc_inr: string; expected_cpm_inr: string; roas_target: string };
}

const NAV_SECTIONS = [
  { id: 'summary', label: 'Executive Summary', icon: BookOpen },
  { id: 'objective', label: 'Campaign Objective', icon: Target },
  { id: 'funnel', label: 'Funnel Strategy', icon: TrendingUp },
  { id: 'budget', label: 'Budget Strategy', icon: DollarSign },
  { id: 'targeting', label: 'Targeting', icon: Users },
  { id: 'adsets', label: 'Ad Sets', icon: Layers },
  { id: 'angles', label: 'Ad Angles', icon: Sparkles },
  { id: 'copies', label: 'Ad Copies', icon: MessageSquare },
  { id: 'creative', label: 'Creative Direction', icon: Palette },
  { id: 'checklist', label: 'Launch Checklist', icon: CheckSquare },
  { id: 'benchmarks', label: 'Performance', icon: BarChart3 },
];

const AUDIENCE_COLORS: Record<string, string> = {
  cold: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  warm: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  hot: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const ANGLE_COLORS: Record<string, string> = {
  pain: 'bg-red-500/10 text-red-400 border-red-500/30',
  desire: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  trust: 'bg-green-500/10 text-green-400 border-green-500/30',
  curiosity: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  social_proof: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 transition-all text-text-muted hover:text-white" title="Copy">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function SectionCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="glass-card p-8 mb-6"
    >
      <h2 className="text-lg font-black gradient-text mb-6 pb-4 border-b border-border-color">{title}</h2>
      {children}
    </motion.div>
  );
}

export default function CampaignViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<{ id: string; campaign_name: string; created_at: string; blueprint: Blueprint } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('summary');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const savedChecks = localStorage.getItem(`checklist-${id}`);
    if (savedChecks) setCheckedItems(JSON.parse(savedChecks));
  }, [id]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await api.get(`/api/campaigns/${id}`);
        setCampaign(data.data.campaign);
      } catch {
        toast.error('Campaign not found.');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, router]);

  const toggleCheck = (i: number) => {
    const next = { ...checkedItems, [i]: !checkedItems[i] };
    setCheckedItems(next);
    localStorage.setItem(`checklist-${id}`, JSON.stringify(next));
  };

  const handleExport = async () => {
    if (user?.plan === 'free') {
      toast.error('PDF export is available on Pro and Ultra plans.');
      return;
    }
    setExporting(true);
    try {
      const response = await api.get(`/api/campaigns/${id}/export`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimeta-blueprint-${id}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Blueprint exported!');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading blueprint...</p>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const bp = campaign.blueprint;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{bp.campaign_name}</h1>
            <p className="text-xs text-text-muted">
              Generated {new Date(campaign.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleExport}
          disabled={exporting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            user?.plan === 'free'
              ? 'bg-white/5 border border-border-color text-text-muted cursor-not-allowed'
              : 'btn-gradient'
          }`}
        >
          <FileDown size={15} />
          {exporting ? 'Exporting...' : user?.plan === 'free' ? 'Export (Pro)' : 'Export Blueprint'}
        </motion.button>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar nav */}
        <div className="hidden xl:block w-52 flex-shrink-0">
          <div className="sticky top-24 glass-card p-3 space-y-1">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                  activeSection === s.id
                    ? 'bg-primary/15 text-white border border-primary/30'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <s.icon size={13} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Executive Summary */}
          <SectionCard id="summary" title="Executive Summary">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
              <p className="text-text-secondary leading-relaxed">{bp.executive_summary}</p>
            </div>
          </SectionCard>

          {/* Campaign Objective */}
          <SectionCard id="objective" title="Campaign Objective">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Recommended</div>
                <div className="text-lg font-bold gradient-text">{bp.campaign_objective?.recommended}</div>
              </div>
              <div className="bg-bg-dark rounded-xl p-5 border border-border-color">
                <div className="text-xs text-text-muted mb-2 uppercase tracking-wide">Why This Objective</div>
                <div className="text-sm text-text-secondary leading-relaxed">{bp.campaign_objective?.reason}</div>
              </div>
            </div>
          </SectionCard>

          {/* Funnel Strategy */}
          <SectionCard id="funnel" title="Funnel Strategy">
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {['TOFU', 'MOFU', 'BOFU'].map((stage, i) => (
                <div key={stage} className={`flex-1 rounded-xl p-4 border text-center ${
                  i === 0 ? 'bg-blue-500/10 border-blue-500/30' :
                  i === 1 ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="text-xs font-bold text-white mb-1">{stage}</div>
                  <div className={`text-xs ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-orange-400' : 'text-red-400'}`}>
                    {i === 0 ? 'Awareness' : i === 1 ? 'Consideration' : 'Conversion'}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Stage</div>
                <div className="text-sm font-semibold text-white">{bp.funnel_strategy?.stage}</div>
              </div>
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Cold / Warm Split</div>
                <div className="text-sm font-semibold text-white">{bp.funnel_strategy?.cold_warm_split}</div>
              </div>
              <div className="sm:col-span-1 bg-bg-dark rounded-xl p-4 border border-border-color col-span-full">
                <div className="text-xs text-text-muted mb-2">Approach</div>
                <div className="text-sm text-text-secondary leading-relaxed">{bp.funnel_strategy?.approach}</div>
              </div>
            </div>
          </SectionCard>

          {/* Budget Strategy */}
          <SectionCard id="budget" title="Budget Strategy">
            <div className="text-center mb-6 p-6 bg-bg-dark rounded-xl border border-border-color">
              <div className="text-xs text-text-muted mb-2">Recommended Daily Budget</div>
              <div className="text-4xl font-black gradient-text">₹{bp.budget_strategy?.recommended_daily_budget_inr}</div>
              <div className="text-xs text-text-muted mt-1">per day</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Awareness', val: bp.budget_strategy?.split?.awareness, color: '#7B2FBE' },
                { label: 'Consideration', val: bp.budget_strategy?.split?.consideration, color: '#9B3FDE' },
                { label: 'Conversion', val: bp.budget_strategy?.split?.conversion, color: '#C026D3' },
              ].map((item) => (
                <div key={item.label} className="bg-bg-dark rounded-xl p-4 border border-border-color text-center">
                  <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.val}</div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
              <div className="text-xs text-text-muted mb-2">Scaling Logic</div>
              <p className="text-sm text-text-secondary leading-relaxed">{bp.budget_strategy?.scaling_logic}</p>
            </div>
          </SectionCard>

          {/* Targeting */}
          <SectionCard id="targeting" title="Audience Targeting">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Age Range</div>
                <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.age_range}</div>
              </div>
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Gender</div>
                <div className="text-sm font-semibold text-white">{bp.targeting?.primary_audience?.gender}</div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Locations', items: bp.targeting?.primary_audience?.locations },
                { label: 'Interests', items: bp.targeting?.primary_audience?.interests },
                { label: 'Behaviors', items: bp.targeting?.primary_audience?.behaviors },
                { label: 'Audience Exclusions', items: bp.targeting?.audience_exclusions },
              ].map((group) => (
                <div key={group.label} className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-3">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {(group.items || []).map((item: string) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2">Lookalike Strategy</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.targeting?.lookalike_strategy}</p>
                </div>
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted mb-2">Retargeting Strategy</div>
                  <p className="text-sm text-text-secondary leading-relaxed">{bp.targeting?.retargeting_strategy}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Ad Sets */}
          <SectionCard id="adsets" title="Ad Sets">
            <div className="space-y-4">
              {(bp.ad_sets || []).map((set, i) => (
                <div key={i} className="bg-bg-dark rounded-xl p-5 border border-border-color">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-white">{set.ad_set_name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${AUDIENCE_COLORS[set.audience_type] || ''}`}>
                      {set.audience_type?.toUpperCase()}
                    </span>
                    <span className="ml-auto text-sm font-bold gradient-text">{set.budget_allocation}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-text-muted mb-1">Objective</div>
                      <div className="text-sm text-text-secondary">{set.objective}</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted mb-1">Targeting Focus</div>
                      <div className="text-sm text-text-secondary">{set.targeting_focus}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Ad Angles */}
          <SectionCard id="angles" title="Ad Angles">
            <div className="grid sm:grid-cols-2 gap-4">
              {(bp.ad_angles || []).map((angle, i) => (
                <div key={i} className="bg-bg-dark rounded-xl p-5 border border-border-color">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ANGLE_COLORS[angle.angle_type] || ''}`}>
                      {angle.angle_type?.toUpperCase()}
                    </span>
                    <span className="font-semibold text-white text-sm">{angle.angle_name}</span>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-text-muted mb-1">Core Message</div>
                    <div className="text-sm text-text-secondary italic">&quot;{angle.core_message}&quot;</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted mb-1">Why It Works</div>
                    <div className="text-sm text-text-secondary">{angle.why_it_works}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Ad Copies */}
          <SectionCard id="copies" title="Ad Copies">
            <div className="space-y-5">
              {(bp.ad_copies || []).map((copy, i) => (
                <div key={i} className="bg-bg-dark rounded-xl border border-border-color overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border-color bg-white/2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-accent border border-primary/30">
                      {copy.placement}
                    </span>
                    <span className="text-xs text-text-muted">{copy.angle}</span>
                    <div className="ml-auto">
                      <CopyButton text={`Headline: ${copy.headline}\n\nPrimary Text:\n${copy.primary_text}\n\nSub-headline: ${copy.sub_headline}\n\nCTA: ${copy.cta}`} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xl font-bold text-white mb-2">{copy.headline}</div>
                    <div className="text-sm text-text-muted mb-3">{copy.sub_headline}</div>
                    <div className="text-sm text-text-secondary leading-relaxed mb-4 p-4 bg-bg-card rounded-xl border border-border-color">
                      {copy.primary_text}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/30">
                      CTA: {copy.cta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Creative Direction */}
          <SectionCard id="creative" title="Creative Direction">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Visual Style</div>
                <div className="text-sm text-white">{bp.creative_direction?.visual_style}</div>
              </div>
              <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                <div className="text-xs text-text-muted mb-2">Color Palette</div>
                <div className="text-sm text-white">{bp.creative_direction?.color_palette}</div>
              </div>
            </div>
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-4">
              <div className="text-xs text-text-muted mb-3">Content Formats</div>
              <div className="flex flex-wrap gap-2">
                {(bp.creative_direction?.content_formats || []).map((f: string) => (
                  <span key={f} className="tag">{f}</span>
                ))}
              </div>
            </div>
            <div className="bg-bg-dark rounded-xl p-4 border border-border-color mb-4">
              <div className="text-xs text-text-muted mb-3">Scroll-Stopping Hooks</div>
              <div className="space-y-2">
                {(bp.creative_direction?.hooks || []).map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div className="text-sm text-text-secondary italic">&quot;{h}&quot;</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                <div className="text-xs text-green-400 font-semibold mb-3 uppercase tracking-wide">DO ✓</div>
                <div className="space-y-2">
                  {(bp.creative_direction?.do || []).map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-400 flex-shrink-0">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                <div className="text-xs text-red-400 font-semibold mb-3 uppercase tracking-wide">DON&apos;T ✗</div>
                <div className="space-y-2">
                  {(bp.creative_direction?.dont || []).map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-red-400 flex-shrink-0">✗</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Launch Checklist */}
          <SectionCard id="checklist" title="Launch Checklist">
            <div className="space-y-3">
              {(bp.launch_checklist || []).map((item: string, i: number) => (
                <motion.div
                  key={i}
                  onClick={() => toggleCheck(i)}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    checkedItems[i]
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-bg-dark border-border-color hover:border-primary/40'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all border ${
                    checkedItems[i] ? 'bg-green-500 border-green-500' : 'border-border-color bg-bg-dark'
                  }`}>
                    {checkedItems[i] && <Check size={13} className="text-white" />}
                  </div>
                  <span className={`text-sm leading-relaxed ${checkedItems[i] ? 'text-text-muted line-through' : 'text-text-secondary'}`}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-xs text-text-muted">
              {Object.values(checkedItems).filter(Boolean).length} of {bp.launch_checklist?.length || 0} items completed
            </div>
          </SectionCard>

          {/* Performance Benchmarks */}
          <SectionCard id="benchmarks" title="Performance Benchmarks">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Expected CTR', val: bp.performance_benchmarks?.expected_ctr },
                { label: 'Expected CPC', val: `₹${bp.performance_benchmarks?.expected_cpc_inr}` },
                { label: 'Expected CPM', val: `₹${bp.performance_benchmarks?.expected_cpm_inr}` },
                { label: 'ROAS Target', val: bp.performance_benchmarks?.roas_target },
              ].map((m) => (
                <div key={m.label} className="bg-bg-dark rounded-xl p-5 border border-border-color text-center">
                  <div className="text-2xl font-black gradient-text mb-2">{m.val}</div>
                  <div className="text-xs text-text-muted">{m.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

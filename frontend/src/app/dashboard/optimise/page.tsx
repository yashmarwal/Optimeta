'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Campaign {
  id: string;
  campaignName: string;
  createdAt: string;
  businessName?: string;
}

interface OptimisationInputs {
  runningDuration: string;
  mainProblems: string[];
  currentCPR: string;
  gettingResults: string;
  currentBudget: string;
  newCreatives: string;
  businessChanges: string[];
}

const PROBLEMS = [
  'Too expensive (high cost per result)',
  'Not reaching enough people',
  'People click but don\'t buy',
  'Wrong type of people seeing my ad',
  'Ad got rejected or disabled',
  'Results were good but dropped suddenly',
  'Never got results from day 1',
  'Want to scale what\'s working',
];

const BUSINESS_CHANGES = [
  'New product/offer launched',
  'Price changed',
  'New discount or sale',
  'Expanded to new cities',
  'Got customer reviews/testimonials',
  'Nothing changed',
];

const BUDGET_OPTIONS = [
  'Under ₹5k',
  '₹5k–₹15k',
  '₹15k–₹30k',
  '₹30k–₹75k',
  '₹75k–₹1.5L',
  'Above ₹1.5L',
  'Same as before',
];

const loadingMessages = [
  'Diagnosing your campaign performance...',
  'Analysing what went wrong...',
  'Identifying what to keep...',
  'Building fresh angles...',
  'Crafting optimised ad copies...',
  'Restructuring your campaign...',
  'Finalising your optimised blueprint...',
];

export default function OptimisePage() {
  const [step, setStep] = useState(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const router = useRouter();

  const [inputs, setInputs] = useState<OptimisationInputs>({
    runningDuration: '',
    mainProblems: [],
    currentCPR: '',
    gettingResults: '',
    currentBudget: '',
    newCreatives: '',
    businessChanges: [],
  });

  useEffect(() => {
    api.get('/api/campaigns')
      .then(res => {
        const list = res.data.data.campaigns.map((c: { id: string; campaignName: string; createdAt: string; business_inputs?: { businessName?: string } }) => ({
          id: c.id,
          campaignName: c.campaignName,
          createdAt: c.createdAt,
          businessName: c.business_inputs?.businessName,
        }));
        setCampaigns(list);
      })
      .catch(() => toast.error('Failed to load campaigns.'))
      .finally(() => setLoadingCampaigns(false));
  }, []);

  const toggleMulti = (field: 'mainProblems' | 'businessChanges', value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleGenerate = async () => {
    if (!selectedCampaign) return;
    setGenerating(true);
    setProgressWidth(0);

    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(msgIdx);
    }, 2200);

    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += Math.random() * 6;
      if (progress > 90) progress = 90;
      setProgressWidth(progress);
    }, 400);

    try {
      const response = await api.post('/api/campaigns/optimise', {
        campaignId: selectedCampaign.id,
        optimisationInputs: inputs,
      });
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      setProgressWidth(100);
      setTimeout(() => {
        router.push(`/dashboard/campaigns/${response.data.data.id}`);
      }, 600);
    } catch (err: unknown) {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      setGenerating(false);
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || 'Optimisation failed. Please try again.');
    }
  };

  const canProceedStep2 = inputs.runningDuration && inputs.mainProblems.length > 0 && inputs.gettingResults && inputs.currentBudget && inputs.newCreatives;

  if (generating) {
    return (
      <div className="fixed inset-0 bg-bg-dark z-50 flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 30px rgba(123,47,190,0.35)', '0 0 60px rgba(192,38,211,0.5)', '0 0 30px rgba(123,47,190,0.35)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8"
          >
            <TrendingUp size={36} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-2">Optimising Your Campaign</h2>
          <p className="text-text-muted text-sm mb-10 text-center">Claude AI is diagnosing and rebuilding your campaign blueprint</p>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div className="h-full progress-bar" style={{ width: `${progressWidth}%` }} transition={{ duration: 0.3 }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm text-text-secondary text-center"
            >
              {loadingMessages[loadingMsg]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          {[
            { id: 1, label: 'Select Campaign', icon: Search },
            { id: 2, label: 'Tell Us What Happened', icon: TrendingUp },
            { id: 3, label: 'Review & Generate', icon: Sparkles },
          ].map((s, i, arr) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  step > s.id ? 'bg-gradient-to-br from-primary to-accent' :
                  step === s.id ? 'bg-gradient-to-br from-primary to-accent glow' :
                  'bg-bg-card border border-border-color'
                }`}>
                  {step > s.id
                    ? <CheckCircle size={18} className="text-white" />
                    : <s.icon size={16} className={step >= s.id ? 'text-white' : 'text-text-muted'} />
                  }
                </div>
                <span className={`text-xs mt-2 hidden sm:block font-medium ${step >= s.id ? 'text-white' : 'text-text-muted'}`}>{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all duration-500 ${step > s.id ? 'bg-primary' : 'bg-border-color'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-8"
        >
          {/* STEP 1 — Select Campaign */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Which campaign do you want to optimise?</h2>
                <p className="text-text-muted text-sm">Select a campaign you&apos;ve already generated.</p>
              </div>
              {loadingCampaigns ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-shimmer h-20 rounded-xl" />
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted text-sm mb-4">You don&apos;t have any campaigns yet.</p>
                  <button onClick={() => router.push('/dashboard/new')} className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold">
                    Create Your First Campaign →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map(campaign => (
                    <motion.div
                      key={campaign.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCampaign(campaign)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCampaign?.id === campaign.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border-color bg-bg-dark hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{campaign.campaignName}</div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {new Date(campaign.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        {selectedCampaign?.id === campaign.id && (
                          <CheckCircle size={18} className="text-accent flex-shrink-0 ml-3" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Optimisation Questions */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Tell us what&apos;s happening</h2>
                <p className="text-text-muted text-sm">Answer these simple questions so we can fix the right things.</p>
              </div>

              {/* Q1 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  How long has your campaign been running? <span className="text-accent">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Less than 7 days (too early to judge)',
                    '1–2 weeks',
                    '2–4 weeks',
                    'More than a month',
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInputs(p => ({ ...p, runningDuration: opt }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        inputs.runningDuration === opt
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  What&apos;s the main problem you&apos;re facing? <span className="text-accent">*</span>
                </label>
                <p className="text-xs text-text-muted mb-3">Select all that apply</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {PROBLEMS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMulti('mainProblems', opt)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        inputs.mainProblems.includes(opt)
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  What are your current results?
                  <span className="text-text-muted font-normal ml-1 text-xs">— optional, it&apos;s okay if you don&apos;t know</span>
                </label>
                <input
                  className="input-field w-full px-4 py-3 text-sm mb-3"
                  value={inputs.currentCPR}
                  onChange={e => setInputs(p => ({ ...p, currentCPR: e.target.value }))}
                  placeholder="e.g. ₹150 per lead or leave blank if unsure"
                />
                <div className="grid grid-cols-3 gap-2">
                  {['Yes, getting some results', 'Very few results', 'None at all'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInputs(p => ({ ...p, gettingResults: opt }))}
                      className={`px-3 py-3 rounded-xl text-xs font-medium text-center transition-all border ${
                        inputs.gettingResults === opt
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  What is your budget now? <span className="text-accent">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInputs(p => ({ ...p, currentBudget: opt }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        inputs.currentBudget === opt
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Do you have new creatives (photos/videos) to test? <span className="text-accent">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    'Yes, I have new creatives ready',
                    'No, same creatives as before',
                    'I can create new ones in a week',
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInputs(p => ({ ...p, newCreatives: opt }))}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        inputs.newCreatives === opt
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q6 */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Has anything changed in your business since the last campaign?
                </label>
                <p className="text-xs text-text-muted mb-3">Select all that apply</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {BUSINESS_CHANGES.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMulti('businessChanges', opt)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                        inputs.businessChanges.includes(opt)
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Generate */}
          {step === 3 && selectedCampaign && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">Review & Generate</h2>
                <p className="text-text-muted text-sm">Confirm your details, then let Optimeta rebuild your campaign.</p>
              </div>

              <div className="space-y-3">
                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2">Campaign to Optimise</div>
                  <div className="text-sm font-semibold text-white">{selectedCampaign.campaignName}</div>
                </div>

                <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                  <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2">Running Duration</div>
                  <div className="text-sm text-white">{inputs.runningDuration}</div>
                </div>

                {inputs.mainProblems.length > 0 && (
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2">Problems to Fix</div>
                    <div className="flex flex-wrap gap-2">
                      {inputs.mainProblems.map(p => (
                        <span key={p} className="tag text-xs">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Current Results</div>
                    <div className="text-sm text-white">{inputs.gettingResults || '—'}</div>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Budget</div>
                    <div className="text-sm text-white">{inputs.currentBudget}</div>
                  </div>
                </div>

                {inputs.currentCPR && (
                  <div className="bg-bg-dark rounded-xl p-4 border border-border-color">
                    <div className="text-xs text-text-muted mb-1">Current Cost Per Result</div>
                    <div className="text-sm text-white">{inputs.currentCPR}</div>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                <TrendingUp size={18} className="text-accent flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white">Ready to optimise</div>
                  <div className="text-xs text-text-muted">Claude AI will diagnose and rebuild your blueprint in 20–35 seconds</div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                className="btn-gradient w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 glow"
              >
                <TrendingUp size={20} />
                Generate Optimised Blueprint →
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step === 1) router.push('/dashboard/new');
            else setStep(s => s - 1);
          }}
          className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <ArrowLeft size={15} /> Back
        </motion.button>

        {step < 3 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (step === 1 && !selectedCampaign) {
                toast.error('Please select a campaign to optimise.');
                return;
              }
              if (step === 2 && !canProceedStep2) {
                toast.error('Please answer all required questions.');
                return;
              }
              setStep(s => s + 1);
            }}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            Next Step <ArrowRight size={15} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

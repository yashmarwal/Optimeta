'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, Building2, Package, Target, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface BusinessInputs {
  // Step 1 — Business
  businessName: string;
  industry: string;
  customIndustry: string;
  businessDescription: string;
  websiteUrl: string;
  monthlyAdBudget: string;
  // Step 2 — Product
  productName: string;
  price: string;
  keyBenefit1: string;
  keyBenefit2: string;
  keyBenefit3: string;
  usp: string;
  currentOffer: string;
  codAvailable: boolean;
  // Step 3 — Audience
  targetAudience: string;
  campaignGoal: string;
  targetLocations: string;
  genderTargeting: string;
  ageGroup: string;
  competitors: string;
  availableAssets: string[];
  pixelStatus: string;
  hasMetaExperience: boolean;
  biggestChallenge: string;
}

const STEPS = [
  { id: 1, label: 'Business Info', icon: Building2 },
  { id: 2, label: 'Product & Offer', icon: Package },
  { id: 3, label: 'Audience & Goals', icon: Target },
  { id: 4, label: 'Review & Generate', icon: Eye },
];

const loadingMessages = [
  'Analyzing your business model...',
  'Studying India market dynamics...',
  'Identifying your ideal audience...',
  'Building targeting clusters...',
  'Crafting your ad angles...',
  'Writing high-converting copy...',
  'Architecting your campaign structure...',
  'Calibrating budget allocation...',
  'Finalizing your blueprint...',
];

const ASSET_OPTIONS = ['Product photos', 'Short videos', 'Customer testimonials', 'UGC content', 'Brand story video', 'None yet'];

export default function NewCampaignPage() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const router = useRouter();

  const [inputs, setInputs] = useState<BusinessInputs>({
    businessName: '', industry: '', customIndustry: '', businessDescription: '', websiteUrl: '', monthlyAdBudget: '',
    productName: '', price: '', keyBenefit1: '', keyBenefit2: '', keyBenefit3: '',
    usp: '', currentOffer: '', codAvailable: false,
    targetAudience: '', campaignGoal: '', targetLocations: '',
    genderTargeting: 'All', ageGroup: '18-45', competitors: '',
    availableAssets: [], pixelStatus: 'Not installed', hasMetaExperience: false, biggestChallenge: '',
  });

  const update = (field: keyof BusinessInputs, value: string | boolean | string[]) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  const toggleAsset = (asset: string) => {
    setInputs((prev) => ({
      ...prev,
      availableAssets: prev.availableAssets.includes(asset)
        ? prev.availableAssets.filter((a) => a !== asset)
        : [...prev.availableAssets, asset],
    }));
  };

  const executeGeneration = async (data: Record<string, unknown>) => {
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
      const response = await api.post('/api/campaigns/generate', data);
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      setProgressWidth(100);
      localStorage.removeItem('generation_in_progress');
      localStorage.removeItem('generation_inputs');
      setTimeout(() => {
        router.push(`/dashboard/campaigns/${response.data.data.id}`);
      }, 600);
    } catch (err: unknown) {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      setGenerating(false);
      localStorage.removeItem('generation_in_progress');
      localStorage.removeItem('generation_inputs');
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || 'Generation failed. Please try again.');
    }
  };

  const handleGenerate = async () => {
    const cleanFormData = {
      businessName: inputs.businessName || '',
      industry: inputs.industry || '',
      customIndustry: inputs.customIndustry || '',
      businessDescription: inputs.businessDescription || '',
      websiteUrl: inputs.websiteUrl || '',
      monthlyBudget: inputs.monthlyAdBudget || '',
      productName: inputs.productName || '',
      pricePoint: inputs.price || '',
      benefit1: inputs.keyBenefit1 || '',
      benefit2: inputs.keyBenefit2 || '',
      benefit3: inputs.keyBenefit3 || '',
      usp: inputs.usp || '',
      currentOffer: inputs.currentOffer || '',
      codAvailable: inputs.codAvailable || false,
      idealCustomer: inputs.targetAudience || '',
      campaignGoal: inputs.campaignGoal || '',
      targetLocations: inputs.targetLocations || '',
      genderTargeting: inputs.genderTargeting || '',
      ageGroup: inputs.ageGroup || '',
      competitors: inputs.competitors || '',
      adsExperience: inputs.hasMetaExperience ? 'Has run Meta ads before' : 'New to Meta ads',
      previousChallenge: inputs.biggestChallenge || '',
      availableAssets: Array.isArray(inputs.availableAssets) ? inputs.availableAssets : [],
      pixelStatus: inputs.pixelStatus || '',
    };

    try {
      localStorage.setItem('generation_in_progress', 'true');
      localStorage.setItem('generation_inputs', JSON.stringify(cleanFormData));
    } catch (e) {
      console.error('localStorage error:', e);
    }

    await executeGeneration(cleanFormData);
  };

  // On mount: resume generation if tab was switched during an active request
  useEffect(() => {
    const inProgress = localStorage.getItem('generation_in_progress');
    if (!inProgress) return;
    const stored = localStorage.getItem('generation_inputs');
    if (!stored) {
      localStorage.removeItem('generation_in_progress');
      return;
    }
    try {
      const storedData = JSON.parse(stored);
      executeGeneration(storedData);
    } catch {
      localStorage.removeItem('generation_in_progress');
      localStorage.removeItem('generation_inputs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Sparkles size={36} className="text-white" />
          </motion.div>

          <h2 className="text-2xl font-black text-white mb-2">Architecting Your Campaign</h2>
          <p className="text-text-muted text-sm mb-10 text-center">Claude AI is building your complete Meta ad blueprint</p>

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
      {/* Step progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
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
              {i < STEPS.length - 1 && (
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
          {step === 1 && <Step1 inputs={inputs} update={update} />}
          {step === 2 && <Step2 inputs={inputs} update={update} />}
          {step === 3 && <Step3 inputs={inputs} update={update} toggleAsset={toggleAsset} />}
          {step === 4 && <Step4 inputs={inputs} onGenerate={handleGenerate} />}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep((s) => s - 1)} className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ArrowLeft size={15} /> Back
          </motion.button>
        ) : <div />}

        {step < 4 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { if (!validateStep(step, inputs)) return; setStep((s) => s + 1); }}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            Next Step <ArrowRight size={15} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

function validateStep(step: number, inputs: BusinessInputs): boolean {
  if (step === 1 && (!inputs.businessName || !inputs.industry || !inputs.businessDescription || !inputs.monthlyAdBudget)) {
    toast.error('Please fill in all required fields.'); return false;
  }
  if (step === 1 && inputs.industry === 'Other' && !inputs.customIndustry.trim()) {
    toast.error('Please describe your industry / business type.'); return false;
  }
  if (step === 2 && (!inputs.productName || !inputs.price || !inputs.keyBenefit1 || !inputs.keyBenefit2 || !inputs.keyBenefit3 || !inputs.usp)) {
    toast.error('Please fill in all required fields.'); return false;
  }
  if (step === 3 && (!inputs.targetAudience || !inputs.campaignGoal || !inputs.targetLocations || !inputs.biggestChallenge)) {
    toast.error('Please fill in all required fields.'); return false;
  }
  return true;
}

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label} {required && <span className="text-accent">*</span>}
        {hint && <span className="text-text-muted font-normal ml-1 text-xs">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Step1({ inputs, update }: { inputs: BusinessInputs; update: (f: keyof BusinessInputs, v: string | boolean | string[]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Business Information</h2>
        <p className="text-text-muted text-sm">Tell us about your business so we can build the right strategy.</p>
      </div>
      <FormField label="Business Name" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.businessName} onChange={(e) => update('businessName', e.target.value)} placeholder="e.g. Zura Skincare" />
      </FormField>
      <FormField label="Industry" required>
        <select className="input-field w-full px-4 py-3 text-sm" value={inputs.industry} onChange={(e) => update('industry', e.target.value)}>
          <option value="">Select your industry</option>
          {['D2C Product', 'Fashion & Apparel', 'Beauty & Skincare', 'Jewellery', 'Health & Wellness', 'Food & Beverage', 'SaaS', 'Coaching & Education', 'Local Service', 'Agency', 'Dropshipping', 'Other'].map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </FormField>
      {inputs.industry === 'Other' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <FormField label="Describe your industry / business type" required>
            <input
              className="input-field w-full px-4 py-3 text-sm"
              value={inputs.customIndustry}
              onChange={(e) => update('customIndustry', e.target.value)}
              placeholder="e.g. Pet care products, Wedding photography, Online tutoring..."
              autoFocus
            />
          </FormField>
        </motion.div>
      )}
      <FormField label="Business Description" required>
        <textarea className="input-field w-full px-4 py-3 text-sm h-28 resize-none" value={inputs.businessDescription} onChange={(e) => update('businessDescription', e.target.value)} placeholder="Describe your business, what you sell, who you serve, and what makes you unique..." />
      </FormField>
      <FormField label="Website or Instagram URL" hint="optional">
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} placeholder="https://yourstore.com or @yourhandle" />
      </FormField>
      <FormField label="Monthly Ad Budget" required>
        <select className="input-field w-full px-4 py-3 text-sm" value={inputs.monthlyAdBudget} onChange={(e) => update('monthlyAdBudget', e.target.value)}>
          <option value="">Select your budget range</option>
          {['Under ₹5k', '₹5k–₹15k', '₹15k–₹30k', '₹30k–₹75k', '₹75k–₹1.5L', 'Above ₹1.5L'].map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </FormField>
    </div>
  );
}

function Step2({ inputs, update }: { inputs: BusinessInputs; update: (f: keyof BusinessInputs, v: string | boolean | string[]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Product & Offer</h2>
        <p className="text-text-muted text-sm">Details about what you&apos;re selling and why people should buy it.</p>
      </div>
      <FormField label="Product / Service Name" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.productName} onChange={(e) => update('productName', e.target.value)} placeholder="e.g. Vitamin C Brightening Serum" />
      </FormField>
      <FormField label="Price (₹)" required>
        <input type="number" className="input-field w-full px-4 py-3 text-sm" value={inputs.price} onChange={(e) => update('price', e.target.value)} placeholder="e.g. 999" />
      </FormField>
      <FormField label="Key Benefit 1" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.keyBenefit1} onChange={(e) => update('keyBenefit1', e.target.value)} placeholder="e.g. Brightens skin in 7 days" />
      </FormField>
      <FormField label="Key Benefit 2" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.keyBenefit2} onChange={(e) => update('keyBenefit2', e.target.value)} placeholder="e.g. 100% natural ingredients" />
      </FormField>
      <FormField label="Key Benefit 3" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.keyBenefit3} onChange={(e) => update('keyBenefit3', e.target.value)} placeholder="e.g. Dermatologist tested, fragrance free" />
      </FormField>
      <FormField label="Unique Selling Proposition" required>
        <textarea className="input-field w-full px-4 py-3 text-sm h-24 resize-none" value={inputs.usp} onChange={(e) => update('usp', e.target.value)} placeholder="What makes you different from every competitor? Be specific..." />
      </FormField>
      <FormField label="Current Offer / Discount" hint="optional">
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.currentOffer} onChange={(e) => update('currentOffer', e.target.value)} placeholder="e.g. 30% off for first 100 orders, free shipping above ₹999" />
      </FormField>
      <FormField label="Cash on Delivery Available?" hint="affects targeting cities and ad copy">
        <div className="flex gap-3 mt-1">
          {[true, false].map((val) => (
            <button key={String(val)} type="button" onClick={() => update('codAvailable', val)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                inputs.codAvailable === val ? 'bg-primary/20 border-primary text-white' : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
              }`}>
              {val ? 'Yes, COD available' : 'No, prepaid only'}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
}

function Step3({ inputs, update, toggleAsset }: {
  inputs: BusinessInputs;
  update: (f: keyof BusinessInputs, v: string | boolean | string[]) => void;
  toggleAsset: (a: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Audience & Goals</h2>
        <p className="text-text-muted text-sm">Who are your customers and what do you want to achieve?</p>
      </div>
      <FormField label="Ideal Customer Description" required>
        <textarea className="input-field w-full px-4 py-3 text-sm h-28 resize-none" value={inputs.targetAudience} onChange={(e) => update('targetAudience', e.target.value)} placeholder="Describe your ideal customer — age, gender, income, interests, pain points, lifestyle..." />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Gender Targeting" required>
          <select className="input-field w-full px-4 py-3 text-sm" value={inputs.genderTargeting} onChange={(e) => update('genderTargeting', e.target.value)}>
            {['All', 'Women only', 'Men only', 'Primarily women', 'Primarily men'].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>
        <FormField label="Age Group" required>
          <select className="input-field w-full px-4 py-3 text-sm" value={inputs.ageGroup} onChange={(e) => update('ageGroup', e.target.value)}>
            {['13-17', '18-24', '25-34', '18-35', '25-45', '30-50', '35-55', '45-65', '18-65 (broad)'].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Campaign Goal" required>
        <select className="input-field w-full px-4 py-3 text-sm" value={inputs.campaignGoal} onChange={(e) => update('campaignGoal', e.target.value)}>
          <option value="">Select campaign goal</option>
          {['Sales / Purchases', 'Lead Generation', 'Brand Awareness', 'Website Traffic', 'App Installs', 'WhatsApp Messages'].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </FormField>
      <FormField label="Target Cities / States" required>
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.targetLocations} onChange={(e) => update('targetLocations', e.target.value)} placeholder="e.g. Mumbai, Delhi, Bangalore — or All India — or Tier 2 cities" />
      </FormField>
      <FormField label="Meta Pixel Status" hint="critical for strategy">
        <select className="input-field w-full px-4 py-3 text-sm" value={inputs.pixelStatus} onChange={(e) => update('pixelStatus', e.target.value)}>
          {['Not installed', 'Installed but no data yet', 'Installed with Purchase events', 'Installed with Lead events', 'Not sure'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </FormField>
      <FormField label="Main Competitors" hint="optional but improves targeting">
        <input className="input-field w-full px-4 py-3 text-sm" value={inputs.competitors} onChange={(e) => update('competitors', e.target.value)} placeholder="e.g. Mamaearth, Minimalist, The Ordinary" />
      </FormField>
      <FormField label="Available Creative Assets" hint="select all that apply">
        <div className="flex flex-wrap gap-2 mt-1">
          {ASSET_OPTIONS.map((asset) => (
            <button key={asset} type="button" onClick={() => toggleAsset(asset)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                inputs.availableAssets.includes(asset)
                  ? 'bg-primary/20 border-primary text-white'
                  : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
              }`}>
              {asset}
            </button>
          ))}
        </div>
      </FormField>
      <FormField label="Meta Ads Experience" hint="helps calibrate complexity">
        <div className="flex gap-3 mt-1">
          {[true, false].map((val) => (
            <button key={String(val)} type="button" onClick={() => update('hasMetaExperience', val)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                inputs.hasMetaExperience === val ? 'bg-primary/20 border-primary text-white' : 'bg-bg-dark border-border-color text-text-muted hover:border-primary/50'
              }`}>
              {val ? "Yes, I've run ads before" : "No, I'm new to Meta ads"}
            </button>
          ))}
        </div>
      </FormField>
      <FormField label="Biggest Challenge with Meta Ads" required>
        <textarea className="input-field w-full px-4 py-3 text-sm h-24 resize-none" value={inputs.biggestChallenge} onChange={(e) => update('biggestChallenge', e.target.value)} placeholder="e.g. low ROAS, don't know who to target, creatives not working, high CPMs..." />
      </FormField>
    </div>
  );
}

function Step4({ inputs, onGenerate }: { inputs: BusinessInputs; onGenerate: () => void }) {
  const sections = [
    { label: 'Business', fields: [{ key: 'Name', val: inputs.businessName }, { key: 'Industry', val: inputs.industry }, { key: 'Budget', val: inputs.monthlyAdBudget }] },
    { label: 'Product', fields: [{ key: 'Product', val: inputs.productName }, { key: 'Price', val: `₹${inputs.price}` }, { key: 'COD', val: inputs.codAvailable ? 'Yes' : 'No' }] },
    { label: 'Campaign', fields: [{ key: 'Goal', val: inputs.campaignGoal }, { key: 'Locations', val: inputs.targetLocations }, { key: 'Pixel', val: inputs.pixelStatus }] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Review & Generate</h2>
        <p className="text-text-muted text-sm">Confirm your inputs, then let Optimeta architect your campaign.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.label} className="bg-bg-dark rounded-xl p-4 border border-border-color">
            <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-3">{s.label}</div>
            <div className="space-y-2">
              {s.fields.map((f) => (
                <div key={f.key}>
                  <div className="text-xs text-text-muted">{f.key}</div>
                  <div className="text-sm text-white font-medium truncate">{f.val || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
        <Sparkles size={18} className="text-accent flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-white">Ready to generate</div>
          <div className="text-xs text-text-muted">Claude AI will architect your blueprint in 15–30 seconds</div>
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => onGenerate()} className="btn-gradient w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 glow">
        <Sparkles size={20} />
        Generate Campaign Blueprint →
      </motion.button>
    </div>
  );
}

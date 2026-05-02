'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Eye, LayoutGrid, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Campaign {
  id: string;
  campaignName: string;
  createdAt: string;
  industry: string;
  goal: string;
  executiveSummary: string;
}

interface UsageData {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  cycleEnd: string | null;
  percentUsed: number;
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, usageRes] = await Promise.all([
          api.get('/api/campaigns'),
          api.get('/api/usage'),
        ]);
        setCampaigns(campaignsRes.data.data.campaigns);
        setUsage(usageRes.data.data);
      } catch {
        toast.error('Failed to load campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewCampaign = () => {
    sessionStorage.setItem('fresh_campaign', 'true');
    router.push('/dashboard/new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success('Campaign deleted.');
    } catch {
      toast.error('Failed to delete campaign.');
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { label: 'Total Generated', value: campaigns.length, icon: LayoutGrid },
    { label: 'Campaigns Left', value: usage ? `${usage.remaining} / ${usage.limit}` : '—', icon: Sparkles },
    { label: 'Current Plan', value: user?.plan?.toUpperCase() || '—', icon: Calendar },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : '—', icon: Calendar },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="text-xs text-text-muted mb-2">{stat.label}</div>
            <div className="text-2xl font-black gradient-text">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Usage bar */}
      {usage && usage.plan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm font-semibold text-white">Campaign Usage</div>
              <div className="text-xs text-text-muted">{usage.used} of {usage.limit} used this billing cycle</div>
            </div>
            <div className="text-sm font-bold gradient-text">{usage.remaining} left</div>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usage.percentUsed}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full progress-bar"
            />
          </div>
        </motion.div>
      )}

      {/* Campaigns header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">My Campaigns</h2>
          <p className="text-sm text-text-muted">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} generated</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNewCampaign}
          className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} />
          New Campaign
        </motion.button>
      </div>

      {/* Campaign grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-4">
              <div className="space-y-2">
                <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton-shimmer h-5 w-20 rounded-full" />
                  <div className="skeleton-shimmer h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton-shimmer h-3 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-2/3 rounded" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="skeleton-shimmer h-3 w-20 rounded" />
                <div className="skeleton-shimmer h-7 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-card"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={36} className="text-accent" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No campaigns yet</h3>
          <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
            Generate your first AI-powered Meta campaign blueprint. It takes less than a minute.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNewCampaign}
            className="btn-gradient px-8 py-3 rounded-xl font-bold glow"
          >
            Generate Your First Campaign →
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-card p-6 gradient-border group transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1">
                    {campaign.campaignName || 'Unnamed Campaign'}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.industry && (
                      <span className="tag text-xs">{campaign.industry}</span>
                    )}
                    {campaign.goal && (
                      <span className="tag text-xs">{campaign.goal}</span>
                    )}
                  </div>
                </div>
              </div>

              {campaign.executiveSummary && (
                <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1 line-clamp-3">
                  {campaign.executiveSummary}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border-color">
                <span className="text-xs text-text-muted">
                  {new Date(campaign.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(campaign.id)}
                    disabled={deletingId === campaign.id}
                    className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-xs text-white hover:bg-primary/25 transition-all"
                    >
                      <Eye size={12} />
                      View
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

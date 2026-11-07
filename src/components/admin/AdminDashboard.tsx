import React, { useState, useEffect } from 'react';
import {
  NewsArticle,
  BreakingNewsItem,
  Category,
  AdCampaign,
  AIDraft,
  MediaItem,
  AuditLog,
  SiteSettings,
  User,
  UserRole,
} from '../../types/index.ts';
import { toBengaliNumber, formatBengaliDate, formatTimeAgoBengali } from '../../utils/bengaliUtils.ts';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshGeo.ts';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Zap,
  DollarSign,
  FolderTree,
  Image as ImageIcon,
  History,
  Settings,
  Download,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  LogOut,
  Shield,
  Send,
  ExternalLink,
  Flame,
  Search,
  Filter,
  Check,
  TrendingUp,
  Globe,
  Radio,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshData: () => void;
  categories: Category[];
  breakingNews: BreakingNewsItem[];
  settings: SiteSettings | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshData,
  categories,
  breakingNews,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'articles'
    | 'ai_research'
    | 'breaking'
    | 'ads'
    | 'categories'
    | 'media'
    | 'audit'
    | 'settings'
    | 'netlify'
  >('overview');

  // Current active user / role switcher (for RBAC demonstration & operations)
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [currentUserName, setCurrentUserName] = useState('নুসরাত জাহান (সম্পাদক ও প্রকাশক)');

  // Data states
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [aiDrafts, setAiDrafts] = useState<AIDraft[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & form states
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const [editingBreaking, setEditingBreaking] = useState<Partial<BreakingNewsItem> | null>(null);
  const [breakingModalOpen, setBreakingModalOpen] = useState(false);

  const [editingAd, setEditingAd] = useState<Partial<AdCampaign> | null>(null);
  const [adModalOpen, setAdModalOpen] = useState(false);

  // AI Research Trigger states
  const [aiTopic, setAiTopic] = useState('');
  const [aiSourceUrl, setAiSourceUrl] = useState('');
  const [aiCategory, setAiCategory] = useState('national');
  const [aiRunning, setAiRunning] = useState(false);
  const [selectedAiDraft, setSelectedAiDraft] = useState<AIDraft | null>(null);

  // Settings form
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings | null>(settings);

  // Fetch admin data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [artRes, draftRes, adRes, logRes, statRes] = await Promise.all([
        fetch('/api/news/admin').then((r) => r.json()),
        fetch('/api/ai/drafts').then((r) => r.json()),
        fetch('/api/ads?admin=true').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ]);
      setArticles(artRes || []);
      setAiDrafts(draftRes || []);
      setAds(adRes || []);
      setAuditLogs(logRes || []);
      setStats(statRes || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (settings) {
      setSiteSettingsForm(settings);
    }
  }, [settings]);

  // Handle Role change
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'Super Admin') setCurrentUserName('নুসরাত জাহান (সম্পাদক ও প্রকাশক)');
    else if (role === 'Executive Editor') setCurrentUserName('কামরুজ্জামান খান (নির্বাহী সম্পাদক)');
    else if (role === 'News Editor') setCurrentUserName('সামিয়া জামান (বার্তা সম্পাদক)');
    else if (role === 'Reporter') setCurrentUserName('তানভীর আহমেদ (প্রতিবেদক)');
    else if (role === 'Advertising Manager') setCurrentUserName('রফিকুল ইসলাম (বিজ্ঞাপন ব্যবস্থাপক)');
    else setCurrentUserName('সদস্য (কন্টেন্ট ম্যানেজার)');
  };

  // Run AI News Collection
  const handleRunAiResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAiRunning(true);
    try {
      const res = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic || 'বাংলাদেশ অর্থনীতি ও ডিজিটাল উদ্ভাবনের হালনাগাদ অগ্রগতি',
          sourceUrl: aiSourceUrl || 'https://www.bssnews.net',
          category: aiCategory,
        }),
      });
      const newDraft = await res.json();
      setAiDrafts([newDraft, ...aiDrafts]);
      setAiTopic('');
      setAiSourceUrl('');
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error('AI Research trigger error:', err);
    } finally {
      setAiRunning(false);
    }
  };

  // Approve and publish AI draft
  const handlePublishAiDraft = async (draftId: string) => {
    try {
      const res = await fetch(`/api/ai/drafts/${draftId}/publish`, { method: 'POST' });
      if (res.ok) {
        setSelectedAiDraft(null);
        loadAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to publish AI draft:', err);
    }
  };

  // Reject AI draft
  const handleRejectAiDraft = async (draftId: string) => {
    try {
      await fetch(`/api/ai/drafts/${draftId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', editorialNotes: 'সম্পাদকীয় নীতিমালার সাথে সংগতিপূর্ণ নয়' }),
      });
      loadAdminData();
    } catch (err) {
      console.error('Failed to reject draft:', err);
    }
  };

  // Save Article (CMS)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.content || !editingArticle?.category) return;

    try {
      if (editingArticle.id) {
        // Update
        await fetch(`/api/news/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingArticle),
        });
      } else {
        // Create
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingArticle,
            reporterName: currentUserName.split(' ')[0],
          }),
        });
      }
      setArticleModalOpen(false);
      setEditingArticle(null);
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to save article:', err);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই সংবাদটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  // Save Breaking News
  const handleSaveBreaking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBreaking?.title) return;
    try {
      await fetch('/api/breaking-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBreaking),
      });
      setBreakingModalOpen(false);
      setEditingBreaking(null);
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to save breaking news:', err);
    }
  };

  // Save Ad
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd?.name || !editingAd?.placement || !editingAd?.type) return;
    try {
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAd),
      });
      setAdModalOpen(false);
      setEditingAd(null);
      loadAdminData();
      onRefreshData();
    } catch (err) {
      console.error('Failed to save ad campaign:', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettingsForm) return;
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettingsForm),
      });
      loadAdminData();
      onRefreshData();
      alert('ওয়েবসাইট সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষণ করা হয়েছে!');
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col overflow-hidden text-slate-800">
      {/* Top Header of Admin Panel */}
      <div className="bg-[#0a1931] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center font-bold text-white font-serif-bn text-lg shadow-sm">
            দি
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg font-serif-bn leading-tight flex items-center gap-2">
              <span>দিগন্ত বার্তা — সংবাদ নিয়ন্ত্রণ কক্ষ ও সিএমএস</span>
              <span className="text-[10px] bg-red-600/90 text-white px-2 py-0.5 rounded font-mono font-semibold">
                PROD v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400">ডিজিটাল নিউজরুম ব্যবস্থাপনা ও এআই পাবলিশিং হাব</p>
          </div>
        </div>

        {/* Role Selector & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">ভূমিকা:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="Super Admin" className="bg-slate-900">
                Super Admin (নুসরাত জাহান)
              </option>
              <option value="Executive Editor" className="bg-slate-900">
                Executive Editor (কামরুজ্জামান খান)
              </option>
              <option value="News Editor" className="bg-slate-900">
                News Editor (সামিয়া জামান)
              </option>
              <option value="Reporter" className="bg-slate-900">
                Reporter (তানভীর আহমেদ)
              </option>
              <option value="Advertising Manager" className="bg-slate-900">
                Ad Manager (রফিকুল ইসলাম)
              </option>
              <option value="Content Manager" className="bg-slate-900">
                Content Manager
              </option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পোর্টালে ফিরুন</span>
          </button>
        </div>
      </div>

      {/* Main Admin Body: Sidebar + Tab Content */}
      <div className="flex-1 flex overflow-hidden bg-slate-100">
        {/* Sidebar Nav */}
        <div className="w-56 sm:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>ড্যাশবোর্ড ও পরিসংখ্যান</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'articles'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>সংবাদ ব্যবস্থাপনা (CMS)</span>
              </div>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ai_research')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ai_research'
                  ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>এআই সংবাদ গবেষণা হাব</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">
                {aiDrafts.filter((d) => d.status === 'new').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('breaking')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'breaking'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>ব্রেকিং নিউজ সেন্টার</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ads'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>বিজ্ঞাপন ও মনিটাইজেশন</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FolderTree className="w-4 h-4 text-indigo-500" />
              <span>ক্যাটাগরি ও বিভাগসমূহ</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'media'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-purple-500" />
              <span>মিডিয়া লাইব্রেরি</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'audit'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>সম্পাদনা অডিট লগ</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>ওয়েবসাইট সেটিংস ও ব্র্যান্ডিং</span>
            </button>

            <button
              onClick={() => setActiveTab('netlify')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'netlify'
                  ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>ডিপ্লয়মেন্ট ও প্রজেক্ট জিপ</span>
            </button>
          </div>

          {/* User badge at bottom of sidebar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">বর্তমান ব্যবহারকারী:</p>
            <p className="text-xs font-bold text-slate-900 truncate">{currentUserName}</p>
            <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
              {currentRole}
            </span>
          </div>
        </div>

        {/* Main Tab Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">প্রকাশিত সংবাদ</p>
                  <p className="text-2xl font-extrabold text-[#0a1931] mt-1 font-serif-bn">
                    {toBengaliNumber(stats?.totalPublished || 0)}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>লাইভ প্রকাশিত</span>
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">মোট পেজভিউ</p>
                  <p className="text-2xl font-extrabold text-red-700 mt-1 font-serif-bn">
                    {toBengaliNumber(stats?.totalViews || 0)}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    দৈনিক প্রায় {toBengaliNumber(stats?.dailyVisitors || 0)} পাঠক
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">এআই গবেষণা ড্রাফট</p>
                  <p className="text-2xl font-extrabold text-blue-700 mt-1 font-serif-bn">
                    {toBengaliNumber(stats?.aiDraftCount || 0)}
                  </p>
                  <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
                    যাচাইকৃত খসড়া প্রস্তুত
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <p className="text-xs text-slate-500 font-medium">বিজ্ঞাপন ও মনিটাইজেশন</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1 font-serif-bn">
                    {toBengaliNumber(stats?.totalAds || 0)} টি
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                    {toBengaliNumber(stats?.totalAdImpressions || 0)} ইমপ্রেশন
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Editorial Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editorial Actions */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>দ্রুত সম্পাদকীয় অ্যাকশন</span>
                    <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setEditingArticle({
                          title: '',
                          content: '',
                          category: 'national',
                          status: 'published',
                          isFeatured: true,
                        });
                        setArticleModalOpen(true);
                      }}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-800 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors border border-red-200"
                    >
                      <Plus className="w-5 h-5 text-red-700" />
                      <span>নতুন সংবাদ রচনা করুন</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('ai_research');
                      }}
                      className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors border border-blue-200"
                    >
                      <Sparkles className="w-5 h-5 text-blue-700" />
                      <span>এআই সংবাদ মনিটরিং</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingBreaking({
                          title: '',
                          priority: 'urgent',
                          isActive: true,
                          bgColor: '#b91c1c',
                          textColor: '#ffffff',
                        });
                        setBreakingModalOpen(true);
                      }}
                      className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors border border-amber-200"
                    >
                      <Zap className="w-5 h-5 text-amber-600" />
                      <span>ব্রেকিং নিউজ ফ্ল্যাশ</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingAd({
                          name: '',
                          type: 'direct_banner',
                          placement: 'header_top',
                          isActive: true,
                          device: 'all',
                        });
                        setAdModalOpen(true);
                      }}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <DollarSign className="w-5 h-5 text-emerald-700" />
                      <span>নতুন বিজ্ঞাপন স্লট</span>
                    </button>
                  </div>
                </div>

                {/* Recent Audit Activities */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>সাম্প্রতিক বার্তা কক্ষ অডিট লগ</span>
                    <History className="w-4 h-4 text-slate-400" />
                  </h3>
                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{log.action}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{log.target}</p>
                          <span className="text-[10px] text-red-700 font-bold">{log.user}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTimeAgoBengali(log.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES CMS */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                    সংবাদ ব্যবস্থাপনা ও সম্পাদনা তালিকা
                  </h2>
                  <p className="text-xs text-slate-500">
                    সকল সংবাদ খসড়া, পর্যালোচনা, অনুমোদন ও সরাসরি প্রকাশনা
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle({
                      title: '',
                      content: '',
                      category: 'national',
                      status: 'published',
                      isFeatured: true,
                    });
                    setArticleModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>সংবাদ তৈরি করুন</span>
                </button>
              </div>

              {/* Articles Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">সংবাদ শিরোনাম</th>
                        <th className="p-3">বিভাগ</th>
                        <th className="p-3">প্রতিবেদক</th>
                        <th className="p-3">অবস্থা</th>
                        <th className="p-3">ভিউ</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3 text-right">পদক্ষেপ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 max-w-xs font-medium text-slate-900">
                            <p className="line-clamp-2 leading-snug">{art.title}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {art.isBreaking && (
                                <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1 rounded">
                                  ব্রেকিং
                                </span>
                              )}
                              {art.isFeatured && (
                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1 rounded">
                                  প্রধান খবর
                                </span>
                              )}
                              {art.aiGenerated && (
                                <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-1 rounded">
                                  এআই
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 font-semibold">{art.categoryName}</td>
                          <td className="p-3 text-slate-600">{art.reporterName}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                art.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : art.status === 'pending_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {art.status === 'published'
                                ? 'প্রকাশিত'
                                : art.status === 'pending_review'
                                ? 'পর্যালোচনায়'
                                : 'খসড়া'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {toBengaliNumber(art.views || 0)}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            {formatTimeAgoBengali(art.publishedAt)}
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingArticle(art);
                                setArticleModalOpen(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="সম্পাদনা"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI RESEARCH DASHBOARD */}
          {activeTab === 'ai_research' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0a1931] to-[#1e3a8a] text-white p-6 rounded-2xl shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif-bn">
                      দিগন্ত বার্তা এআই নিউজ রিসার্চ এজেন্ট (Gemini 3.8 Flash)
                    </h2>
                    <p className="text-xs text-blue-200">
                      বাসস, বিবিসি বাংলা, সরকারি তথ্য বাতায়ন ও রয়টার্স হতে স্বয়ংক্রিয় তথ্য মনিটরিং ও ড্রাফটিং
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-2">
                  <strong>সাংবাদিকতার মূলনীতি:</strong> কোনো এআই খসড়া মানব বার্তা সম্পাদকের যাচাই ও
                  অনুমোদন ব্যতীত স্বয়ংক্রিয়ভাবে প্রকাশিত হবে না। এআই ফ্যাক্ট-চেক ও নির্ভরযোগ্যতার
                  স্কোর প্রদান করে।
                </p>

                {/* AI Research Form Trigger */}
                <form
                  onSubmit={handleRunAiResearch}
                  className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700"
                >
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      সংবাদ বিষয় বা উৎস টেক্সট:
                    </label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="যেমন: মাতারবাড়ী গভীর সমুদ্রবন্দর বাণিজ্য চুক্তি..."
                      className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      বিভাগ:
                    </label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="national">জাতীয় (National)</option>
                      <option value="economy">অর্থনীতি (Economy)</option>
                      <option value="politics">রাজনীতি (Politics)</option>
                      <option value="international">আন্তর্জাতিক (International)</option>
                      <option value="tech">বিজ্ঞান ও প্রযুক্তি (Tech)</option>
                      <option value="environment">পরিবেশ ও জলবায়ু (Climate)</option>
                      <option value="sports">খেলাধুলা (Sports)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={aiRunning}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      {aiRunning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>এআই বিশ্লেষণ চলছে...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>সংবাদ সংগ্রহ ও ড্রাফট তৈরি</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Collected Drafts Queue */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>সংগৃহীত এআই খসড়া তালিকা ({aiDrafts.length})</span>
                  <span className="text-xs font-normal text-slate-500">
                    বার্তা সম্পাদকের পর্যালোচনা প্রয়োজন
                  </span>
                </h3>

                <div className="space-y-4">
                  {aiDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded">
                            {draft.sourceName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              draft.verificationStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {draft.verificationStatus === 'verified'
                              ? '✓ নির্ভরযোগ্যতা নিশ্চিত'
                              : '⚠ সতর্ক পুনঃনিরীক্ষা'}
                          </span>
                          <span className="text-slate-500 text-[11px] font-mono">
                            আস্থা স্তর: {toBengaliNumber(draft.confidence)}%
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            draft.status === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : draft.status === 'rejected'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {draft.status === 'approved'
                            ? 'অনুমোদিত'
                            : draft.status === 'rejected'
                            ? 'বাতিলকৃত'
                            : 'নতুন ড্রাফট'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug mb-2 font-serif-bn">
                        {draft.aiHeadline}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {draft.aiSummary}
                      </p>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-1 mb-4">
                        <p>
                          <strong className="text-slate-700">উৎস যাচাই বিশ্লেষণ:</strong>{' '}
                          {draft.sourceComparison}
                        </p>
                        <p>
                          <strong className="text-slate-700">সম্পাদকীয় নোট:</strong>{' '}
                          {draft.editorialNotes}
                        </p>
                        <a
                          href={draft.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] mt-1"
                        >
                          <span>মূল উৎসের লিংক পরিদর্শন করুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Editorial Approval Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        {draft.status !== 'approved' && (
                          <button
                            onClick={() => handlePublishAiDraft(draft.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>অনুমোদন ও সরাসরি প্রকাশনা</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingArticle({
                              title: draft.aiHeadline,
                              content: draft.aiFullDraft,
                              excerpt: draft.aiSummary,
                              category: draft.category || 'national',
                              status: 'published',
                              isFeatured: true,
                              source: draft.sourceName,
                              sourceUrl: draft.sourceUrl,
                              aiGenerated: true,
                            });
                            setArticleModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>খসড়া সম্পাদনা করুন</span>
                        </button>

                        {draft.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectAiDraft(draft.id)}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            <span>বাতিল</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BREAKING NEWS */}
          {activeTab === 'breaking' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                    ব্রেকিং নিউজ নিয়ন্ত্রণ কেন্দ্র
                  </h2>
                  <p className="text-xs text-slate-500">
                    হোমপেজ ও প্রতিটি পৃষ্ঠার স্ক্রলিং ব্রেকিং টিকার পরিচালনা
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingBreaking({
                      title: '',
                      priority: 'urgent',
                      isActive: true,
                      bgColor: '#b91c1c',
                      textColor: '#ffffff',
                    });
                    setBreakingModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ব্রেকিং নিউজ যুক্ত করুন</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">শিরোনাম</th>
                      <th className="p-3">অগ্রাধিকার</th>
                      <th className="p-3">অবস্থা</th>
                      <th className="p-3">তৈরির সময়</th>
                      <th className="p-3 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {breakingNews.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-medium text-slate-900 max-w-md">{item.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.priority === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.priority === 'urgent' ? 'জরুরি' : 'সাধারণ'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {formatTimeAgoBengali(item.createdAt)}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingBreaking(item);
                              setBreakingModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`/api/breaking-news/${item.id}`, { method: 'DELETE' });
                              loadAdminData();
                              onRefreshData();
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ADS & MONETIZATION */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                    বিজ্ঞাপন ও রাজস্ব মনিটাইজেশন কেন্দ্র
                  </h2>
                  <p className="text-xs text-slate-500">
                    বাণিজ্যিক ব্যানার, Adsterra ও Monetag নেটওয়ার্কের একক নিয়ন্ত্রণ
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAd({
                      name: '',
                      type: 'direct_banner',
                      placement: 'header_top',
                      isActive: true,
                      device: 'all',
                    });
                    setAdModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন বিজ্ঞাপন ক্যাম্পেইন</span>
                </button>
              </div>

              {/* Ads Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">বিজ্ঞাপনের নাম</th>
                      <th className="p-3">ধরন / নেটওয়ার্ক</th>
                      <th className="p-3">অবস্থান (Placement)</th>
                      <th className="p-3">ইমপ্রেশন</th>
                      <th className="p-3">ক্লিক</th>
                      <th className="p-3">অবস্থা</th>
                      <th className="p-3 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                          {ad.name}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ad.type.startsWith('adsterra')
                                ? 'bg-orange-100 text-orange-800'
                                : ad.type.startsWith('monetag')
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ad.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{ad.placement}</td>
                        <td className="p-3 font-mono">{toBengaliNumber(ad.impressions || 0)}</td>
                        <td className="p-3 font-mono">{toBengaliNumber(ad.clicks || 0)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ad.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {ad.isActive ? 'সক্রিয়' : 'বন্ধ'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingAd(ad);
                              setAdModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`/api/ads/${ad.id}`, { method: 'DELETE' });
                              loadAdminData();
                              onRefreshData();
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                  সংবাদ বিভাগ ও ক্যাটাগরি ব্যবস্থাপনা
                </h2>
                <p className="text-xs text-slate-500">
                  পোর্টালের ১৯টি স্ট্যান্ডার্ড ক্যাটাগরি ও সাব-ক্যাটাগরি
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">/{c.slug}</p>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                      #{toBengaliNumber(c.order)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif-bn">মিডিয়া লাইব্রেরি</h2>
                <p className="text-xs text-slate-500">
                  সংবাদের জন্য আপলোডকৃত ছবি ও ফটো আর্কাইভ
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group"
                  >
                    <div className="h-32 bg-slate-100 overflow-hidden relative">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-slate-800 truncate">{art.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{art.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                  সম্পাদকীয় নিরাপত্তা ও অডিট লগ
                </h2>
                <p className="text-xs text-slate-500">
                  নিউজ পরিবর্তন, অনুমোদন, ব্রেকিং নিউজ অ্যাক্টিভেশন ও সিএমএস কার্যপদ্ধতির বিস্তারিত ট্র্যাক
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ব্যবহারকারী ও পদবী</th>
                      <th className="p-3">কর্মকাণ্ড (Action)</th>
                      <th className="p-3">বিষয়বস্তু (Target)</th>
                      <th className="p-3 text-right">সময়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{log.user}</p>
                          <span className="text-[10px] text-red-700">{log.role}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{log.action}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{log.target}</td>
                        <td className="p-3 text-right text-slate-400">
                          {formatTimeAgoBengali(log.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS & BRANDING */}
          {activeTab === 'settings' && siteSettingsForm && (
            <div className="max-w-4xl bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                  ওয়েবসাইট সেটিংস, সম্পাদকীয় বোর্ড ও ব্র্যান্ডিং
                </h2>
                <p className="text-xs text-slate-500">
                  অফিসিয়াল যোগাযোগ, স্লোগান, ব্রেকিং স্পিড ও এসইও কনফিগারেশন
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ওয়েবসাইট নাম:
                    </label>
                    <input
                      type="text"
                      value={siteSettingsForm.siteName}
                      onChange={(e) =>
                        setSiteSettingsForm({ ...siteSettingsForm, siteName: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ইংরেজি নাম:
                    </label>
                    <input
                      type="text"
                      value={siteSettingsForm.siteNameEn}
                      onChange={(e) =>
                        setSiteSettingsForm({ ...siteSettingsForm, siteNameEn: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ব্র্যান্ড স্লোগান:
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.tagline}
                    onChange={(e) =>
                      setSiteSettingsForm({ ...siteSettingsForm, tagline: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                    সম্পাদকীয় নেতৃত্ব ও দাপ্তরিক ফোন নম্বর
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        সম্পাদক ও প্রকাশক:
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.publisher}
                        onChange={(e) =>
                          setSiteSettingsForm({ ...siteSettingsForm, publisher: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg mb-2"
                      />
                      <input
                        type="text"
                        value={siteSettingsForm.publisherPhone}
                        onChange={(e) =>
                          setSiteSettingsForm({ ...siteSettingsForm, publisherPhone: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        নির্বাহী সম্পাদক:
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.executiveEditor}
                        onChange={(e) =>
                          setSiteSettingsForm({ ...siteSettingsForm, executiveEditor: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg mb-2"
                      />
                      <input
                        type="text"
                        value={siteSettingsForm.executiveEditorPhone}
                        onChange={(e) =>
                          setSiteSettingsForm({
                            ...siteSettingsForm,
                            executiveEditorPhone: e.target.value,
                          })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        বার্তা সম্পাদক:
                      </label>
                      <input
                        type="text"
                        value={siteSettingsForm.newsEditor}
                        onChange={(e) =>
                          setSiteSettingsForm({ ...siteSettingsForm, newsEditor: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg mb-2"
                      />
                      <input
                        type="text"
                        value={siteSettingsForm.newsEditorPhone}
                        onChange={(e) =>
                          setSiteSettingsForm({ ...siteSettingsForm, newsEditorPhone: e.target.value })
                        }
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors shadow-md"
                  >
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 10: NETLIFY DEPLOYMENT & PROJECT ZIP DOWNLOAD */}
          {activeTab === 'netlify' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-serif-bn">
                      নেটলিফাই ডিপ্লয়মেন্ট ও প্রজেক্ট জিপ প্যাকেজ
                    </h2>
                    <p className="text-xs text-slate-500">
                      Requirement 19: সম্পূর্ণ প্রজেক্টের সোর্স কোড ও Netlify কনফিগারেশন জিপ ডাউনলোড
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-sm text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>নেটলিফাই ড্রপ (Netlify Drop)-এ ব্ল্যাঙ্ক বা এরর আসার কারণ ও সমাধান:</span>
                  </p>
                  <p className="leading-relaxed">
                    নেটলিফাই ড্রপ কোনো সার্ভার বিল্ড রান করে না; এটি সরাসরি প্রস্তুতকৃত <strong>এইচটিএমএল ও অ্যাসেটস</strong> আশা করে। র' সোর্স কোড ড্রপ করলে ব্রাউজার কোড রান করতে পারে না।
                    নিচে দেওয়া <strong>১ নম্বর সবুজ বাটনে ক্লিক করে 'নেটলিফাই রেডি ড্রপ জিপ'</strong> নামিয়ে আনজিপ না করে সরাসরি Netlify Drop-এ ড্র্যাগ অ্যান্ড ড্রপ করলেই আপনার সাইট সাথে সাথে সম্পূর্ণ লাইভ হয়ে যাবে!
                  </p>
                </div>

                {/* Big Download ZIP Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Button 1: Netlify Drag & Drop Ready */}
                  <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-500 flex flex-col justify-between gap-3 shadow-xs">
                    <div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        ১০০% রেডি • Netlify Drag & Drop
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-2 font-serif-bn">
                        ১. নেটলিফাই রেডি ড্রপ জিপ (.ZIP)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        প্রাক-কম্পাইলকৃত প্রোডাকশন ফাইল (index.html, assets, _redirects)। নামিয়ে সরাসরি Netlify Drop এ ড্রপ করুন।
                      </p>
                    </div>

                    <a
                      href="/api/export-deploy-zip"
                      download="diganta-barta-netlify-drop-ready.zip"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>নেটলিফাই ড্রপ জিপ ডাউনলোড (.ZIP)</span>
                    </a>
                  </div>

                  {/* Button 2: Full Source Code */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-300 flex flex-col justify-between gap-3 shadow-xs">
                    <div>
                      <span className="bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        ডেভেলপার সোর্স কোড
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-2 font-serif-bn">
                        ২. সম্পূর্ণ সোর্স কোড জিপ (.ZIP)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        গিটহাব রেপো, ভিএস কোড, এক্সপ্রেস ব্যাকএন্ড এবং সম্পূর্ণ সোর্স ফাইলের ফুল প্যাকেজ।
                      </p>
                    </div>

                    <a
                      href="/api/export-zip"
                      download="diganta-barta-full-source.zip"
                      className="w-full py-3 bg-[#0a1931] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>সম্পূর্ণ সোর্স কোড ডাউনলোড (.ZIP)</span>
                    </a>
                  </div>
                </div>

                {/* Netlify CLI & Git Deployment Steps */}
                <div className="space-y-3 pt-4 border-t border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                    বিকল্প পদ্ধতি: গিটহাব বা Netlify CLI দিয়ে ডিপ্লয়:
                  </h4>
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono space-y-2 text-[11px]">
                    <p className="text-emerald-400"># ১. ডিপ্লয়মেন্ট বিল্ড প্রস্তুত করুন</p>
                    <p>npm run build</p>
                    <p className="text-emerald-400 mt-2"># ২. Netlify CLI ব্যবহার করে ডিপ্লয় করুন</p>
                    <p>netlify deploy --prod</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                    <p className="font-semibold">পরিবেশ ভেরিয়েবল (Environment Variables):</p>
                    <p className="mt-1">
                      Netlify ড্যাশবোর্ডে <strong>GEMINI_API_KEY</strong> এবং <strong>APP_URL</strong> কনফিগার করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ARTICLE CREATE / EDIT MODAL */}
      {articleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-serif-bn">
                {editingArticle.id ? 'সংবাদ হালনাগাদ করুন' : 'নতুন সংবাদ রচনা'}
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">সংবাদ শিরোনাম *</label>
                <input
                  type="text"
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">উপ-শিরোনাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingArticle.subtitle || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি *</label>
                  <select
                    value={editingArticle.category || 'national'}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.slug === e.target.value);
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value,
                        categoryName: cat?.name || 'জাতীয়',
                      });
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">বিভাগ (ঐচ্ছিক)</label>
                  <select
                    value={editingArticle.division || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, division: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">প্রকাশের অবস্থা</label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, status: e.target.value as any })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="published">সরাসরি প্রকাশিত (Published)</option>
                    <option value="pending_review">পর্যালোচনায় (Pending Review)</option>
                    <option value="draft">খসড়া (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ফিচার্ড ছবির URL</label>
                <input
                  type="text"
                  value={editingArticle.featuredImage || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featuredImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">সংক্ষেপ / এক্সার্পট</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মূল সংবাদ বিষয়বস্তু *</label>
                <textarea
                  rows={6}
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg leading-relaxed"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isBreaking)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isBreaking: e.target.checked })
                    }
                    className="rounded text-red-600"
                  />
                  <span>ব্রেকিং নিউজ হিসেবে চিহ্নিত করুন</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.isFeatured)}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>প্রধান সংবাদ (Featured)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold shadow-xs"
                >
                  সংরক্ষণ ও প্রকাশনা
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BREAKING NEWS MODAL */}
      {breakingModalOpen && editingBreaking && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif-bn mb-4">
              ব্রেকিং নিউজ যুক্ত / সম্পাদন
            </h3>
            <form onSubmit={handleSaveBreaking} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ব্রেকিং সংবাদ শিরোনাম *</label>
                <textarea
                  rows={3}
                  value={editingBreaking.title || ''}
                  onChange={(e) =>
                    setEditingBreaking({ ...editingBreaking, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">অগ্রাধিকার</label>
                <select
                  value={editingBreaking.priority || 'urgent'}
                  onChange={(e) =>
                    setEditingBreaking({ ...editingBreaking, priority: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="urgent">জরুরি (Urgent Red)</option>
                  <option value="high">উচ্চ (High Navy)</option>
                  <option value="normal">সাধারণ (Normal Green)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="breakingActive"
                  checked={Boolean(editingBreaking.isActive)}
                  onChange={(e) =>
                    setEditingBreaking({ ...editingBreaking, isActive: e.target.checked })
                  }
                />
                <label htmlFor="breakingActive" className="font-semibold text-slate-700">
                  সক্রিয় রাখুন (হোমপেজে স্ক্রল হবে)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setBreakingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white font-bold rounded-lg"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AD CAMPAIGN MODAL */}
      {adModalOpen && editingAd && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif-bn mb-4">
              বিজ্ঞাপন স্লট / ক্যাম্পেইন কনফিগারেশন
            </h3>
            <form onSubmit={handleSaveAd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ক্যাম্পেইনের নাম *</label>
                <input
                  type="text"
                  value={editingAd.name || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">বিজ্ঞাপনের ধরন *</label>
                  <select
                    value={editingAd.type || 'direct_banner'}
                    onChange={(e) => setEditingAd({ ...editingAd, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="direct_banner">সরাসরি বাণিজ্যিক ব্যানার</option>
                    <option value="adsterra_banner">Adsterra ব্যানার (728x90)</option>
                    <option value="adsterra_socialbar">Adsterra সোশ্যাল বার</option>
                    <option value="adsterra_popunder">Adsterra পপআন্ডার</option>
                    <option value="monetag_banner">Monetag ব্যানার</option>
                    <option value="monetag_socialbar">Monetag ইন-পেজ পুশ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">অবস্থান (Placement) *</label>
                  <select
                    value={editingAd.placement || 'header_top'}
                    onChange={(e) =>
                      setEditingAd({ ...editingAd, placement: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="header_top">শীর্ষ ব্যানার (Header Top)</option>
                    <option value="home_middle">হোমপেজ মিডল (Home Middle)</option>
                    <option value="home_sidebar">সাইডবার (Home Sidebar)</option>
                    <option value="article_top">নিবন্ধের শীর্ষে (Article Top)</option>
                    <option value="article_inline">নিবন্ধের ভেতরে (Article Inline)</option>
                    <option value="article_bottom">নিবন্ধের নিচে (Article Bottom)</option>
                    <option value="sticky_footer">স্টিকি ফুটার বার (Sticky Footer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">বিজ্ঞাপনদাতার নাম</label>
                <input
                  type="text"
                  value={editingAd.advertiser || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, advertiser: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ব্যানার ছবির লিংক (Direct Banner)</label>
                <input
                  type="text"
                  value={editingAd.imageUrl || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Adsterra / Monetag কোড স্নিপেট (Optional Script/Iframe)
                </label>
                <textarea
                  rows={3}
                  value={editingAd.codeSnippet || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, codeSnippet: e.target.value })}
                  placeholder="<!-- Ad script goes here -->"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[10px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="adActive"
                  checked={Boolean(editingAd.isActive)}
                  onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                />
                <label htmlFor="adActive" className="font-semibold text-slate-700">
                  বিজ্ঞাপনটি সক্রিয় রাখুন
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-lg"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

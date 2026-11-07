import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { NewsCard } from './components/NewsCard.tsx';
import { AdBanner } from './components/AdBanner.tsx';
import { ArticleDetailModal } from './components/ArticleDetailModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { DistrictSelector } from './components/DistrictSelector.tsx';
import { StaticPageModal } from './components/StaticPageModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { NewsArticle, Category, BreakingNewsItem, AdCampaign, SiteSettings } from './types/index.ts';
import { toBengaliNumber } from './utils/bengaliUtils.ts';
import {
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_BREAKING_NEWS,
  INITIAL_ADS,
  INITIAL_SETTINGS,
} from './data/seedData.ts';
import {
  Flame,
  TrendingUp,
  Award,
  Video,
  Camera,
  Layers,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Radio,
} from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(INITIAL_BREAKING_NEWS);
  const [ads, setAds] = useState<AdCampaign[]>(INITIAL_ADS);
  const [settings, setSettings] = useState<SiteSettings | null>(INITIAL_SETTINGS);

  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [districtModalOpen, setDistrictModalOpen] = useState(false);
  const [staticPage, setStaticPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const fetchJson = async (url: string, fallback: any) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return fallback;
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            return fallback;
          }
        } catch {
          return fallback;
        }
      };

      const [artRes, catRes, breakRes, adRes, setRes] = await Promise.all([
        fetchJson('/api/news', INITIAL_ARTICLES),
        fetchJson('/api/categories', INITIAL_CATEGORIES),
        fetchJson('/api/breaking-news', INITIAL_BREAKING_NEWS),
        fetchJson('/api/ads', INITIAL_ADS),
        fetchJson('/api/settings', INITIAL_SETTINGS),
      ]);

      if (Array.isArray(artRes) && artRes.length > 0) setArticles(artRes);
      if (Array.isArray(catRes) && catRes.length > 0) setCategories(catRes);
      if (Array.isArray(breakRes) && breakRes.length > 0) setBreakingNews(breakRes);
      if (Array.isArray(adRes) && adRes.length > 0) setAds(adRes);
      if (setRes) setSettings(setRes);
    } catch (err) {
      console.warn('Using offline / static seed data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered articles based on category
  const displayedArticles =
    activeCategory === 'home'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  // Grouped datasets for newspaper layout
  const leadStory = articles.find((a) => a.isFeatured) || articles[0];
  const secondaryStories = articles
    .filter((a) => a.id !== leadStory?.id && a.isFeatured)
    .slice(0, 2);
  const latestStories = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
  const trendingStories = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const nationalStories = articles.filter((a) => a.category === 'national').slice(0, 4);
  const politicsStories = articles.filter((a) => a.category === 'politics').slice(0, 3);
  const economyStories = articles.filter((a) => a.category === 'economy').slice(0, 4);
  const sportsStories = articles.filter((a) => a.category === 'sports').slice(0, 4);
  const techStories = articles.filter((a) => a.category === 'tech').slice(0, 3);
  const opinionStories = articles.filter((a) => a.category === 'opinion');

  const currentCategoryObj = categories.find((c) => c.slug === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-700 selection:text-white">
      {/* Newspaper Header */}
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        breakingNews={breakingNews}
        settings={settings}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectArticleById={(slug) => {
          const match = articles.find((a) => a.slug === slug || a.id === slug);
          if (match) setSelectedArticle(match);
        }}
        onOpenDistrictModal={() => setDistrictModalOpen(true)}
      />

      {/* Main Newspaper Body Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full">
        {/* Top Leaderboard Ad */}
        <AdBanner placement="header_top" ads={ads} />

        {/* LOADING SKELETON */}
        {loading && (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-serif-bn font-bold text-lg text-slate-800">
              দিগন্ত বার্তা পোর্টাল লোড হচ্ছে...
            </p>
          </div>
        )}

        {/* CATEGORY ARCHIVE VIEW (When category is selected) */}
        {!loading && activeCategory !== 'home' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a1931] font-serif-bn">
                    {currentCategoryObj?.name || 'সংবাদ বিভাগ'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentCategoryObj?.name} বিভাগের সত্যনিষ্ঠ ও বস্তুনিষ্ঠ সংবাদের সংকলন
                  </p>
                </div>
                <span className="text-xs bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full border border-red-200">
                  {toBengaliNumber(displayedArticles.length)} টি সংবাদ
                </span>
              </div>
            </div>

            {displayedArticles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
                <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-base font-bold text-slate-700 font-serif-bn">
                  এই বিভাগে বর্তমানে কোনো সংবাদ নেই
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  সিএমএস বা এআই রিসার্চ হাব থেকে সংবাদ প্রকাশ করা যাবে
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedArticles.map((art) => (
                  <NewsCard
                    key={art.id}
                    article={art}
                    variant="standard"
                    onClick={() => setSelectedArticle(art)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* HOMEPAGE EDITORIAL NEWSPAPER LAYOUT (When activeCategory === 'home') */}
        {!loading && activeCategory === 'home' && (
          <div className="space-y-8">
            {/* 1. TOP EDITORIAL HERO: Lead + Secondary + Trending Column */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left & Middle: Main Lead & Secondary Stories (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {leadStory && (
                  <NewsCard
                    article={leadStory}
                    variant="lead"
                    onClick={() => setSelectedArticle(leadStory)}
                  />
                )}

                {/* Secondary 2-Column Grid */}
                {secondaryStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {secondaryStories.map((story) => (
                      <NewsCard
                        key={story.id}
                        article={story}
                        variant="standard"
                        onClick={() => setSelectedArticle(story)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Trending & Latest Tabs (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Most Read / Trending Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-red-700 mb-3">
                    <h3 className="text-sm font-bold text-[#0a1931] uppercase tracking-wider flex items-center gap-1.5 font-serif-bn">
                      <Flame className="w-4 h-4 text-red-600 fill-current" />
                      <span>সর্বাধিক পঠিত</span>
                    </h3>
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                      জনপ্রিয়
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {trendingStories.map((story, idx) => (
                      <NewsCard
                        key={story.id}
                        article={story}
                        variant="compact"
                        priorityIndex={idx + 1}
                        onClick={() => setSelectedArticle(story)}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar Ad Placement */}
                <AdBanner placement="home_sidebar" ads={ads} />

                {/* Latest Bulletins List */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-900 mb-3">
                    <h3 className="text-sm font-bold text-[#0a1931] uppercase tracking-wider flex items-center gap-1.5 font-serif-bn">
                      <Radio className="w-4 h-4 text-blue-700" />
                      <span>সর্বশেষ বুলেটিন</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">লাইভ</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {latestStories.slice(0, 4).map((story) => (
                      <div
                        key={story.id}
                        onClick={() => setSelectedArticle(story)}
                        className="py-2.5 cursor-pointer group"
                      >
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors leading-snug">
                          {story.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {story.categoryName} • {toBengaliNumber(story.readingTime || 3)} মিনিট পাঠ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Middle Commercial Ad Banner */}
            <AdBanner placement="home_middle" ads={ads} />

            {/* 2. SECTION: NATIONAL & POLITICS */}
            <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b-2 border-red-700 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-red-700 rounded-xs"></span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0a1931] font-serif-bn">
                    জাতীয় ও রাজনীতি
                  </h2>
                </div>
                <button
                  onClick={() => setActiveCategory('national')}
                  className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
                >
                  <span>আরও দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nationalStories.concat(politicsStories).slice(0, 4).map((story) => (
                  <NewsCard
                    key={story.id}
                    article={story}
                    variant="standard"
                    onClick={() => setSelectedArticle(story)}
                  />
                ))}
              </div>
            </section>

            {/* 3. SECTION: DISTRICT & LOCAL NEWS (Interactive 64 Districts) */}
            <section className="bg-slate-50 rounded-xl border border-slate-200/90 p-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#0a1931] mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#0a1931] font-serif-bn">
                    সারাদেশ ও জেলাভিত্তিক সংবাদ
                  </h2>
                </div>
                <button
                  onClick={() => setDistrictModalOpen(true)}
                  className="text-xs font-bold text-white bg-[#0f2042] hover:bg-red-700 px-3 py-1 rounded-full transition-colors"
                >
                  সব জেলা খুঁজুন
                </button>
              </div>

              <DistrictSelector
                articles={articles}
                onSelectArticle={(art) => setSelectedArticle(art)}
              />
            </section>

            {/* 4. SECTION: ECONOMY & SPORTS (2 Columns Split) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Economy Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-700 mb-4">
                  <h3 className="text-lg font-bold text-[#0a1931] font-serif-bn flex items-center gap-2">
                    <span className="w-2.5 h-5 bg-emerald-600 rounded-xs"></span>
                    <span>অর্থনীতি ও বাণিজ্য</span>
                  </h3>
                  <button
                    onClick={() => setActiveCategory('economy')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
                  >
                    <span>আরও</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {economyStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      article={story}
                      variant="horizontal"
                      onClick={() => setSelectedArticle(story)}
                    />
                  ))}
                </div>
              </div>

              {/* Sports Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b-2 border-red-700 mb-4">
                  <h3 className="text-lg font-bold text-[#0a1931] font-serif-bn flex items-center gap-2">
                    <span className="w-2.5 h-5 bg-red-600 rounded-xs"></span>
                    <span>খেলাধুলা</span>
                  </h3>
                  <button
                    onClick={() => setActiveCategory('sports')}
                    className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center"
                  >
                    <span>আরও</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {sportsStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      article={story}
                      variant="horizontal"
                      onClick={() => setSelectedArticle(story)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 5. SECTION: OPINION & EDITORIAL COLUMNISTS */}
            {opinionStories.length > 0 && (
              <section className="bg-gradient-to-r from-slate-900 via-[#0a1931] to-slate-900 text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
                  <div>
                    <h2 className="text-xl font-bold font-serif-bn text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>মতামত ও সম্পাদকীয় কলাম</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      জাতীয় ও আন্তর্জাতিক বিশেষজ্ঞদের সুচিন্তিত বিশ্লেষণ
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCategory('opinion')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>সকল কলাম</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-900">
                  {opinionStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      article={story}
                      variant="opinion"
                      onClick={() => setSelectedArticle(story)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 6. SECTION: SCIENCE & TECHNOLOGY */}
            {techStories.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-700 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-indigo-700 rounded-xs"></span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0a1931] font-serif-bn">
                      বিজ্ঞান ও প্রযুক্তি
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveCategory('tech')}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>আরও দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {techStories.map((story) => (
                    <NewsCard
                      key={story.id}
                      article={story}
                      variant="standard"
                      onClick={() => setSelectedArticle(story)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Sticky Bottom Footer Ad Bar (if configured) */}
      <AdBanner placement="sticky_footer" ads={ads} className="fixed bottom-0 left-0 right-0 z-30" />

      {/* Newspaper Footer */}
      <Footer
        settings={settings}
        categories={categories}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStaticPage={(page) => setStaticPage(page)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          allArticles={articles}
          ads={ads}
          onClose={() => setSelectedArticle(null)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {/* SEARCH MODAL */}
      <SearchModal
        articles={articles}
        categories={categories}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* DISTRICT MODAL */}
      {districtModalOpen && (
        <DistrictSelector
          articles={articles}
          onSelectArticle={(art) => setSelectedArticle(art)}
          isOpen={districtModalOpen}
          onClose={() => setDistrictModalOpen(false)}
        />
      )}

      {/* INSTITUTIONAL / LEGAL STATIC PAGE MODAL */}
      {staticPage && (
        <StaticPageModal
          pageType={staticPage}
          settings={settings}
          onClose={() => setStaticPage(null)}
        />
      )}

      {/* FULL ADMIN CONTROL PANEL */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          onRefreshData={fetchData}
          categories={categories}
          breakingNews={breakingNews}
          settings={settings}
        />
      )}
    </div>
  );
}

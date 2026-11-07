import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Share2,
  CloudSun,
  ShieldAlert,
  ChevronDown,
  Volume2,
  ExternalLink,
  Flame,
  LayoutDashboard,
} from 'lucide-react';
import { formatBengaliDate, toBengaliNumber } from '../utils/bengaliUtils.ts';
import { Category, BreakingNewsItem, SiteSettings } from '../types/index.ts';

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  breakingNews: BreakingNewsItem[];
  settings: SiteSettings | null;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onSelectArticleById?: (idOrSlug: string) => void;
  onOpenDistrictModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  breakingNews,
  settings,
  onOpenSearch,
  onOpenAdmin,
  onSelectArticleById,
  onOpenDistrictModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnglishDate, setIsEnglishDate] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (isEnglishDate) {
        setCurrentDateStr(
          now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        );
      } else {
        setCurrentDateStr(formatBengaliDate(now));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isEnglishDate]);

  const activeBreakingItems = breakingNews.filter((b) => b.isActive);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Information Bar */}
      <div className="bg-[#0a1931] text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Date, Weather, Location */}
          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={() => setIsEnglishDate(!isEnglishDate)}
              className="hover:text-red-400 transition-colors flex items-center gap-1 font-medium"
              title="ক্লিক করে ভাষা পরিবর্তন করুন"
            >
              <span>📅 {currentDateStr}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 ml-1">
                {isEnglishDate ? 'বাংলা' : 'EN'}
              </span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>ঢাকা: ২৯°সে, মৃদু বাতাস</span>
            </div>
          </div>

          {/* Social Links & Quick Admin Switch */}
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 hidden md:inline">অনুসরণ করুন:</span>
            <div className="flex items-center space-x-2">
              <a
                href={settings?.socialLinks.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="Facebook"
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  f
                </span>
              </a>
              <a
                href={settings?.socialLinks.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="X / Twitter"
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-[10px] font-bold">
                  𝕏
                </span>
              </a>
              <a
                href={settings?.socialLinks.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="YouTube"
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center text-[10px] font-bold">
                  ▶
                </span>
              </a>
            </div>

            <span className="text-slate-600">|</span>

            {/* Admin Switcher Button */}
            <button
              onClick={onOpenAdmin}
              className="bg-red-700 hover:bg-red-600 text-white px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>বার্তা কক্ষ ও অ্যাডমিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Logo & Slogan Area */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-700 hover:text-slate-900 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Identity / Logo */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div
            onClick={() => onSelectCategory('home')}
            className="cursor-pointer group inline-flex items-center gap-3 select-none"
          >
            {/* Logo Emblem */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0a1931] via-[#0f2042] to-[#1e3a8a] flex items-center justify-center shadow-md relative overflow-hidden shrink-0 border border-slate-700">
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full blur-[1px]"></div>
              <span className="relative text-white font-bold text-xl sm:text-2xl font-serif-bn tracking-wider">
                দি
              </span>
            </div>

            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0a1931] font-serif-bn leading-none group-hover:text-red-700 transition-colors">
                দিগন্ত বার্তা
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 tracking-wider mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>
                <span>{settings?.tagline || 'সত্যের সন্ধানে, আগামীর পথে'}</span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-400 font-semibold tracking-widest hidden sm:inline text-[10px]">
                  DIGANTA BARTA
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right side search & epaper links */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">খুঁজুন...</span>
          </button>

          <button
            onClick={onOpenDistrictModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0f2042] hover:bg-red-700 rounded-full transition-colors shadow-xs"
          >
            <span>জেলা সংবাদ</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Breaking News Ticker Bar */}
      {settings?.breakingNewsEnabled !== false && activeBreakingItems.length > 0 && (
        <div
          className="w-full text-xs font-medium flex items-center overflow-hidden border-y border-red-800 shadow-inner"
          style={{
            backgroundColor: settings?.breakingNewsBg || '#b91c1c',
            color: settings?.breakingNewsText || '#ffffff',
          }}
        >
          {/* Breaking Label */}
          <div className="bg-black/30 px-3.5 py-1.5 uppercase tracking-wider font-bold shrink-0 flex items-center gap-1.5 border-r border-white/20 z-10">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span className="text-white">ব্রেকিং নিউজ</span>
          </div>

          {/* Scrolling text marquee */}
          <div className="relative overflow-hidden w-full py-1.5 whitespace-nowrap">
            <div
              className="animate-marquee inline-flex space-x-12"
              style={{
                animationDuration: `${settings?.breakingNewsSpeed || 35}s`,
              }}
            >
              {activeBreakingItems.concat(activeBreakingItems).map((item, idx) => (
                <span
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (item.link && onSelectArticleById) {
                      onSelectArticleById(item.link.replace(/^\/[^/]+\//, ''));
                    }
                  }}
                  className="cursor-pointer hover:underline inline-flex items-center gap-2"
                >
                  <span className="opacity-75">✦</span>
                  <span>{item.title}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Category Navigation Bar */}
      <nav className="bg-[#0f2042] text-white overflow-x-auto no-scrollbar border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 min-w-max">
          {categories.map((cat) => {
            const isActive =
              activeCategory === cat.slug || (activeCategory === '' && cat.slug === 'home');
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-red-700 font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-4 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0a1931] flex items-center justify-center text-white font-bold text-sm">
                  দি
                </div>
                <span className="font-bold text-slate-800 font-serif-bn text-lg">দিগন্ত বার্তা</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-600 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                সংবাদ বিভাগসমূহ
              </p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                      activeCategory === cat.slug
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenDistrictModal) onOpenDistrictModal();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded text-center"
              >
                📍 জেলা সংবাদ অনুসন্ধান
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded text-center"
              >
                বার্তা কক্ষ ও অ্যাডমিন প্যানেল
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

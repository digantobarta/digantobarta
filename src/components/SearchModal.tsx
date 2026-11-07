import React, { useState } from 'react';
import { NewsArticle, Category } from '../types/index.ts';
import { NewsCard } from './NewsCard.tsx';
import { Search, X, Filter, Sparkles, Clock, Calendar } from 'lucide-react';

interface SearchModalProps {
  articles: NewsArticle[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  articles,
  categories,
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  if (!isOpen) return null;

  const popularSearches = [
    'ডিজিটাল অর্থনীতি',
    'চ্যাম্পিয়ন্স ট্রফি',
    'মাতারবাড়ী',
    'খুলনা',
    'নির্বাচন কমিশন',
    'এআই প্রযুক্তি',
  ];

  const results = articles.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
      a.content.toLowerCase().includes(q) ||
      a.reporterName.toLowerCase().includes(q) ||
      (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  if (sortBy === 'popular') {
    results.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    results.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        {/* Header Search Input */}
        <div className="p-4 sm:p-6 bg-[#0a1931] text-white">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-bold font-serif-bn">সংবাদ অনুসন্ধান</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিরোনাম, মূল শব্দ, প্রতিবেদক বা জেলা দিয়ে খুঁজুন..."
              className="w-full bg-slate-800/90 text-white placeholder-slate-400 pl-11 pr-10 py-3 rounded-xl border border-slate-700 focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick search suggestion tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="text-slate-400">জনপ্রিয় অনুসন্ধান:</span>
            {popularSearches.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(tag)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">বিভাগ:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-600"
            >
              <option value="all">সব বিভাগ</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">ক্রম:</span>
            <button
              onClick={() => setSortBy('latest')}
              className={`px-2.5 py-1 rounded-lg ${
                sortBy === 'latest' ? 'bg-[#0f2042] text-white font-bold' : 'bg-white text-slate-600 border'
              }`}
            >
              সর্বশেষ
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-lg ${
                sortBy === 'popular' ? 'bg-[#0f2042] text-white font-bold' : 'bg-white text-slate-600 border'
              }`}
            >
              সর্বাধিক পঠিত
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-500 mb-4 font-medium">
            {results.length} টি ফলাফল পাওয়া গেছে
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">কোনো সংবাদ খুঁজে পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">ভিন্ন শব্দ বা বিভাগ পরিবর্তন করে চেষ্টা করুন</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="horizontal"
                  onClick={() => {
                    onClose();
                    onSelectArticle(art);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

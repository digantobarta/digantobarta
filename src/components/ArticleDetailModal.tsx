import React, { useState, useEffect } from 'react';
import { NewsArticle, AdCampaign } from '../types/index.ts';
import { formatBengaliDate, toBengaliNumber, formatTimeAgoBengali } from '../utils/bengaliUtils.ts';
import { AdBanner } from './AdBanner.tsx';
import { NewsCard } from './NewsCard.tsx';
import {
  X,
  Share2,
  Printer,
  Copy,
  Check,
  Clock,
  Eye,
  Calendar,
  User,
  Sparkles,
  MessageSquare,
  Send,
  Bookmark,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Flame,
  ThumbsUp,
  Download,
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: NewsArticle;
  allArticles: NewsArticle[];
  ads: AdCampaign[];
  onClose: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  allArticles,
  ads,
  onClose,
  onSelectArticle,
}) => {
  const [copied, setCopied] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [comments, setComments] = useState<
    { id: string; name: string; text: string; time: string; likes: number }[]
  >([
    {
      id: 'c-1',
      name: 'ড. মো. শাহ আলম',
      text: 'খুবই সময়োপযোগী ও বস্তুনিষ্ঠ প্রতিবেদন। দিগন্ত বার্তাকে অভিনন্দন জানাই।',
      time: '১ ঘণ্টা আগে',
      likes: 12,
    },
    {
      id: 'c-2',
      name: 'ফারহানা চৌধুরী',
      text: 'তথ্যের উৎস ও নিরপেক্ষতা বজায় রাখায় এ ধরনের রিপোর্ট সবার পড়া উচিত।',
      time: '৩০ মিনিট আগে',
      likes: 5,
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target) {
        const total = target.scrollHeight - target.clientHeight;
        const current = target.scrollTop;
        if (total > 0) {
          setScrollProgress((current / total) * 100);
        }
      }
    };

    const container = document.getElementById('article-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setComments([
      {
        id: `c-${Date.now()}`,
        name: newCommentName.trim() || 'সম্মানিত পাঠক',
        text: newCommentText.trim(),
        time: 'এইমাত্র',
        likes: 0,
      },
      ...comments,
    ]);
    setNewCommentText('');
    setNewCommentName('');
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 4);

  const mostReadArticles = [...allArticles]
    .filter((a) => a.id !== article.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const fontClass =
    textSize === 'large' ? 'text-lg leading-relaxed' : textSize === 'xlarge' ? 'text-xl leading-loose' : 'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-start overflow-hidden">
      {/* Top Reading Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 z-60">
        <div
          className="h-full bg-red-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navigation Top Header in Article View */}
      <div className="bg-[#0a1931] text-white px-4 py-2.5 flex items-center justify-between shadow-md shrink-0 border-b border-slate-700">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল পাতায় ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Text Size Control */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 mr-2">
            <button
              onClick={() => setTextSize('normal')}
              className={`px-2 py-0.5 text-xs rounded ${
                textSize === 'normal' ? 'bg-red-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="স্বাভাবিক ফন্ট"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-2 py-0.5 text-xs rounded ${
                textSize === 'large' ? 'bg-red-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="বড় ফন্ট"
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-2 py-0.5 text-xs rounded ${
                textSize === 'xlarge' ? 'bg-red-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="অতি বৃহৎ ফন্ট"
            >
              A++
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors relative"
            title="লিংক কপি করুন"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors ml-2"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Article Content */}
      <div
        id="article-scroll-container"
        className="flex-1 overflow-y-auto bg-slate-100/90 py-6 px-4"
      >
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Top Leaderboard Ad */}
          <div className="px-6 pt-4">
            <AdBanner placement="article_top" ads={ads} />
          </div>

          <div className="p-6 sm:p-10">
            {/* Category, Division & District Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-red-700 uppercase tracking-wider mb-3">
              <span>{article.categoryName}</span>
              {article.district && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600">{article.district}</span>
                </>
              )}
              {article.isBreaking && (
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded shadow-xs ml-2">
                  ব্রেকিং নিউজ
                </span>
              )}
              {article.aiGenerated && (
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ml-auto">
                  <Sparkles className="w-3 h-3" />
                  <span>এআই গবেষণা সংকলন (সম্পাদকীয় অনুমোদিত)</span>
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1931] font-serif-bn leading-tight tracking-tight mb-3">
              {article.title}
            </h1>

            {/* Subheadline */}
            {article.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-medium mb-6 leading-snug border-l-4 border-red-600 pl-3">
                {article.subtitle}
              </p>
            )}

            {/* Author and Date Metadata Card */}
            <div className="flex flex-wrap items-center justify-between py-4 border-y border-slate-200 mb-6 gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 border border-slate-300 overflow-hidden">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{article.reporterName}</p>
                  <p className="text-slate-500">
                    {article.reporterRole || 'প্রতিবেদক'} | {article.source}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <span>প্রকাশ: {formatBengaliDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>
                    <Clock className="w-3 h-3 inline mr-1" />
                    পাঠের সময়: {toBengaliNumber(article.readingTime || 3)} মিনিট
                  </span>
                  <span>
                    <Eye className="w-3 h-3 inline mr-1" />
                    {toBengaliNumber(article.views || 0)} ভিউ
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-6 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 mr-2 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-red-600" />
                <span>শেয়ার করুন:</span>
              </span>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span>Facebook</span>
              </a>

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  article.title + ' ' + shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span>WhatsApp</span>
              </a>

              {/* X / Twitter Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  article.title
                )}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-black hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span>X (Twitter)</span>
              </a>

              {/* Telegram Share */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span>Telegram</span>
              </a>

              {/* Native / Copy Share */}
              <button
                onClick={handleNativeShare}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium flex items-center gap-1 transition-colors ml-auto"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <div className="rounded-xl overflow-hidden bg-slate-100 max-h-[500px]">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.imageCaption && (
                <p className="text-xs text-slate-500 italic mt-2 text-center">
                  {article.imageCaption}
                </p>
              )}
            </div>

            {/* Main Article Body Content */}
            <div className={`text-slate-800 space-y-4 font-sans ${fontClass}`}>
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* In-Article Advertisement */}
            <div className="my-8">
              <AdBanner placement="article_inline" ads={ads} />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  সম্পর্কিত বিষয়াবলী:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Correction History Note (If any) */}
            {article.correctionHistory && article.correctionHistory.length > 0 && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <span className="font-bold">সংশোধন ইতিহাস:</span>
                {article.correctionHistory.map((item, idx) => (
                  <p key={idx} className="mt-1">
                    {item.date}: {item.note}
                  </p>
                ))}
              </div>
            )}

            {/* Bottom Ad */}
            <AdBanner placement="article_bottom" ads={ads} />

            {/* Interactive Comment & Discussion Section */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900 font-serif-bn">
                  পাঠকের মন্তব্য ({toBengaliNumber(comments.length)})
                </h3>
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleAddComment} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    placeholder="আপনার নাম (ঐচ্ছিক)"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-red-600 focus:outline-hidden"
                  />
                </div>
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="এই সংবাদের বিষয়ে আপনার সুচিন্তিত মতামত লিখুন..."
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-red-600 focus:outline-hidden resize-none mb-3"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>মন্তব্য প্রকাশ করুন</span>
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-800">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                      <button
                        onClick={() => {
                          setComments(
                            comments.map((item) =>
                              item.id === c.id ? { ...item, likes: item.likes + 1 } : item
                            )
                          );
                        }}
                        className="hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>পছন্দ ({toBengaliNumber(c.likes)})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related News Section */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 font-serif-bn mb-4">
                  একই বিভাগের আরও খবর
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((rel) => (
                    <NewsCard
                      key={rel.id}
                      article={rel}
                      variant="horizontal"
                      onClick={() => onSelectArticle(rel)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

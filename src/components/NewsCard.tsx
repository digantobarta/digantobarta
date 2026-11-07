import React from 'react';
import { NewsArticle } from '../types/index.ts';
import { formatTimeAgoBengali, toBengaliNumber } from '../utils/bengaliUtils.ts';
import { Clock, Eye, Flame, Award, User, Sparkles } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'lead' | 'standard' | 'horizontal' | 'compact' | 'opinion';
  onClick: () => void;
  priorityIndex?: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'standard',
  onClick,
  priorityIndex,
}) => {
  const isLead = variant === 'lead';
  const isHorizontal = variant === 'horizontal';
  const isCompact = variant === 'compact';
  const isOpinion = variant === 'opinion';

  if (isCompact) {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 px-2 rounded transition-colors"
      >
        <div className="flex items-start gap-2.5">
          {priorityIndex !== undefined && (
            <span className="text-xl font-bold font-serif-bn text-slate-300 group-hover:text-red-600 transition-colors shrink-0">
              {toBengaliNumber(priorityIndex)}
            </span>
          )}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="text-red-700 font-medium">{article.categoryName}</span>
              <span>•</span>
              <span>{formatTimeAgoBengali(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isHorizontal) {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer flex flex-col sm:flex-row gap-3.5 p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all"
      >
        <div className="sm:w-44 h-32 shrink-0 overflow-hidden rounded relative bg-slate-100">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              ব্রেকিং
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-red-700 font-bold">{article.categoryName}</span>
              {article.district && (
                <span className="text-slate-500 font-medium">| {article.district}</span>
              )}
              {article.aiGenerated && (
                <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.2 rounded border border-blue-200 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>এআই যাচাই</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">{article.reporterName}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgoBengali(article.publishedAt)}
              </span>
              <span>•</span>
              <span>{toBengaliNumber(article.readingTime || 3)} মিনিট পাঠ</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isOpinion) {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-red-200 hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-xs">
            <img
              src={article.featuredImage}
              alt={article.reporterName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {article.reporterName}
            </h4>
            <p className="text-xs text-slate-500">{article.reporterRole || 'কলাম লেখক'}</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-red-700 font-semibold">{article.categoryName}</span>
          <span>{formatTimeAgoBengali(article.publishedAt)}</span>
        </div>
      </div>
    );
  }

  if (isLead) {
    return (
      <div
        onClick={onClick}
        className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
      >
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
              {article.categoryName}
            </span>
            {article.isBreaking && (
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5 text-red-700 fill-current" />
                ব্রেকিং
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif-bn leading-tight group-hover:text-red-400 transition-colors drop-shadow-md">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 drop-shadow-sm font-medium">
                {article.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-red-600" />
              <span className="font-semibold text-slate-800">{article.reporterName}</span>
              <span className="text-slate-400">({article.source})</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTimeAgoBengali(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {toBengaliNumber(article.views || 0)} ভিউ
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
    >
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-[#0a1931]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {article.categoryName}
            </span>
          </div>
          {article.isBreaking && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              ব্রেকিং
            </span>
          )}
        </div>

        <div className="p-3.5">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="p-3.5 pt-0 mt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="text-slate-600 font-medium truncate max-w-[120px]">
            {article.reporterName}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {formatTimeAgoBengali(article.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

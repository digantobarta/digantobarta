import React, { useState } from 'react';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshGeo.ts';
import { NewsArticle } from '../types/index.ts';
import { NewsCard } from './NewsCard.tsx';
import { MapPin, X, ChevronRight, Navigation } from 'lucide-react';

interface DistrictSelectorProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  articles,
  onSelectArticle,
  isOpen = false,
  onClose,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const currentDivisionData = BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivision);

  const filteredArticles = articles.filter((a) => {
    if (selectedDivision !== 'all' && a.division !== selectedDivision) return false;
    if (selectedDistrict !== 'all' && a.district !== selectedDistrict) return false;
    return true;
  });

  const content = (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0a1931] font-serif-bn">
              সারাদেশ ও জেলাভিত্তিক সংবাদ
            </h2>
            <p className="text-xs text-slate-500">
              বাংলাদেশের ৮ বিভাগ ও ৬৪ জেলার সত্যনিষ্ঠ আঞ্চলিক সংবাদ
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Division Selector Buttons */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          বিভাগ নির্বাচন করুন:
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedDivision('all');
              setSelectedDistrict('all');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              selectedDivision === 'all'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সব বিভাগ
          </button>
          {BANGLADESH_DIVISIONS.map((div) => (
            <button
              key={div.id}
              onClick={() => {
                setSelectedDivision(div.id);
                setSelectedDistrict('all');
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                selectedDivision === div.id
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {div.name}
            </button>
          ))}
        </div>
      </div>

      {/* District Selector (If division chosen) */}
      {currentDivisionData && (
        <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            {currentDivisionData.name} বিভাগের জেলাসমূহ:
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedDistrict('all')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                selectedDistrict === 'all'
                  ? 'bg-[#0f2042] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              সব জেলা
            </button>
            {currentDivisionData.districts.map((dist) => (
              <button
                key={dist.id}
                onClick={() => setSelectedDistrict(dist.id)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  selectedDistrict === dist.id
                    ? 'bg-[#0f2042] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {dist.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>নির্বাচিত এলাকার সংবাদ</span>
            <span className="text-xs font-normal text-slate-500">
              ({filteredArticles.length} টি সংবাদ পাওয়া গেছে)
            </span>
          </h3>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <Navigation className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              এই এলাকায় বর্তমানে কোনো সংবাদ নেই
            </p>
            <p className="text-xs text-slate-500 mt-1">
              অন্য বিভাগ বা জেলা নির্বাচন করে সংবাদ দেখুন
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <NewsCard
                key={art.id}
                article={art}
                variant="standard"
                onClick={() => {
                  if (onClose) onClose();
                  onSelectArticle(art);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (onClose && isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto rounded-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

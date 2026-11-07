import React, { useEffect, useRef } from 'react';
import { AdCampaign, AdPlacement } from '../types/index.ts';

interface AdBannerProps {
  placement: AdPlacement;
  ads: AdCampaign[];
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, ads, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active ad for this placement
  const matchingAd = ads.find((a) => a.isActive && a.placement === placement);

  useEffect(() => {
    if (matchingAd?.id) {
      // Record impression once
      fetch(`/api/ads/${matchingAd.id}/impression`, { method: 'POST' }).catch(() => {});
    }
  }, [matchingAd?.id]);

  if (!matchingAd) {
    return null;
  }

  const handleClick = () => {
    if (matchingAd.id) {
      fetch(`/api/ads/${matchingAd.id}/click`, { method: 'POST' }).catch(() => {});
    }
    if (matchingAd.targetUrl) {
      window.open(matchingAd.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isAdsterraOrMonetag =
    matchingAd.type.startsWith('adsterra') || matchingAd.type.startsWith('monetag');

  return (
    <div className={`my-4 flex flex-col items-center justify-center ${className}`}>
      {/* Editorial Ad Label */}
      <div className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider mb-1 flex items-center gap-1">
        <span>বিজ্ঞাপন</span>
        {isAdsterraOrMonetag && <span className="text-[9px] text-slate-600">(স্পন্সরড পার্টনার)</span>}
      </div>

      {isAdsterraOrMonetag ? (
        <div
          ref={containerRef}
          className="w-full max-w-4xl min-h-[90px] bg-slate-100 rounded border border-slate-300 p-2 flex flex-col items-center justify-center text-center overflow-hidden"
        >
          {matchingAd.codeSnippet ? (
            <div
              className="text-xs text-slate-600 w-full"
              dangerouslySetInnerHTML={{ __html: matchingAd.codeSnippet }}
            />
          ) : (
            <div className="text-xs text-slate-500 py-4">
              <p className="font-semibold">{matchingAd.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {matchingAd.type.toUpperCase()} নেটওয়ার্ক স্লট সক্রিয় রয়েছে
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Direct Commercial Ad Banner */
        <div
          onClick={handleClick}
          className="cursor-pointer group relative overflow-hidden rounded-md border border-slate-200 shadow-xs max-w-4xl w-full bg-slate-50 hover:opacity-95 transition-all"
        >
          {matchingAd.imageUrl ? (
            <img
              src={matchingAd.imageUrl}
              alt={matchingAd.name}
              className="w-full max-h-[140px] object-cover sm:object-contain mx-auto"
              loading="lazy"
            />
          ) : (
            <div className="py-6 px-4 bg-gradient-to-r from-slate-900 to-[#0a1931] text-white text-center">
              <h4 className="font-bold text-sm sm:text-base">{matchingAd.name}</h4>
              <p className="text-xs text-slate-300 mt-1">{matchingAd.advertiser}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

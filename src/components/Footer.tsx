import React from 'react';
import { SiteSettings, Category } from '../types/index.ts';
import { Phone, Mail, MapPin, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings | null;
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenStaticPage: (page: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onSelectCategory,
  onOpenStaticPage,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#0a1931] text-slate-300 border-t-4 border-red-700 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Grid: Brand & Leadership & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand Info & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xl font-serif-bn shadow-md">
                দি
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif-bn">দিগন্ত বার্তা</h3>
                <p className="text-xs text-red-400 font-medium">DIGANTA BARTA</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {settings?.tagline || 'সত্যের সন্ধানে, আগামীর পথে'} — নিরপেক্ষতা, নির্ভুলতা ও জাতীয়
              স্বার্থের প্রতি দায়বদ্ধ আধুনিক বাংলাদেশি ডিজিটাল সংবাদ প্রতিষ্ঠান।
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{settings?.address || 'তোপখানা রোড, ঢাকা-১০০০, বাংলাদেশ'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>{settings?.email || 'contact@digantabarta.com'}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Official Editorial Board */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>সম্পাদকীয় নেতৃত্ব ও পরিচালনা</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">সম্পাদক ও প্রকাশক:</p>
                <p className="text-white font-bold text-sm">
                  {settings?.publisher || 'নুসরাত জাহান'}
                </p>
                <a
                  href={`tel:${settings?.publisherPhone || '+8801568840139'}`}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{settings?.publisherPhone || '+8801568840139'}</span>
                </a>
              </div>

              <div>
                <p className="text-slate-400 font-medium">নির্বাহী সম্পাদক:</p>
                <p className="text-white font-semibold">
                  {settings?.executiveEditor || 'কামরুজ্জামান খান'}
                </p>
                <a
                  href={`tel:${settings?.executiveEditorPhone || '+8801752038853'}`}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{settings?.executiveEditorPhone || '+8801752038853'}</span>
                </a>
              </div>

              <div>
                <p className="text-slate-400 font-medium">বার্তা সম্পাদক:</p>
                <p className="text-white font-semibold">
                  {settings?.newsEditor || 'সামিয়া জামান'}
                </p>
                <a
                  href={`tel:${settings?.newsEditorPhone || '+8801972038853'}`}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{settings?.newsEditorPhone || '+8801972038853'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
              প্রধান বিভাগসমূহ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="text-left text-slate-400 hover:text-white transition-colors py-1"
                >
                  ✦ {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Institutional & Legal Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
              নীতিমালা ও প্রাতিষ্ঠানিক
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenStaticPage('about')}
                  className="hover:text-white transition-colors"
                >
                  আমাদের সম্পর্কে (About Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('editorial-policy')}
                  className="hover:text-white transition-colors"
                >
                  সম্পাদকীয় ও তথ্যযাচাই নীতি (Editorial Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('corrections-policy')}
                  className="hover:text-white transition-colors"
                >
                  সংশোধনী নীতি (Corrections Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('privacy-policy')}
                  className="hover:text-white transition-colors"
                >
                  গোপনীয়তা ও কুকি নীতি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('terms')}
                  className="hover:text-white transition-colors"
                >
                  ব্যবহারের শর্তাবলী (Terms of Service)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('ad-policy')}
                  className="hover:text-white transition-colors"
                >
                  বিজ্ঞাপন নীতিমালা ও হার (Ad Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStaticPage('contact')}
                  className="hover:text-white transition-colors"
                >
                  যোগাযোগ ও প্রেস রিলিজ প্রেরণ (Contact Us)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  অ্যাডমিন ও সিএমএস লগইন (Admin Login)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} দিগন্ত বার্তা (DIGANTA BARTA) | সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-center sm:text-right">
            প্রকাশিত কোনো সংবাদ বা ছবি অনুমতি ছাড়া ব্যবহার আইনত দণ্ডনীয়।
          </p>
        </div>
      </div>
    </footer>
  );
};

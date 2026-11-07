import React from 'react';
import { SiteSettings } from '../types/index.ts';
import { X, Award, Phone, Mail, MapPin, Shield, CheckCircle, Scale, FileText } from 'lucide-react';

interface StaticPageModalProps {
  pageType: string;
  settings: SiteSettings | null;
  onClose: () => void;
}

export const StaticPageModal: React.FC<StaticPageModalProps> = ({ pageType, settings, onClose }) => {
  const getPageContent = () => {
    switch (pageType) {
      case 'about':
        return {
          title: 'আমাদের সম্পর্কে (About Us)',
          icon: <Award className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>দিগন্ত বার্তা (DIGANTA BARTA)</strong> — বাংলাদেশের একটি আধুনিক, নিরপেক্ষ ও
                বস্তুনিষ্ঠ ডিজিটাল সংবাদমাধ্যম। আমাদের স্লোগান:{' '}
                <em>"সত্যের সন্ধানে, আগামীর পথে"</em>।
              </p>
              <p>
                আমাদের মূল লক্ষ্য বাংলাদেশের জাতীয় উন্নয়ন, গণতন্ত্র, আইনের শাসন, অর্থনৈতিক প্রবৃদ্ধি
                এবং তৃণমূল জনগণের অধিকারের পক্ষে সোচ্চার থাকা। সাংবাদিকতার মৌলিক নীতি ও মূল্যবোধে
                অটল থেকে আমরা নির্ভুল, দ্রুত ও দায়িত্বশীল সংবাদ উপস্থাপন করি।
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6">
                <h4 className="font-bold text-slate-900 mb-2">আমাদের মূল অঙ্গীকার:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                  <li>নির্ভুল ও যাচাইকৃত তথ্যের অগ্রাধিকার।</li>
                  <li>কোনো রাজনৈতিক দল বা বিশেষ গোষ্ঠীর প্রভাবমুক্ত নিরপেক্ষ দৃষ্টিভঙ্গি।</li>
                  <li>তৃণমূল ও ৬৪ জেলার মানুষের সমস্যা ও সম্ভাবনার তুলে ধরা।</li>
                  <li>দায়িত্বশীল এআই প্রযুক্তির ব্যবহার—মানবীয় সম্পাদনার অধীনে।</li>
                </ul>
              </div>
            </div>
          ),
        };

      case 'editorial-policy':
        return {
          title: 'সম্পাদকীয় ও তথ্যযাচাই নীতি (Editorial Policy)',
          icon: <Shield className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                দিগন্ত বার্তা কঠোরভাবে প্রেস কাউন্সিল আইন এবং আন্তর্জাতিক সাংবাদিকতার কোড অব এথিক্স
                অনুসরণ করে।
              </p>
              <h4 className="font-bold text-slate-900 mt-4">১. তথ্য যাচাইকরণ (Fact-Checking):</h4>
              <p>
                প্রতিটি সংবাদ অন্তত দুটি স্বাধীন ও নির্ভরযোগ্য উৎসের মাধ্যমে যাচাই করা হয়। কোনো
                অসমর্থিত দাবি বা সামাজিক যোগাযোগমাধ্যমের গুজব সরাসরি সংবাদ হিসেবে পরিবেশন করা হয় না।
              </p>
              <h4 className="font-bold text-slate-900 mt-4">২. এআই নীতিমালা (AI Newsroom Guidelines):</h4>
              <p>
                আমাদের এআই রিসার্চ ইঞ্জিন শুধুমাত্র তথ্য আবিষ্কার ও সংক্ষেপণে সহায়তা করে। কোনো
                এআই-সৃষ্ট উপাদান জ্যেষ্ঠ বার্তা সম্পাদক এবং নির্বাহী সম্পাদকের অনুমোদন ব্যতীত কখনোই
                ওয়েবসাইটে প্রকাশিত হয় না। এআইকে কখনোই কাল্পনিক তথ্য, উক্তি বা তারিখ উদ্ভাবনের অনুমতি
                দেওয়া হয় না।
              </p>
            </div>
          ),
        };

      case 'corrections-policy':
        return {
          title: 'সংশোধনী নীতি (Corrections Policy)',
          icon: <CheckCircle className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                দিগন্ত বার্তা ভুলের তাৎক্ষণিক ও স্বচ্ছ সংশোধনে বিশ্বাস করে। যদি কোনো প্রতিবেদনে
                অনিচ্ছাকৃত তথ্যগত ত্রুটি পরিলক্ষিত হয়, তবে তা চিহ্নিত হওয়ার সাথে সাথে সংশোধন করা
                হয়।
              </p>
              <p>
                সংশোধিত সংবাদের নিচে স্পষ্টভাবে "সংশোধন ইতিহাস" উল্লেখ করা হয়, যাতে পাঠকদের কাছে
                স্বচ্ছতা শতভাগ নিশ্চিত থাকে।
              </p>
              <p className="text-xs text-slate-500">
                ভুল সংশোধনের নোটিশ পাঠাতে পারেন: <code>corrections@digantabarta.com</code>
              </p>
            </div>
          ),
        };

      case 'contact':
        return {
          title: 'যোগাযোগ ও সম্পাদকীয় দপ্তর (Contact Us)',
          icon: <Phone className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-6 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">সম্পাদক ও প্রকাশক</p>
                  <p className="font-bold text-slate-900 text-base mt-1">
                    {settings?.publisher || 'নুসরাত জাহান'}
                  </p>
                  <a
                    href={`tel:${settings?.publisherPhone || '+8801568840139'}`}
                    className="text-red-700 font-medium text-xs flex items-center gap-1 mt-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{settings?.publisherPhone || '+8801568840139'}</span>
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">নির্বাহী সম্পাদক</p>
                  <p className="font-bold text-slate-900 text-base mt-1">
                    {settings?.executiveEditor || 'কামরুজ্জামান খান'}
                  </p>
                  <a
                    href={`tel:${settings?.executiveEditorPhone || '+8801752038853'}`}
                    className="text-red-700 font-medium text-xs flex items-center gap-1 mt-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{settings?.executiveEditorPhone || '+8801752038853'}</span>
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">বার্তা সম্পাদক</p>
                  <p className="font-bold text-slate-900 text-base mt-1">
                    {settings?.newsEditor || 'সামিয়া জামান'}
                  </p>
                  <a
                    href={`tel:${settings?.newsEditorPhone || '+8801972038853'}`}
                    className="text-red-700 font-medium text-xs flex items-center gap-1 mt-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{settings?.newsEditorPhone || '+8801972038853'}</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{settings?.address || 'প্রেস ক্লাব রোড, তোপখানা রোড, ঢাকা-১০০০, বাংলাদেশ'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span>{settings?.email || 'contact@digantabarta.com'}</span>
                </p>
              </div>
            </div>
          ),
        };

      case 'privacy-policy':
        return {
          title: 'গোপনীয়তা নীতি (Privacy Policy)',
          icon: <Scale className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                দিগন্ত বার্তা পাঠকদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। আমরা
                কোনো অননুমোদিত তৃতীয় পক্ষের কাছে পাঠকদের ব্যক্তিগত তথ্য বা ব্রাউজিং ইতিহাস বিক্রি বা
                হস্তান্তর করি না।
              </p>
              <h4 className="font-bold text-slate-900">বিজ্ঞাপন ও অ্যানালিটিক্স:</h4>
              <p>
                ওয়েবসাইট পারফরম্যান্স উন্নত করতে আমরা গুগল অ্যানালিটিক্স এবং বিশ্বস্ত পার্টনারদের
                বিজ্ঞাপন নেটওয়ার্ক (যেমন Adsterra, Monetag) ব্যবহার করতে পারি যা স্ট্যান্ডার্ড
                শিল্প-নিয়ম অনুযায়ী কুকিজ ব্যবহার করে।
              </p>
            </div>
          ),
        };

      default:
        return {
          title: 'ব্যবহারের শর্তাবলী ও নীতিমালা',
          icon: <FileText className="w-6 h-6 text-red-600" />,
          content: (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                দিগন্ত বার্তা পোর্টালে প্রকাশিত সকল লিখিত সংবাদ, ছবি ও ভিডিও প্রকাশনা কর্তৃপক্ষের
                মেধাসম্পদ। অনুমতি ছাড়া এর কোনো অংশ পুনরুৎপাদন করা আইনত দণ্ডনীয়।
              </p>
            </div>
          ),
        };
    }
  };

  const { title, icon, content } = getPageContent();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="p-5 bg-[#0a1931] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-bold font-serif-bn">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{content}</div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f2042] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

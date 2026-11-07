import fs from 'fs';
import path from 'path';
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
  SystemNotification,
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  articles: NewsArticle[];
  breakingNews: BreakingNewsItem[];
  categories: Category[];
  ads: AdCampaign[];
  aiDrafts: AIDraft[];
  media: MediaItem[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  users: User[];
  notifications: SystemNotification[];
}

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'দিগন্ত বার্তা',
  siteNameEn: 'DIGANTA BARTA',
  tagline: 'সত্যের সন্ধানে, আগামীর পথে',
  publisher: 'নুসরাত জাহান',
  publisherPhone: '+8801568840139',
  executiveEditor: 'কামরুজ্জামান খান',
  executiveEditorPhone: '+8801752038853',
  newsEditor: 'সামিয়া জামান',
  newsEditorPhone: '+8801972038853',
  address: 'প্রেস ক্লাব রোড, তোপখানা রোড, ঢাকা-১০০০, বাংলাদেশ',
  email: 'contact@digantabarta.com',
  breakingNewsSpeed: 30,
  breakingNewsEnabled: true,
  breakingNewsBg: '#b91c1c',
  breakingNewsText: '#ffffff',
  socialLinks: {
    facebook: 'https://facebook.com/digantabarta',
    twitter: 'https://twitter.com/digantabarta',
    youtube: 'https://youtube.com/@digantabarta',
    telegram: 'https://t.me/digantabarta',
    whatsapp: 'https://wa.me/8801568840139',
    linkedin: 'https://linkedin.com/company/digantabarta',
  },
  seo: {
    metaTitle: 'দিগন্ত বার্তা | সত্যের সন্ধানে, আগামীর পথে - শীর্ষ ডিজিটাল সংবাদ মাধ্যম',
    metaDescription: 'বাংলাদেশের নিরপেক্ষ ও বস্তুনিষ্ঠ ২৪/৭ অনলাইন সংবাদ পোর্টাল। জাতীয়, রাজনীতি, আন্তর্জাতিক, অর্থনীতি, খেলাধুলা ও জেলাভিত্তিক সর্বশেষ খবর।',
    keywords: 'দিগন্ত বার্তা, বাংলাদেশ সংবাদ, বাংলা নিউজ, Diganta Barta, Bangladesh News, Dhaka News',
    googleAnalyticsId: 'G-DGBARTA2026',
    googleSearchConsoleTag: 'gsc-diganta-verification-token',
  },
};

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'নুসরাত জাহান',
    email: 'khulnanusratjahan@gmail.com',
    role: 'Super Admin',
    phone: '+8801568840139',
    designation: 'সম্পাদক ও প্রকাশক',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'সাংবাদিকতায় ১৫ বছরের অভিজ্ঞতা। দিগন্ত বার্তার প্রতিষ্ঠাতা ও প্রধান সম্পাদক।',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'user-2',
    name: 'কামরুজ্জামান খান',
    email: 'kamruzzaman@digantabarta.com',
    role: 'Executive Editor',
    phone: '+8801752038853',
    designation: 'নির্বাহী সম্পাদক',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'জাতীয় ও আন্তর্জাতিক ভূরাজনীতি বিষয়ক জ্যেষ্ঠ বিশ্লেষক।',
  },
  {
    id: 'user-3',
    name: 'সামিয়া জামান',
    email: 'samia@digantabarta.com',
    role: 'News Editor',
    phone: '+8801972038853',
    designation: 'বার্তা সম্পাদক',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    bio: 'সারাদেশ ও অনুসন্ধানী প্রতিবেদনের সমন্বয়কারী।',
  },
  {
    id: 'user-4',
    name: 'তানভীর আহমেদ',
    email: 'tanvir@digantabarta.com',
    role: 'Reporter',
    phone: '+8801812345678',
    designation: 'জ্যেষ্ঠ প্রতিবেদক (সংসদ ও সচিবালয়)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-5',
    name: 'রফিকুল ইসলাম',
    email: 'ads@digantabarta.com',
    role: 'Advertising Manager',
    phone: '+8801712345678',
    designation: 'বাণিজ্যিক ও বিজ্ঞাপন ব্যবস্থাপক',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'প্রচ্ছদ', slug: 'home', order: 1 },
  { id: '2', name: 'জাতীয়', slug: 'national', order: 2, subcategories: ['সংসদ', 'প্রশাসন', 'রাজধানী', 'আদালত'] },
  { id: '3', name: 'রাজনীতি', slug: 'politics', order: 3, subcategories: ['আওয়ামী লীগ', 'বিএনপি', 'জামায়াত', 'অন্যান্য দল'] },
  { id: '4', name: 'আন্তর্জাতিক', slug: 'international', order: 4, subcategories: ['দক্ষিণ এশিয়া', 'মধ্যপ্রাচ্য', 'ইউরোপ', 'আমেরিকা'] },
  { id: '5', name: 'অর্থনীতি', slug: 'economy', order: 5, subcategories: ['ব্যাংক ও বীমা', 'শেয়ারবাজার', 'বাণিজ্য', 'বাজেট'] },
  { id: '6', name: 'সারাদেশ', slug: 'countrywide', order: 6 },
  { id: '7', name: 'জেলা সংবাদ', slug: 'district', order: 7 },
  { id: '8', name: 'অপরাধ', slug: 'crime', order: 8, subcategories: ['দুর্নীতি', 'আইনশৃঙ্খলা', 'অভিযান'] },
  { id: '9', name: 'শিক্ষা', slug: 'education', order: 9, subcategories: ['বিশ্ববিদ্যালয়', 'ভর্তি পরীক্ষা', 'প্রাথমিক ও মাধ্যমিক'] },
  { id: '10', name: 'স্বাস্থ্য', slug: 'health', order: 10, subcategories: ['করোনা ও ডেঙ্গু', 'চিকিৎসা বিজ্ঞান', 'পুষ্টি ও জীবনধারা'] },
  { id: '11', name: 'বিজ্ঞান ও প্রযুক্তি', slug: 'tech', order: 11, subcategories: ['এআই ও সফটওয়্যার', 'টেলিকম', 'গ্যাজেট'] },
  { id: '12', name: 'পরিবেশ ও জলবায়ু', slug: 'environment', order: 12, subcategories: ['নদী ও বন', 'বৈশ্বিক উষ্ণায়ন', 'দূষণ'] },
  { id: '13', name: 'খেলাধুলা', slug: 'sports', order: 13, subcategories: ['ক্রিকেট', 'ফুটবল', 'অন্যান্য খেলা'] },
  { id: '14', name: 'বিনোদন', slug: 'entertainment', order: 14, subcategories: ['চলচ্চিত্র', 'নাটক ও ওটিটি', 'সঙ্গীত'] },
  { id: '15', name: 'ধর্ম ও জীবন', slug: 'religion', order: 15, subcategories: ['ইসলামিক জীবন', 'অন্যান্য ধর্ম', 'নীতি ও মূল্যবোধ'] },
  { id: '16', name: 'মতামত', slug: 'opinion', order: 16, subcategories: ['সম্পাদকীয়', 'কলাম', 'বিশ্লেষণ'] },
  { id: '17', name: 'ফিচার', slug: 'features', order: 17, subcategories: ['ভ্রমণ', 'ঐতিহ্য', 'সফলতার গল্প'] },
  { id: '18', name: 'ভিডিও', slug: 'video', order: 18 },
  { id: '19', name: 'বাণিজ্যিক বিজ্ঞপ্তি', slug: 'notice', order: 19 },
];

const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'bn-1',
    title: 'জাতীয় অর্থনৈতিক পরিষদের নির্বাহী কমিটির (একনেক) গুরুত্বপূর্ণ বৈঠক অনুষ্ঠিত; নতুন ৯টি মেগা প্রকল্প অনুমোদন',
    link: '/national/ecnec-approves-nine-mega-projects',
    priority: 'urgent',
    isActive: true,
    createdAt: new Date().toISOString(),
    bgColor: '#b91c1c',
    textColor: '#ffffff',
  },
  {
    id: 'bn-2',
    title: 'বঙ্গোপসাগরে সৃষ্ট লঘুচাপের কারণে ৪ সমুদ্রবন্দরে ১ নম্বর সতর্কসংকেত বহাল',
    link: '/environment/bay-of-bengal-low-pressure-alert',
    priority: 'high',
    isActive: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    bgColor: '#1e3a8a',
    textColor: '#ffffff',
  },
  {
    id: 'bn-3',
    title: 'আইসিসি চ্যাম্পিয়ন্স ট্রফির প্রস্তুতি ম্যাচ: দুর্দান্ত জয় দিয়ে মিশন শুরু টাইগারদের',
    link: '/sports/tigers-win-champions-trophy-warmup',
    priority: 'normal',
    isActive: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    bgColor: '#065f46',
    textColor: '#ffffff',
  },
];

const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'ডিজিটাল অর্থনীতির বিকাশে নতুন পলিসি রূপরেখা ঘোষণা: ১০০ বিলিয়ন ডলারের রূপকল্প',
    subtitle: 'সচিবালয়ে অর্থনৈতিক উপদেষ্টা ও তথ্যপ্রযুক্তি বিশেষজ্ঞদের উচ্চপর্যায়ের যৌথ বৈঠক',
    slug: 'digital-economy-roadmap-bangladesh-vision',
    category: 'national',
    categoryName: 'জাতীয়',
    division: 'dhaka',
    district: 'dhaka',
    content: `বাংলাদেশের ভবিষ্যৎ অর্থনৈতিক সমৃদ্ধির মূল চালিকাশক্তি হিসেবে তথ্যপ্রযুক্তি খাতকে প্রাধান্য দিয়ে ২০৩৫ সালের মধ্যে ১০০ বিলিয়ন ডলারের ডিজিটাল অর্থনীতির রূপরেখা ঘোষণা করা হয়েছে।

আজ সকালে সচিবালয়ে পরিকল্পনা ও আইসিটি মন্ত্রণালয়ের উচ্চপর্যায়ের বৈঠক শেষে এক প্রেস ব্রিফিংয়ে এই তথ্য জানানো হয়। এতে সভাপতিত্ব করেন জাতীয় অর্থনৈতিক উপদেষ্টা পরিষদের সদস্যবৃন্দ।

নতুন এ নীতিমালার আওতায় কৃত্রিম বুদ্ধিমত্তা (AI), সেমিকন্ডাক্টর ডিজাইন, হাইপারস্কেল ডেটা সেন্টার এবং ফ্রিল্যান্সারদের সরাসরি আন্তর্জাতিক রেমিট্যান্স উত্তোলনের সুনির্দিষ্ট সুবিধা রাখা হয়েছে। একইসঙ্গে দেশের ৬৪ জেলায় আধুনিক হাই-টেক ইনকিউবেশন হাব নির্মাণের গতি আরও বৃদ্ধি করার সিদ্ধান্ত গৃহীত হয়।

প্রধান বক্তা বলেন, "আমাদের তরুণ প্রজন্মের মেধা ও উদ্ভাবনী শক্তিকে কাজে লাগিয়ে বৈশ্বিক ডিজিটাল মানচিত্রে বাংলাদেশকে একটি শীর্ষস্থানীয় রপ্তানিকারক দেশে রূপান্তর করাই মূল লক্ষ্য।"`,
    excerpt: 'বাংলাদেশের ডিজিটাল অর্থনীতি ২০৩৫ সালের মধ্যে ১০০ বিলিয়ন ডলারে উন্নীত করতে সমন্বিত নতুন জাতীয় রূপরেখা ও বিনিয়োগবান্ধব নীতি অনুমোদন করেছে সরকার।',
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'ডিজিটাল রূপান্তর ও ভবিষ্যৎ অর্থনীতি বিষয়ক জাতীয় সেমিনার। ছবি: দিগন্ত বার্তা',
    reporterName: 'তানভীর আহমেদ',
    reporterRole: 'জ্যেষ্ঠ অর্থনৈতিক প্রতিবেদক',
    reporterId: 'user-4',
    source: 'নিজস্ব প্রতিবেদক',
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    isEditorsChoice: true,
    isPinned: true,
    views: 4520,
    readingTime: 4,
    tags: ['ডিজিটাল বাংলাদেশ', 'অর্থনীতি', 'আইসিটি', 'মেগা প্রজেক্ট', 'সচিবালয়'],
    seoTitle: 'ডিজিটাল অর্থনীতির বিকাশে নতুন রূপরেখা ঘোষণা | দিগন্ত বার্তা',
    seoDescription: '২০৩৫ সালের মধ্যে ১০০ বিলিয়ন ডলার ডিজিটাল অর্থনীতি অর্জনের মহাপরিকল্পনা ঘোষণা করেছে সরকার। বিস্তারিত দিগন্ত বার্তায়।',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiGenerated: false,
    confidenceScore: 98,
  },
  {
    id: 'art-2',
    title: 'নির্বাচন কমিশন সংস্কারে অংশীজনদের সঙ্গে জাতীয় সংলাপে গুরুত্বপূর্ণ সুপারিশ',
    subtitle: 'স্বচ্ছতা, প্রযুক্তিভিত্তিক ভোটগ্রহণ এবং নির্বাচনী আচরণবিধিতে কঠোরতার প্রস্তাব',
    slug: 'election-commission-reform-national-dialogue',
    category: 'politics',
    categoryName: 'রাজনীতি',
    division: 'dhaka',
    district: 'dhaka',
    content: `নির্বাচন ব্যবস্থা সংস্কার কমিশনের আয়োজনে বিভিন্ন রাজনৈতিক দল, নাগরিক সমাজের প্রতিনিধি এবং জ্যেষ্ঠ সাংবাদিকদের সমন্বয়ে এক উন্মুক্ত সংলাপ অনুষ্ঠিত হয়েছে।

আলোচনায় অংশ নিয়ে বক্তারা নির্বাচন কমিশনকে স্বাধীন ও নিরপেক্ষ রাখার জন্য সাংবিধানিক প্রাতিষ্ঠানিকীকরণ নিশ্চিত করার ওপর গুরুত্ব আরোপ করেন। সংলাপে রাজনৈতিক দলগুলোর পক্ষ থেকে একাধিক যুগোপযোগী সংস্কার প্রস্তাব উপস্থাপন করা হয়।

বিশেষজ্ঞরা বলেন, একটি সুষ্ঠু ও অর্থবহ নির্বাচন অনুষ্ঠানের জন্য জনগণের ভোটাধিকার সুরক্ষার কোনো বিকল্প নেই। সংলাপের সুপারিশসমূহ শিগগিরই পূর্ণাঙ্গ প্রতিবেদন আকারে সরকারের কাছে জমা দেওয়া হবে।`,
    excerpt: 'নির্বাচন কমিশন সংস্কারে রাজনৈতিক দল ও সুশীল সমাজের যৌথ সংলাপে স্বাধীন কমিশন ও নির্বাচনী পরিবেশ নিশ্চিতের রূপরেখা উপস্থাপন।',
    featuredImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'নির্বাচনী সংস্কার কমিশনের মতবিনিময় সভা। ছবি: সংগৃহীত',
    reporterName: 'সামিয়া জামান',
    reporterRole: 'বার্তা সম্পাদক',
    reporterId: 'user-3',
    source: 'দিগন্ত বার্তা ডেস্ক',
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    isEditorsChoice: false,
    isPinned: false,
    views: 3180,
    readingTime: 3,
    tags: ['রাজনীতি', 'নির্বাচন কমিশন', 'সংস্কার', 'সংলাপ'],
    seoTitle: 'নির্বাচন কমিশন সংস্কারে জাতীয় সংলাপে গুরুত্বপূর্ণ সুপারিশ | দিগন্ত বার্তা',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'art-3',
    title: 'ভূ-রাজনীতি ও বাণিজ্য করিডোর: দক্ষিণ এশিয়ায় গভীর সমুদ্রবন্দরের নতুন কৌশলগত গুরুত্ব',
    subtitle: 'মাতারবাড়ী গভীর সমুদ্রবন্দরকে কেন্দ্র করে বৈশ্বিক শিপিং রুটে যুগান্তকারী পরিবর্তন',
    slug: 'geopolitics-trade-matarbari-deep-sea-port',
    category: 'international',
    categoryName: 'আন্তর্জাতিক',
    division: 'chattogram',
    district: 'coxsbazar',
    content: `দক্ষিণ এশিয়ার অর্থনৈতিক বাণিজ্য ও নৌ-যোগাযোগের নতুন দ্বার উন্মোচন করতে যাচ্ছে মাতারবাড়ী গভীর সমুদ্রবন্দর প্রকল্প। আন্তর্জাতিক সমুদ্র বিশেষজ্ঞদের মতে, এই বন্দর চালু হলে বঙ্গোপসাগরীয় অঞ্চলের বাণিজ্য ভারসাম্যে সুদূরপ্রসারী ইতিবাচক পরিবর্তন আসবে।

বর্তমানে ১৮ মিটারের বেশি ড্রাফটের বৃহৎ কনটেইনার জাহাজ সরাসরি ভিড়তে পারায় সিঙ্গাপুর বা কলম্বো বন্দরের ওপর নির্ভরতা হ্রাস পাবে। এতে পণ্য খালাসে অন্তত এক-তৃতীয়াংশ সময় সাশ্রয় হবে বলে শিপিং মালিকদের সমিতি জানিয়েছে।

জাপান আন্তর্জাতিক সহযোগিতা সংস্থা (জাইকা) এবং বাংলাদেশ সরকারের যৌথ অর্থায়নে দ্রুতগতিতে এগিয়ে চলছে এর নির্মাণযজ্ঞ।`,
    excerpt: 'মাতারবাড়ী গভীর সমুদ্রবন্দর দক্ষিণ এশিয়ার নৌ-বাণিজ্যে কৌশলগত প্রভাব ফেলবে এবং আন্তর্জাতিক বাণিজ্যের মূল কেন্দ্র হিসেবে আত্মপ্রকাশ করবে।',
    featuredImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'মাতারবাড়ী টার্মিনালে অবকাঠামো নির্মাণ কার্যক্রম। ছবি: দিগন্ত বার্তা',
    reporterName: 'কামরুজ্জামান খান',
    reporterRole: 'নির্বাহী সম্পাদক',
    reporterId: 'user-2',
    source: 'বিশেষ প্রতিবেদন',
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    isEditorsChoice: true,
    isPinned: false,
    views: 2890,
    readingTime: 5,
    tags: ['আন্তর্জাতিক', 'মাতারবাড়ী', 'বন্দর', 'বাণিজ্য', 'কূটনীতি'],
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'art-4',
    title: 'শেয়ারবাজারে সূচকের বড় উত্থান: লেনদেন ছাড়াল ১ হাজার ২০০ কোটি টাকা',
    subtitle: 'ব্যাংক, প্রকৌশল ও ওষুধ খাতের সক্রিয়তায় চাঙ্গা হয়ে উঠেছে ঢাকা স্টক এক্সচেঞ্জ',
    slug: 'stock-market-index-surges-dse-turnover',
    category: 'economy',
    categoryName: 'অর্থনীতি',
    division: 'dhaka',
    district: 'dhaka',
    content: `সপ্তাহের শেষ কার্যদিবসে দেশের প্রধান শেয়ারবাজার ঢাকা স্টক এক্সচেঞ্জে (ডিএসই) মূল্যসূচকের উল্লেখযোগ্য উল্লম্ফন ঘটেছে। দিনশেষে প্রধান সূচক ডিএসইএক্স ৬৪ পয়েন্ট বৃদ্ধি পেয়ে ৫,৮১০ পয়েন্টে স্থির হয়।

বাজার বিশ্লেষকদের মতে, সাম্প্রতিক কিছু নিয়ন্ত্রক সংস্থার ইতিবাচক পদক্ষেপ এবং তারল্য প্রবাহ বৃদ্ধির কারণে প্রাতিষ্ঠানিক বিনিয়োগকারীদের সক্রিয়তা বৃদ্ধি পেয়েছে। দিনজুড়ে লেনদেনে অংশ নেওয়া ৩৯৬টি কোম্পানির মধ্যে ২৬৫টির শেয়ারের দর বৃদ্ধি পায়।`,
    excerpt: 'ডিএসইতে সূচকের বড় উত্থান এবং লেনদেন ১,২০০ কোটি টাকার মাইলফলক স্পর্শ করেছে। ইতিবাচক মেজাজে বিনিয়োগকারীরা।',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'শেয়ারবাজারের চাঙ্গা ভাব বিনিয়োগকারীদের মাঝে স্বস্তি ফিরিয়েছে।',
    reporterName: 'তানভীর আহমেদ',
    reporterRole: 'জ্যেষ্ঠ প্রতিবেদক',
    reporterId: 'user-4',
    source: 'নিজস্ব প্রতিবেদক',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    isEditorsChoice: false,
    isPinned: false,
    views: 1940,
    readingTime: 3,
    tags: ['শেয়ারবাজার', 'ডিএসই', 'অর্থনীতি', 'বিনিয়োগ'],
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'art-5',
    title: 'চ্যাম্পিয়ন্স ট্রফি ২০২৫: শেষ ওভারে মিরাজের অবিশ্বাস্য স্পেলে জয়ী বাংলাদেশ',
    subtitle: 'রোমাঞ্চকর ম্যাচে প্রতিপক্ষকে হারিয়ে সেমিফাইনালের স্বপ্ন উজ্জ্বল টাইগারদের',
    slug: 'champions-trophy-miraz-thrilling-last-over-win',
    category: 'sports',
    categoryName: 'খেলাধুলা',
    division: 'chattogram',
    district: 'chattogram',
    content: `এক টানটান উত্তেজনাকর ম্যাচে শেষ ওভারে মাত্র ৪ রান দিয়ে দুটি উইকেট তুলে নিয়ে দলকে অবিস্মরণীয় জয় উপহার দিলেন মেহেদী হাসান মিরাজ।

প্রথমে ব্যাট করতে নেমে নাজমুল হোসেন শান্তর অনবদ্য ৮৫ এবং তাওহীদ হৃদয়ের আক্রমণাত্মক ৬২ রানে ভর করে বাংলাদেশ সংগ্রহ করে ২৮৪ রান। জবাবে ব্যাট করতে নেমে শেষ ৩ ওভারে জয়ের জন্য প্রতিপক্ষের প্রয়োজন ছিল ১৮ রান। তবে তাসকিন ও মিরাজের ক্ষুরধার বোলিংয়ে মাত্র ৪ রানে জয় ছিনিয়ে নেয় বাংলাদেশ।

ম্যাচসেরা নির্বাচিত হন অলরাউন্ডার মেহেদী হাসান মিরাজ।`,
    excerpt: 'শেষ ওভারের টানটান উত্তেজনায় অবিস্মরণীয় জয় তুলে নিয়েছে বাংলাদেশ ক্রিকেট দল। ম্যান অব দ্য ম্যাচ মিরাজ।',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'ম্যাচ জয়ের পর টাইগারদের উল্লাস। ছবি: সংগৃহীত',
    reporterName: 'কাজী অনিক',
    reporterRole: 'ক্রীড়া প্রতিবেদক',
    source: 'ক্রীড়া ডেস্ক',
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    isEditorsChoice: false,
    isPinned: false,
    views: 6240,
    readingTime: 3,
    tags: ['ক্রিকেট', 'টাইগার্স', 'চ্যাম্পিয়ন্স ট্রফি', 'বাংলাদেশ ক্রিকেট'],
    publishedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'art-6',
    title: 'খুলনায় উপকূলীয় অঞ্চলে লবণাক্ততা সহনশীল নতুন ধানের জাত উদ্ভাবনে বিপ্লব',
    subtitle: 'কৃষি বিজ্ঞানীদের সফল গবেষণায় দক্ষিণাঞ্চলের লাখো কৃষকের মুখে নতুন হাসি',
    slug: 'khulna-saline-tolerant-rice-breakthrough',
    category: 'district',
    categoryName: 'জেলা সংবাদ',
    division: 'khulna',
    district: 'khulna',
    content: `জলবায়ু পরিবর্তনের কারণে দক্ষিণাঞ্চলের উপকূলীয় জেলাগুলোতে কৃষি জমির লবণাক্ততা বৃদ্ধি পাচ্ছিল। এই সংকট মোকাবিলায় বাংলাদেশ ধান গবেষণা ইনস্টিটিউটের (ব্রি) বিজ্ঞানীরা উদ্ভাবন করেছেন উচ্চফলনশীল ও ১২ ডিএস/মিটার পর্যন্ত লবণাক্ততা সহনশীল নতুন ধানের জাত 'ব্রি ধান-১০৭'।

খুলনার দাকোপ ও বটিয়াঘাটার পাইলট প্রকল্পে দেখা গেছে সাধারণ জাতের চেয়ে এই নতুন জাতটি অন্তত ২৫% বেশি ফলন দিয়েছে। কৃষকরা জানিয়েছেন, পতিত জমিতেও এবার তারা সোনালী ধান ঘরে তুলতে পেরে আনন্দিত।`,
    excerpt: 'লবণাক্ততা সহনশীল নতুন ধানের জাতে উপকূলীয় খুলনায় কৃষিতে সৃষ্টি হয়েছে নতুন আশার আলো।',
    featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'লবণাক্ত জমিতে ব্রি-১০৭ এর বাম্পার ফলন। ছবি: দিগন্ত বার্তা',
    reporterName: 'রশিদ জামিল',
    reporterRole: 'খুলনা ব্যুরো প্রধান',
    source: 'খুলনা ব্যুরো',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    isEditorsChoice: true,
    isPinned: false,
    views: 1840,
    readingTime: 3,
    tags: ['খুলনা', 'কৃষি', 'জলবায়ু', 'ধান গবেষণা'],
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'art-7',
    title: 'চিকিৎসাবিজ্ঞানে এআই প্রযুক্তির নবদিগন্ত: ঘরে বসেই চোখের রেটিনা স্ক্যান ও প্রাথমিক রোগ নির্ণয়',
    subtitle: 'বাংলাদেশি প্রকৌশলীদের তৈরি অ্যালগরিদম আন্তর্জাতিক মেডিকেল জার্নালে সমাদৃত',
    slug: 'ai-health-retina-scan-bangladesh-innovation',
    category: 'tech',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    division: 'dhaka',
    district: 'dhaka',
    content: `স্মার্টফোনের ক্যামেরার সঙ্গে একটি ক্ষুদ্র অপটিক্যাল লেন্স যুক্ত করে মাত্র ৩০ সেকেন্ডে ডায়াবেটিক রেটিনোপ্যাথি ও গ্লুকোমার প্রাথমিক লক্ষণ শনাক্ত করার কৃত্রিম বুদ্ধিমত্তানির্ভর একটি সফটওয়্যার উদ্ভাবন করেছেন বুয়েটের গবেষকদল।

এই প্রযুক্তি প্রত্যন্ত অঞ্চলের রোগীদের বিশেষায়িত চিকিৎসকের কাছে না পৌঁছেও দ্রুত নির্ভুল প্রাথমিক স্ক্রিনিং নিশ্চিত করতে সাহায্য করবে। গবেষকরা জানান, সাধারণ চোখের চিকিৎসকদের চেয়ে এই সিস্টেমের নির্ভুলতার হার ৯৭.৪ শতাংশ।`,
    excerpt: 'স্মার্টফোনে রেটিনা স্ক্যান করে চোখ ও ডায়াবেটিসের জটিল রোগ শনাক্তকরণে সক্ষম এআই সফটওয়্যার আবিষ্কার।',
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'চোখের রেটিনা বিশ্লেষণে কৃত্রিম বুদ্ধিমত্তা। ছবি: সংগৃহীত',
    reporterName: 'সামিয়া জামান',
    reporterRole: 'বার্তা সম্পাদক',
    reporterId: 'user-3',
    source: 'বিজ্ঞান ও স্বাস্থ্য ডেস্ক',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    isEditorsChoice: true,
    isPinned: false,
    views: 2210,
    readingTime: 4,
    tags: ['এআই', 'স্বাস্থ্য', 'উদ্ভাবন', 'বুয়েট'],
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'art-8',
    title: 'মতামত: কৃত্রিম বুদ্ধিমত্তার যুগে সত্যনিষ্ঠ সাংবাদিকতার দায়বদ্ধতা',
    subtitle: 'তথ্য যাচাইকরণ ও সংবাদের বিশ্বাসযোগ্যতা রক্ষায় গণমাধ্যমের সামনে নতুন চ্যালেঞ্জ',
    slug: 'opinion-journalistic-ethics-in-the-age-of-ai',
    category: 'opinion',
    categoryName: 'মতামত',
    content: `বর্তমানে কৃত্রিম বুদ্ধিমত্তা যেমন তথ্য সংগ্রহ ও ড্রাফটিংয়ের গতিকে বহুগুণ বাড়িয়ে দিয়েছে, তেমনি ডিপফেক, ভুয়া তথ্য এবং ভুল তথ্য ছড়ানোর ঝুঁকিও আগের যেকোনো সময়ের চেয়ে বেশি তীব্র হয়েছে।

দিগন্ত বার্তা বিশ্বাস করে, প্রযুক্তি হবে মানুষের সহায়ক, বিকল্প নয়। কোনো কৃত্রিম বুদ্ধিমত্তা যাতে নিজস্ব মনগড়া তথ্য বা অসত্য উপস্থাপন না করতে পারে, তার জন্য কঠোর মানবিক প্রাতিষ্ঠানিক সম্পাদনা পদ্ধতি বজায় রাখা আমাদের নৈতিক অঙ্গীকার। সত্যের অনুসন্ধানে নির্ভুল তথ্য নিশ্চিত করাই আমাদের প্রথম ব্রত।`,
    excerpt: 'তথ্য প্রযুক্তির বিস্ময়কর অগ্রযাত্রায় সততা ও মানবিক সম্পাদনার মূল্যবোধ টিকিয়ে রাখা সময়ের সবচেয়ে বড় পরীক্ষা।',
    featuredImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'সম্পাদকীয় কলাম। ছবি: দিগন্ত বার্তা',
    reporterName: 'নুসরাত জাহান',
    reporterRole: 'সম্পাদক ও প্রকাশক',
    reporterId: 'user-1',
    source: 'সম্পাদকীয়',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    isEditorsChoice: true,
    isPinned: false,
    views: 1530,
    readingTime: 4,
    tags: ['মতামত', 'সম্পাদকীয়', 'সাংবাদিকতা', 'নৈতিকতা'],
    publishedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

const INITIAL_ADS: AdCampaign[] = [
  {
    id: 'ad-1',
    name: 'শীর্ষ ব্যানার - প্রাণ-আরএফএল গ্রুপ টেক ইভেন্ট ২০২৬',
    type: 'direct_banner',
    placement: 'header_top',
    advertiser: 'PRAN-RFL Group',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://example.com/pran-tech',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    impressions: 14250,
    clicks: 680,
    price: 50000,
    device: 'all',
  },
  {
    id: 'ad-2',
    name: 'হোমপেজ মিডল ব্যানার - বিকাশ ডিজিটাল লেনদেন ক্যাম্পেইন',
    type: 'direct_banner',
    placement: 'home_middle',
    advertiser: 'bKash Bangladesh',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    targetUrl: 'https://bkash.com',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    impressions: 9800,
    clicks: 420,
    price: 35000,
    device: 'all',
  },
  {
    id: 'ad-3',
    name: 'নিবন্ধের ভেতরে সাইডবার - মেঘনা গ্রুপ অব ইন্ডাস্ট্রিজ',
    type: 'direct_banner',
    placement: 'home_sidebar',
    advertiser: 'Meghna Group',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    targetUrl: 'https://example.com/meghna',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    impressions: 7400,
    clicks: 310,
    price: 25000,
    device: 'desktop',
  },
  {
    id: 'ad-adsterra-1',
    name: 'Adsterra 728x90 Header / Footer Leaderboard Banner',
    type: 'adsterra_banner',
    placement: 'article_bottom',
    advertiser: 'Adsterra Network',
    codeSnippet: `<!-- Adsterra 728x90 Banner Slot -->
<script type="text/javascript">
	atOptions = {
		'key' : 'diganta_adsterra_sample_banner_728x90',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/sample/invoke.js"></script>`,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    impressions: 11200,
    clicks: 290,
    device: 'all',
  },
  {
    id: 'ad-monetag-1',
    name: 'Monetag In-Page Push / Social Bar Notification Ad',
    type: 'monetag_socialbar',
    placement: 'sticky_footer',
    advertiser: 'Monetag Publisher Network',
    codeSnippet: `<!-- Monetag MultiTag / In-Page Push -->
<script src="https://alwingulla.com/88/tag.min.js" data-zone="123456" async data-cfasync="false"></script>`,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    impressions: 8900,
    clicks: 380,
    device: 'mobile',
  },
];

const INITIAL_AI_DRAFTS: AIDraft[] = [
  {
    id: 'draft-1',
    originalTitle: 'BSS: Bangladesh signs bilateral trade pact with ASEAN partner countries for tariff concessions',
    sourceName: 'বাংলাদেশ সংবাদ সংস্থা (বাসস) / BSS',
    sourceUrl: 'https://bssnews.net/news/asean-trade-pact',
    publishedTime: '২০২৬-১১-০৭ ১০:৩০',
    category: 'economy',
    aiHeadline: 'আসিয়ান দেশগুলোর সঙ্গে বাণিজ্য চুক্তি সই করল বাংলাদেশ: শুল্কমুক্ত রপ্তানির নতুন দিগন্ত',
    aiSummary: 'আসিয়ানভুক্ত দেশগুলোর সঙ্গে বাংলাদেশের দ্বিপাক্ষিক বাণিজ্য চুক্তি স্বাক্ষরিত হয়েছে, যার মাধ্যমে তৈরি পোশাক ও চামড়াজাত পণ্যে ব্যাপক শুল্ক সুবিধা মিলবে।',
    aiFullDraft: `বাংলাদেশ ও আসিয়ান জোটের সদস্য রাষ্ট্রগুলোর মধ্যে একটি ঐতিহাসিক অগ্রাধিকারমূলক বাণিজ্য চুক্তি (পিটিএ) স্বাক্ষরিত হয়েছে। 

আজ সকালে এক যৌথ অনুষ্ঠানে বাণিজ্য সচিবের উপস্থিতিতে এই চুক্তি চূড়ান্ত রূপ লাভ করে। এ চুক্তির ফলে বাংলাদেশ থেকে তৈরি পোশাক, ওষুধ শিল্প এবং কৃষিজাত খাদ্যদ্রব্য রপ্তানিতে ২৫টি গুরুত্বপূর্ণ পণ্যে তাৎক্ষণিক শুল্কমুক্ত প্রবেশাধিকার নিশ্চিত করা হয়েছে।

অর্থনীতিবিদরা মন্তব্য করেছেন, ইউরোপ ও আমেরিকার পাশাপাশি দক্ষিণ-পূর্ব এশিয়ার উদীয়মান বাজার দখল করতে পারলে বাংলাদেশের রপ্তানি প্রবৃদ্ধি দ্বিগুণেরও বেশি বৃদ্ধি পাবে।`,
    confidence: 96,
    verificationStatus: 'verified',
    sourceComparison: 'বাসস এবং বাণিজ্য মন্ত্রণালয়ের আনুষ্ঠানিক বিজ্ঞপ্তির তথ্যে পূর্ণ সামঞ্জস্য পাওয়া গেছে। কোনো অসংগতি নেই।',
    duplicateDetected: false,
    editorialNotes: 'তথ্য নির্ভরযোগ্য। বাণিজ্য সম্পাদকের পর্যালোচনা শেষে প্রকাশযোগ্য।',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'draft-2',
    originalTitle: 'BBC Bangla: ঢাকার বাতাস উন্নত করতে কৃত্রিম বৃষ্টি ও ওয়াটার স্প্রে ড্রোন প্রযুক্তি চালুর উদ্যোগ',
    sourceName: 'বিবিসি বাংলা ও পরিবেশ অধিদপ্তর',
    sourceUrl: 'https://bbc.com/bengali/news/dhaka-air-quality-tech',
    publishedTime: '২০২৬-১১-০৭ ০৯:১৫',
    category: 'environment',
    aiHeadline: 'ঢাকার বায়ুদূষণ রোধে উচ্চপ্রযুক্তির ওয়াটার স্প্রে ড্রোন নামাচ্ছে পরিবেশ অধিদপ্তর',
    aiSummary: 'রাজধানীর তীব্র বায়ুদূষণ ও ধূলিঝড় প্রশমনে এয়ার-পিউরিফাইং ড্রোন এবং ক্লাউড সিডিং সংক্রান্ত প্রাথমিক মহড়া পরিচালনার সিদ্ধান্ত নিয়েছে মন্ত্রণালয়।',
    aiFullDraft: `শীতকালীন বায়ুদূষণ ও বিপজ্জনক একিউআই স্তর নিয়ন্ত্রণের লক্ষ্যে আধুনিক প্রযুক্তি ব্যবহারের সিদ্ধান্ত নিয়েছে পরিবেশ, বন ও জলবায়ু পরিবর্তন মন্ত্রণালয়।

পরিকল্পনা অনুযায়ী, আগামী সপ্তাহ থেকে রাজধানীর শীর্ষ ১০টি দূষিত পয়েন্টে বিশেষ ড্রোন থেকে পানির সূক্ষ্ম কণা স্প্রে করে ভাসমান ধূলিকণা নামিয়ে আনার কার্যক্রম শুরু হবে। বিশেষজ্ঞ কমিটি জানিয়েছে, এর ফলে তাৎক্ষণিকভাবে পিএম ২.৫ মাত্রায় উল্লেখযোগ্য হ্রাস ঘটবে।`,
    confidence: 91,
    verificationStatus: 'verified',
    sourceComparison: 'বিবিসি বাংলা প্রতিবেদন ও পরিবেশ অধিদপ্তরের প্রেস ব্রিফিংয়ে মিল রয়েছে।',
    duplicateDetected: false,
    editorialNotes: 'বিশেষজ্ঞদের মতামত যুক্ত করে প্রকাশ করা যেতে পারে।',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'জাতীয় সংসদ ভবন ও সচিবালয়',
    url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
    caption: 'বাংলাদেশ জাতীয় সংসদ ভবন। স্থাপত্য ও রাজনীতি।',
    source: 'দিগন্ত বার্তা আর্কাইভ',
    altText: 'বাংলাদেশ জাতীয় সংসদ ভবন',
    size: '1.2 MB',
    type: 'image',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    title: 'মাতারবাড়ী গভীর সমুদ্রবন্দর',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop&q=80',
    caption: 'কক্সবাজার মাতারবাড়ী গভীর সমুদ্রবন্দর টার্মিনাল',
    source: 'জাইকা প্রেস মিডিয়া',
    altText: 'মাতারবাড়ী সমুদ্রবন্দর',
    size: '2.4 MB',
    type: 'image',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    title: 'শেয়ারবাজার ও ডিজিটাল অর্থনীতি',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    caption: 'শেয়ার ট্রেডিং ও বিনিয়োগ সূচক',
    source: 'ডিএসই আর্কাইভ',
    altText: 'ঢাকা স্টক এক্সচেঞ্জ লেনদেন',
    size: '1.8 MB',
    type: 'image',
    uploadedAt: new Date().toISOString(),
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user: 'নুসরাত জাহান (সম্পাদক ও প্রকাশক)',
    role: 'Super Admin',
    action: 'সিস্টেম ইনিশিয়ালাইজেশন ও সিকিউরিটি পলিসি সেটআপ',
    target: 'দিগন্ত বার্তা পোর্টাল কোর ইঞ্জিন',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'log-2',
    user: 'কামরুজ্জামান খান (নির্বাহী সম্পাদক)',
    role: 'Executive Editor',
    action: 'অনুমোদন ও প্রকাশনা',
    target: 'ডিজিটাল অর্থনীতির বিকাশে নতুন পলিসি রূপরেখা ঘোষণা',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'log-3',
    user: 'সামিয়া জামান (বার্তা সম্পাদক)',
    role: 'News Editor',
    action: 'ব্রেকিং নিউজ সক্রিয়করণ',
    target: 'একনেক বৈঠক মেগা প্রকল্প অনুমোদন',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'নতুন এআই ড্রাফট তৈরি হয়েছে',
    message: 'বাসস থেকে সংগৃহীত আসিয়ান বাণিজ্য চুক্তি বিষয়ক খসড়া সম্পাদকীয় অনুমোদনের অপেক্ষায় রয়েছে।',
    type: 'ai_draft',
    timestamp: new Date().toISOString(),
    read: false,
    link: '/admin/ai-research',
  },
  {
    id: 'notif-2',
    title: 'ব্রেকিং নিউজ লাইভ রয়েছে',
    message: 'একনেক মেগা প্রকল্প সম্পর্কিত ব্রেকিং নিউজ বর্তমানে হোমপেজে স্ক্রল হচ্ছে।',
    type: 'breaking',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    link: '/admin/breaking-news',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          articles: parsed.articles || INITIAL_ARTICLES,
          breakingNews: parsed.breakingNews || INITIAL_BREAKING_NEWS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          ads: parsed.ads || INITIAL_ADS,
          aiDrafts: parsed.aiDrafts || INITIAL_AI_DRAFTS,
          media: parsed.media || INITIAL_MEDIA,
          auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
          settings: parsed.settings || INITIAL_SETTINGS,
          users: parsed.users || INITIAL_USERS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        };
      }
    } catch (e) {
      console.error('Failed to load database file, using initial data:', e);
    }

    const initial: DatabaseSchema = {
      articles: INITIAL_ARTICLES,
      breakingNews: INITIAL_BREAKING_NEWS,
      categories: INITIAL_CATEGORIES,
      ads: INITIAL_ADS,
      aiDrafts: INITIAL_AI_DRAFTS,
      media: INITIAL_MEDIA,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
      users: INITIAL_USERS,
      notifications: INITIAL_NOTIFICATIONS,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save to database file:', e);
    }
  }

  public getArticles(filters?: {
    category?: string;
    district?: string;
    division?: string;
    status?: string;
    search?: string;
    featured?: boolean;
    breaking?: boolean;
    limit?: number;
  }): NewsArticle[] {
    let list = [...this.data.articles];

    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    } else {
      // By default return published unless in admin context
      list = list.filter((a) => a.status === 'published');
    }

    if (filters?.category && filters.category !== 'all' && filters.category !== 'home') {
      list = list.filter((a) => a.category === filters.category);
    }

    if (filters?.division) {
      list = list.filter((a) => a.division === filters.division);
    }

    if (filters?.district) {
      list = list.filter((a) => a.district === filters.district);
    }

    if (filters?.featured) {
      list = list.filter((a) => a.isFeatured);
    }

    if (filters?.breaking) {
      list = list.filter((a) => a.isBreaking);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (filters?.limit) {
      list = list.slice(0, filters.limit);
    }

    return list;
  }

  public getAllArticlesAdmin(): NewsArticle[] {
    return [...this.data.articles].sort(
      (a, b) => new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime()
    );
  }

  public getArticleBySlug(slug: string): NewsArticle | undefined {
    return this.data.articles.find((a) => a.slug === slug || a.id === slug);
  }

  public incrementViews(idOrSlug: string) {
    const article = this.data.articles.find((a) => a.slug === idOrSlug || a.id === idOrSlug);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.saveData(this.data);
    }
  }

  public createArticle(article: Omit<NewsArticle, 'id' | 'views' | 'publishedAt' | 'updatedAt'>): NewsArticle {
    const id = `art-${Date.now()}`;
    const now = new Date().toISOString();
    const newArt: NewsArticle = {
      ...article,
      id,
      views: 0,
      publishedAt: now,
      updatedAt: now,
    };
    this.data.articles.unshift(newArt);
    this.addAuditLog('সম্পাদকীয় কক্ষ', 'Editor', 'নতুন সংবাদ তৈরি ও প্রকাশনা', newArt.title);
    this.saveData(this.data);
    return newArt;
  }

  public updateArticle(id: string, updates: Partial<NewsArticle>): NewsArticle | null {
    const idx = this.data.articles.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    this.data.articles[idx] = {
      ...this.data.articles[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog('সম্পাদকীয় কক্ষ', 'Editor', 'সংবাদ হালনাগাদ', this.data.articles[idx].title);
    this.saveData(this.data);
    return this.data.articles[idx];
  }

  public deleteArticle(id: string): boolean {
    const idx = this.data.articles.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const title = this.data.articles[idx].title;
    this.data.articles.splice(idx, 1);
    this.addAuditLog('সুপার অ্যাডমিন', 'Super Admin', 'সংবাদ অপসারণ', title);
    this.saveData(this.data);
    return true;
  }

  public getBreakingNews(): BreakingNewsItem[] {
    return this.data.breakingNews.filter((b) => b.isActive);
  }

  public getAllBreakingNewsAdmin(): BreakingNewsItem[] {
    return this.data.breakingNews;
  }

  public saveBreakingNews(item: Partial<BreakingNewsItem> & { title: string }): BreakingNewsItem {
    if (item.id) {
      const idx = this.data.breakingNews.findIndex((b) => b.id === item.id);
      if (idx !== -1) {
        this.data.breakingNews[idx] = {
          ...this.data.breakingNews[idx],
          ...item,
        } as BreakingNewsItem;
        this.saveData(this.data);
        return this.data.breakingNews[idx];
      }
    }

    const newItem: BreakingNewsItem = {
      id: `bn-${Date.now()}`,
      title: item.title,
      link: item.link || '',
      priority: item.priority || 'high',
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: new Date().toISOString(),
      bgColor: item.bgColor || '#b91c1c',
      textColor: item.textColor || '#ffffff',
    };
    this.data.breakingNews.unshift(newItem);
    this.addAuditLog('বার্তা সম্পাদক', 'News Editor', 'ব্রেকিং নিউজ সংযোজন', newItem.title);
    this.saveData(this.data);
    return newItem;
  }

  public deleteBreakingNews(id: string): boolean {
    const idx = this.data.breakingNews.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.data.breakingNews.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }

  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.order - b.order);
  }

  public saveCategory(category: Partial<Category> & { name: string; slug: string }): Category {
    if (category.id) {
      const idx = this.data.categories.findIndex((c) => c.id === category.id);
      if (idx !== -1) {
        this.data.categories[idx] = { ...this.data.categories[idx], ...category };
        this.saveData(this.data);
        return this.data.categories[idx];
      }
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: category.name,
      slug: category.slug,
      order: category.order || this.data.categories.length + 1,
      subcategories: category.subcategories || [],
    };
    this.data.categories.push(newCat);
    this.saveData(this.data);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.categories.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }

  public getAds(activeOnly = true): AdCampaign[] {
    if (activeOnly) {
      return this.data.ads.filter((a) => a.isActive);
    }
    return this.data.ads;
  }

  public saveAd(ad: Partial<AdCampaign> & { name: string; type: any; placement: any }): AdCampaign {
    if (ad.id) {
      const idx = this.data.ads.findIndex((a) => a.id === ad.id);
      if (idx !== -1) {
        this.data.ads[idx] = { ...this.data.ads[idx], ...ad };
        this.saveData(this.data);
        return this.data.ads[idx];
      }
    }
    const newAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      name: ad.name,
      type: ad.type,
      placement: ad.placement,
      advertiser: ad.advertiser || 'বাণিজ্যিক অংশীদার',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      codeSnippet: ad.codeSnippet || '',
      startDate: ad.startDate || new Date().toISOString(),
      endDate: ad.endDate || '2026-12-31',
      isActive: ad.isActive !== undefined ? ad.isActive : true,
      impressions: 0,
      clicks: 0,
      price: ad.price || 0,
      device: ad.device || 'all',
    };
    this.data.ads.push(newAd);
    this.saveData(this.data);
    return newAd;
  }

  public recordAdImpression(id: string) {
    const ad = this.data.ads.find((a) => a.id === id);
    if (ad) {
      ad.impressions = (ad.impressions || 0) + 1;
      this.saveData(this.data);
    }
  }

  public recordAdClick(id: string) {
    const ad = this.data.ads.find((a) => a.id === id);
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      this.saveData(this.data);
    }
  }

  public deleteAd(id: string): boolean {
    const idx = this.data.ads.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.data.ads.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }

  public getAIDrafts(): AIDraft[] {
    return [...this.data.aiDrafts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public saveAIDraft(draft: Omit<AIDraft, 'id' | 'createdAt'>): AIDraft {
    const newDraft: AIDraft = {
      ...draft,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.aiDrafts.unshift(newDraft);

    // Create a notification for editors
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'নতুন এআই ড্রাফট সংগৃহীত',
      message: `${newDraft.sourceName}: ${newDraft.aiHeadline}`,
      type: 'ai_draft',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/admin/ai-research',
    });

    this.saveData(this.data);
    return newDraft;
  }

  public updateAIDraftStatus(id: string, status: 'new' | 'reviewed' | 'approved' | 'rejected', notes?: string): boolean {
    const draft = this.data.aiDrafts.find((d) => d.id === id);
    if (!draft) return false;
    draft.status = status;
    if (notes) draft.editorialNotes = notes;
    this.saveData(this.data);
    return true;
  }

  public deleteAIDraft(id: string): boolean {
    const idx = this.data.aiDrafts.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.data.aiDrafts.splice(idx, 1);
    this.saveData(this.data);
    return true;
  }

  public getMedia(): MediaItem[] {
    return [...this.data.media].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  public saveMedia(media: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const newMedia: MediaItem = {
      ...media,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.data.media.unshift(newMedia);
    this.saveData(this.data);
    return newMedia;
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(user: string, role: string, action: string, target: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user,
      role,
      action,
      target,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.saveData(this.data);
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUser(idOrEmail: string): User | undefined {
    return this.data.users.find((u) => u.id === idOrEmail || u.email === idOrEmail);
  }

  public getNotifications(): SystemNotification[] {
    return this.data.notifications;
  }

  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData(this.data);
    }
  }

  public getStats() {
    const totalPublished = this.data.articles.filter((a) => a.status === 'published').length;
    const pendingReview = this.data.articles.filter((a) => a.status === 'pending_review').length;
    const drafts = this.data.articles.filter((a) => a.status === 'draft').length;
    const totalViews = this.data.articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const breakingCount = this.data.breakingNews.filter((b) => b.isActive).length;
    const aiDraftCount = this.data.aiDrafts.length;
    const totalAds = this.data.ads.length;
    const totalAdClicks = this.data.ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const totalAdImpressions = this.data.ads.reduce((acc, curr) => acc + (curr.impressions || 0), 0);

    return {
      totalPublished,
      pendingReview,
      drafts,
      totalViews,
      breakingCount,
      aiDraftCount,
      totalAds,
      totalAdClicks,
      totalAdImpressions,
      dailyVisitors: Math.round(totalViews * 0.42) + 1200,
      monthlyVisitors: Math.round(totalViews * 4.8) + 45000,
      categoriesCount: this.data.categories.length,
      reportersCount: this.data.users.length,
    };
  }
}

export const db = new Database();

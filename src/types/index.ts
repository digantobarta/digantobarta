export type UserRole =
  | 'Super Admin'
  | 'Administrator'
  | 'Executive Editor'
  | 'News Editor'
  | 'Reporter'
  | 'Advertising Manager'
  | 'Content Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  designation: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export type ArticleStatus =
  | 'draft'
  | 'pending_review'
  | 'editor_approved'
  | 'published'
  | 'rejected'
  | 'archived';

export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  categoryName: string;
  division?: string;
  district?: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  imageCaption?: string;
  reporterName: string;
  reporterRole?: string;
  reporterId?: string;
  source: string;
  sourceUrl?: string;
  status: ArticleStatus;
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isEditorsChoice: boolean;
  isPinned: boolean;
  views: number;
  readingTime: number; // in minutes
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishedAt: string;
  updatedAt: string;
  aiGenerated?: boolean;
  confidenceScore?: number;
  videoUrl?: string;
  gallery?: string[];
  correctionHistory?: {
    date: string;
    note: string;
  }[];
}

export interface BreakingNewsItem {
  id: string;
  title: string;
  link?: string;
  priority: 'high' | 'normal' | 'urgent';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  bgColor?: string;
  textColor?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  description?: string;
  subcategories?: string[];
}

export type AdType =
  | 'direct_banner'
  | 'direct_sponsored'
  | 'adsterra_banner'
  | 'adsterra_popunder'
  | 'adsterra_socialbar'
  | 'monetag_banner'
  | 'monetag_popunder'
  | 'monetag_socialbar';

export type AdPlacement =
  | 'header_top'
  | 'home_middle'
  | 'home_sidebar'
  | 'article_top'
  | 'article_inline'
  | 'article_bottom'
  | 'sticky_footer'
  | 'popup';

export interface AdCampaign {
  id: string;
  name: string;
  type: AdType;
  placement: AdPlacement;
  advertiser?: string;
  imageUrl?: string;
  targetUrl?: string;
  codeSnippet?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  price?: number;
  device: 'all' | 'desktop' | 'mobile';
}

export interface AIDraft {
  id: string;
  originalTitle: string;
  sourceName: string;
  sourceUrl: string;
  publishedTime: string;
  category: string;
  aiHeadline: string;
  aiSummary: string;
  aiFullDraft: string;
  confidence: number; // 0 - 100
  verificationStatus: 'verified' | 'needs_review' | 'conflicting';
  sourceComparison: string;
  duplicateDetected: boolean;
  editorialNotes: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  caption?: string;
  source?: string;
  altText?: string;
  size?: string;
  type: 'image' | 'video';
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  tagline: string;
  publisher: string;
  publisherPhone: string;
  executiveEditor: string;
  executiveEditorPhone: string;
  newsEditor: string;
  newsEditorPhone: string;
  address: string;
  email: string;
  breakingNewsSpeed: number; // in seconds
  breakingNewsEnabled: boolean;
  breakingNewsBg: string;
  breakingNewsText: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    youtube: string;
    telegram: string;
    whatsapp: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    googleAnalyticsId?: string;
    googleSearchConsoleTag?: string;
  };
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ai_draft' | 'article_submitted' | 'breaking' | 'system' | 'ad_expiry';
  timestamp: string;
  read: boolean;
  link?: string;
}

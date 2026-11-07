# দিগন্ত বার্তা (DIGANTA BARTA)
> **স্লোগান:** *সত্যের সন্ধানে, আগামীর পথে*
> **English:** DIGANTA BARTA — Truth in Pursuit, Pathway to Future

A production-grade, full-stack digital news publishing organization platform designed specifically for Bangladesh, featuring an AI-Powered News Collection Agent (Gemini 3.8 Flash), multi-role editorial workflow, breaking news center, district & local news system, monetization dashboard (Direct Ads, Adsterra, Monetag), and full Netlify deployment capability.

---

## 🏛️ Editorial & Organizational Leadership
- **সম্পাদক ও প্রকাশক:** নুসরাত জাহান (ফোন: +8801568840139)
- **নির্বাহী সম্পাদক:** কামরুজ্জামান খান (ফোন: +8801752038853)
- **বার্তা সম্পাদক:** সামিয়া জামান (ফোন: +8801972038853)
- **ঠিকানা:** প্রেস ক্লাব রোড, তোপখানা রোড, ঢাকা-১০০০, বাংলাদেশ
- **ইমেইল:** contact@digantabarta.com

---

## 🌟 Key Architecture & Capabilities

### 1. Public Newspaper Experience
- **Header & Bengali Date:** Live Bengali date string, English toggle, weather widget, social links.
- **Breaking News Marquee:** Admin-customizable ticker with priority control, speed control, active toggle, custom background and text colors.
- **19 Standard Categories:** প্রচ্ছদ, জাতীয়, রাজনীতি, আন্তর্জাতিক, অর্থনীতি, সারাদেশ, জেলা সংবাদ, অপরাধ, শিক্ষা, স্বাস্থ্য, বিজ্ঞান ও প্রযুক্তি, পরিবেশ ও জলবায়ু, খেলাধুলা, বিনোদন, ধর্ম ও জীবন, মতামত, ফিচার, ভিডিও, বাণিজ্যিক বিজ্ঞপ্তি.
- **District News:** All 8 divisions and 64 districts of Bangladesh with instant division and district filtration.
- **Article Reading System:** SEO-friendly slugs, reading progress bar, adjustable text size, Bengali numerals, social share dialogs (Facebook, WhatsApp, X, Telegram, LinkedIn, native Web Share, print preview, card download), image gallery, related stories, and comments.

### 2. AI News Research Agent
- Powered by Google Gemini (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK.
- Continuous monitoring of authentic sources: BSS, BBC Bangla, PID, Reuters, DW.
- Verification confidence score (0-100), duplicate detection, source cross-checking, and fluent Bengali headline & draft synthesis.
- Strict human editorial approval workflow: **AI Draft → News Editor Review → Approval → Published Story**. AI content is never published without human authorization.

### 3. Monetization & Ad Management
- **Direct Commercial Ads:** Header leaderboard, in-article banners, homepage sidebar, sticky footer, popup ads with start/end schedules, advertiser name, impression & click trackers.
- **Adsterra Integration:** Support for 728x90 banners, 300x250 medium rectangles, Social Bar ads, and popunder scripts.
- **Monetag Integration:** Support for In-Page Push, Social Bar, and banner multi-tags.
- Central management panel with live preview, impression stats, and device targeting.

### 4. Role-Based Access Control (RBAC)
- **Super Admin:** Full system authority, branding, security, user administration, backup, and ZIP export.
- **Administrator:** Operational controls and configuration.
- **Executive Editor:** High-level editorial reviews and approvals.
- **News Editor:** Assignment, draft editing, breaking news, AI draft approvals.
- **Reporter:** Story drafting, submission for editorial review.
- **Advertising Manager:** Commercial campaigns and ad networks.
- **Content Manager:** Media library and static pages.

---

## 🚀 Netlify Deployment Guide

### Option 1: Automatic Netlify Git Deployment
1. Connect your repository to Netlify.
2. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
3. In Netlify Dashboard, navigate to **Site configuration > Environment variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `APP_URL`: Your Netlify URL (e.g. `https://digantabarta.netlify.app`)
4. Click **Deploy Site**.

### Option 2: Netlify CLI
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build production assets
npm run build

# 3. Deploy
netlify deploy --prod
```

### Option 3: Download Complete Project Package ZIP
From the Diganta Barta Admin Panel (`/admin` -> **ডিপ্লয়মেন্ট ও ব্যাকআপ**), click **"সম্পূর্ণ প্রজেক্ট জিপ ডাউনলোড" (Download Complete Project ZIP)**. This builds a complete standalone package including all source code, assets, configuration, and documentation.

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev

# Build for production
npm run build
```

---

## 🔒 Security & Data Integrity
- No hardcoded secrets or API keys in client-side code.
- Sanitized rich text rendering.
- Role-based route guard.
- Audit logging for all critical editorial actions.
- Persistent file database stored in `data/db.json`.

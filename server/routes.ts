import express, { Request, Response } from 'express';
import { db } from './db.ts';
import { runAINewsResearch, AUTHENTIC_SOURCES } from './aiAgent.ts';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

export const apiRouter = express.Router();

// News endpoints
apiRouter.get('/news', (req: Request, res: Response) => {
  const { category, district, division, search, featured, breaking, limit } = req.query;
  const articles = db.getArticles({
    category: category as string,
    district: district as string,
    division: division as string,
    search: search as string,
    featured: featured === 'true',
    breaking: breaking === 'true',
    limit: limit ? parseInt(limit as string, 10) : undefined,
  });
  res.json(articles);
});

apiRouter.get('/news/admin', (_req: Request, res: Response) => {
  const articles = db.getAllArticlesAdmin();
  res.json(articles);
});

apiRouter.get('/news/:slug', (req: Request, res: Response) => {
  const article = db.getArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  db.incrementViews(req.params.slug);
  res.json(article);
});

apiRouter.post('/news', (req: Request, res: Response) => {
  try {
    const { title, content, category, categoryName, excerpt, featuredImage, reporterName, source, status, division, district, tags, isBreaking, isFeatured, isTrending, isEditorsChoice, isPinned, videoUrl } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content and category are required' });
    }

    // Auto-generate slug from title or timestamp
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 80);
    const slug = `${baseSlug || 'news'}-${Date.now().toString().slice(-6)}`;

    const newArticle = db.createArticle({
      title,
      slug,
      content,
      category,
      categoryName: categoryName || 'জাতীয়',
      excerpt: excerpt || content.substring(0, 160) + '...',
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      reporterName: reporterName || 'নিজস্ব প্রতিবেদক',
      source: source || 'দিগন্ত বার্তা',
      status: status || 'published',
      division: division || undefined,
      district: district || undefined,
      tags: Array.isArray(tags) ? tags : ['সংবাদ'],
      isBreaking: Boolean(isBreaking),
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isEditorsChoice: Boolean(isEditorsChoice),
      isPinned: Boolean(isPinned),
      readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 180)),
      videoUrl: videoUrl || undefined,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Failed to create article:', error);
    res.status(500).json({ error: 'Internal server error creating article' });
  }
});

apiRouter.put('/news/:id', (req: Request, res: Response) => {
  const updated = db.updateArticle(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(updated);
});

apiRouter.delete('/news/:id', (req: Request, res: Response) => {
  const success = db.deleteArticle(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json({ success: true, message: 'Article deleted successfully' });
});

// Breaking News endpoints
apiRouter.get('/breaking-news', (_req: Request, res: Response) => {
  res.json(db.getBreakingNews());
});

apiRouter.get('/breaking-news/admin', (_req: Request, res: Response) => {
  res.json(db.getAllBreakingNewsAdmin());
});

apiRouter.post('/breaking-news', (req: Request, res: Response) => {
  const item = db.saveBreakingNews(req.body);
  res.json(item);
});

apiRouter.delete('/breaking-news/:id', (req: Request, res: Response) => {
  const success = db.deleteBreakingNews(req.params.id);
  res.json({ success });
});

// Categories endpoints
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  const cat = db.saveCategory(req.body);
  res.json(cat);
});

apiRouter.delete('/categories/:id', (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  res.json({ success });
});

// Advertisements endpoints
apiRouter.get('/ads', (req: Request, res: Response) => {
  const activeOnly = req.query.admin !== 'true';
  res.json(db.getAds(activeOnly));
});

apiRouter.post('/ads', (req: Request, res: Response) => {
  const ad = db.saveAd(req.body);
  res.json(ad);
});

apiRouter.post('/ads/:id/impression', (req: Request, res: Response) => {
  db.recordAdImpression(req.params.id);
  res.json({ success: true });
});

apiRouter.post('/ads/:id/click', (req: Request, res: Response) => {
  db.recordAdClick(req.params.id);
  res.json({ success: true });
});

apiRouter.delete('/ads/:id', (req: Request, res: Response) => {
  const success = db.deleteAd(req.params.id);
  res.json({ success });
});

// AI Agent News Research
apiRouter.get('/ai/sources', (_req: Request, res: Response) => {
  res.json(AUTHENTIC_SOURCES);
});

apiRouter.get('/ai/drafts', (_req: Request, res: Response) => {
  res.json(db.getAIDrafts());
});

apiRouter.post('/ai/research', async (req: Request, res: Response) => {
  try {
    const { topic, sourceUrl, sourceText, category } = req.body;
    const draftData = await runAINewsResearch({ topic, sourceUrl, sourceText, category });
    const savedDraft = db.saveAIDraft(draftData);
    res.json(savedDraft);
  } catch (error) {
    console.error('AI Research failed:', error);
    res.status(500).json({ error: 'AI news research failed' });
  }
});

apiRouter.put('/ai/drafts/:id/status', (req: Request, res: Response) => {
  const { status, editorialNotes } = req.body;
  const success = db.updateAIDraftStatus(req.params.id, status, editorialNotes);
  if (!success) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  res.json({ success: true });
});

apiRouter.post('/ai/drafts/:id/publish', (req: Request, res: Response) => {
  const drafts = db.getAIDrafts();
  const draft = drafts.find((d) => d.id === req.params.id);
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }

  // Convert approved draft to article
  const article = db.createArticle({
    title: draft.aiHeadline,
    slug: `ai-${Date.now().toString().slice(-6)}`,
    category: draft.category || 'national',
    categoryName: draft.category === 'economy' ? 'অর্থনীতি' : draft.category === 'environment' ? 'পরিবেশ' : 'জাতীয়',
    content: draft.aiFullDraft,
    excerpt: draft.aiSummary,
    featuredImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    reporterName: 'অনলাইন ডেস্ক (এআই সমর্থিত)',
    source: `${draft.sourceName} (অনুমোদিত)`,
    sourceUrl: draft.sourceUrl,
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    isEditorsChoice: false,
    isPinned: false,
    readingTime: 3,
    tags: ['এআই সংবাদ', draft.category, 'যাচাইকৃত'],
    aiGenerated: true,
    confidenceScore: draft.confidence,
  });

  db.updateAIDraftStatus(draft.id, 'approved', 'বার্তা সম্পাদক কর্তৃক অনুমোদিত ও প্রকাশিত হয়েছে');
  res.json({ success: true, article });
});

apiRouter.delete('/ai/drafts/:id', (req: Request, res: Response) => {
  const success = db.deleteAIDraft(req.params.id);
  res.json({ success });
});

// Media Library
apiRouter.get('/media', (_req: Request, res: Response) => {
  res.json(db.getMedia());
});

apiRouter.post('/media', (req: Request, res: Response) => {
  const { title, url, caption, source, altText, type } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  const media = db.saveMedia({
    title,
    url,
    caption,
    source: source || 'দিগন্ত বার্তা',
    altText: altText || title,
    type: type || 'image',
    size: '1.5 MB',
  });
  res.json(media);
});

// Analytics & Stats
apiRouter.get('/stats', (_req: Request, res: Response) => {
  res.json(db.getStats());
});

// Settings & Branding
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

apiRouter.put('/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Users & Roles
apiRouter.get('/users', (_req: Request, res: Response) => {
  res.json(db.getUsers());
});

// Audit Logs
apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});

// Notifications
apiRouter.get('/notifications', (_req: Request, res: Response) => {
  res.json(db.getNotifications());
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

// Download Netlify Drag & Drop Ready Build ZIP (contains pre-compiled dist/ with index.html at root)
apiRouter.get('/export-deploy-zip', async (_req: Request, res: Response) => {
  try {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      // If dist doesn't exist, execute build
      const { execSync } = await import('child_process');
      execSync('npm run build', { stdio: 'inherit' });
    }

    const zip = new JSZip();

    // Recursively add dist files to root of zip
    const addDirToZip = (dirPath: string, zipFolder: JSZip) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addDirToZip(fullPath, subFolder);
          }
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    };

    addDirToZip(distPath, zip);

    // Ensure _redirects exists in zip
    if (!zip.file('_redirects')) {
      zip.file('_redirects', '/*    /index.html   200\n');
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="diganta-barta-netlify-drop-ready.zip"');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating deployment ZIP:', error);
    res.status(500).json({ error: 'Failed to generate Netlify deployment ZIP' });
  }
});

// Download Complete Project / Production Deployment ZIP
apiRouter.get('/export-zip', async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    // Helper to recursively add files
    const addDirToZip = (dirPath: string, zipFolder: JSZip) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        if (
          item === 'node_modules' ||
          item === '.git' ||
          item === '.next' ||
          item === '.cache'
        ) {
          continue;
        }
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addDirToZip(fullPath, subFolder);
          }
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    };

    addDirToZip(process.cwd(), zip);

    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="diganta-barta-full-source.zip"');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating project ZIP:', error);
    res.status(500).json({ error: 'Failed to generate project ZIP package' });
  }
});


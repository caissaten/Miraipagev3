import { Router, Request, Response, NextFunction } from 'express';
import { dbService } from './dbService';

export const router = Router();

// Simple admin session management
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mirai123';
// Secure random-like static token for local preview admin session
const STATIC_AUTH_TOKEN = 'mirai_page_secured_admin_session_token_2026';

// Middleware to verify Admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (token === STATIC_AUTH_TOKEN) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid token' });
}

// --- AUTH ENDPOINTS ---
router.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: STATIC_AUTH_TOKEN,
      user: { username, role: 'admin' }
    });
  }

  return res.status(401).json({ error: 'Username atau password salah.' });
});

router.get('/auth/check', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '') === STATIC_AUTH_TOKEN) {
    return res.json({ authenticated: true, user: { username: ADMIN_USERNAME, role: 'admin' } });
  }
  return res.json({ authenticated: false });
});

// --- STATS ENDPOINT ---
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await dbService.getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- FILE UPLOAD ENDPOINT ---
router.post('/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'Missing fileName or base64Data' });
    }
    const publicUrl = await dbService.handleCoverUpload(fileName, base64Data);
    res.json({ success: true, url: publicUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- NOVELS ENDPOINTS ---
// Get all novels (public)
router.get('/novels', async (req: Request, res: Response) => {
  try {
    const novels = await dbService.getNovels();
    res.json(novels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get novel by slug (public)
router.get('/novels/:slug', async (req: Request, res: Response) => {
  try {
    const novel = await dbService.getNovelBySlug(req.params.slug);
    if (!novel) {
      return res.status(404).json({ error: 'Novel not found' });
    }
    res.json(novel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new novel (admin)
router.post('/novels', requireAdmin, async (req: Request, res: Response) => {
  try {
    const novel = await dbService.createNovel(req.body);
    res.status(201).json(novel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update novel (admin)
router.put('/novels/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const novel = await dbService.updateNovel(req.params.id, req.body);
    res.json(novel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete novel (admin)
router.delete('/novels/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteNovel(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Increment novel views (public)
router.post('/novels/:id/increment-view', async (req: Request, res: Response) => {
  try {
    await dbService.incrementNovelViews(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CHAPTERS ENDPOINTS ---
// Get all chapters for a novel (public)
router.get('/novels/:novelId/chapters', async (req: Request, res: Response) => {
  try {
    const chapters = await dbService.getChapters(req.params.novelId);
    res.json(chapters);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chapter by slug (public)
router.get('/novels/:novelId/chapters/:chapterSlug', async (req: Request, res: Response) => {
  try {
    const chapter = await dbService.getChapterBySlug(req.params.novelId, req.params.chapterSlug);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new chapter (admin)
router.post('/chapters', requireAdmin, async (req: Request, res: Response) => {
  try {
    const chapter = await dbService.createChapter(req.body);
    res.status(201).json(chapter);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update chapter (admin)
router.put('/chapters/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const chapter = await dbService.updateChapter(req.params.id, req.body);
    res.json(chapter);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete chapter (admin)
router.delete('/chapters/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    await dbService.deleteChapter(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Increment chapter views (public)
router.post('/chapters/:id/increment-view', async (req: Request, res: Response) => {
  try {
    await dbService.incrementChapterViews(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

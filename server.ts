import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { router as apiRouter } from './src/server/api';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000; // Hardcoded port 3000 as mandated by infrastructure

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API
  app.use('/api', apiRouter);

  // Serve uploads
  const uploadsPath = path.resolve(process.cwd(), 'data/uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets in production
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Fallback for Single Page Application routing (HTML5 history API)
    app.get('*', (req, res) => {
      // If request is API or upload, let it fail or handle elsewhere
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MiraiPage] Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});


// /api/index.ts
import express from 'express';
import dotenv from 'dotenv';
import { router as apiRouter } from '../src/server/api';

dotenv.config();

const app = express();

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Export aplikasi Express untuk Vercel Serverless Function
export default app;
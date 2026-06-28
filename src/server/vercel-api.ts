// src/server/vercel-api.ts
import express from 'express';
import dotenv from 'dotenv';
import { router as apiRouter } from './api';

dotenv.config();

const app = express();

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Export Express app for Vercel Serverless Function
export default app;

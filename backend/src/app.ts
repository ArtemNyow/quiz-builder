import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { quizRouter } from './modules/quizzes/quiz.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/quizzes', quizRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

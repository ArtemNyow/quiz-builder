import { env } from './config/env.js';
import { createApp } from './app.js';
import { prisma } from './prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Quiz Builder API listening on http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down.`);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

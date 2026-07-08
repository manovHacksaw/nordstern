import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { callbacksRouter } from './callbacks.js';
import { sep24Router } from './sep24.js';
import { walletRouter } from './walletApi.js';
import { adminRouter } from './admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'business-server' }));

  app.use('/callbacks', callbacksRouter);
  app.use('/sep24', sep24Router);
  app.use('/admin', adminRouter);
  app.use('/', walletRouter);

  return app;
}

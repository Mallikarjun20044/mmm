import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import './db/index.js';
import authRoutes from './modules/auth/routes.js';
import questionRoutes from './modules/questions/routes.js';
import examRoutes from './modules/exams/routes.js';
import resultRoutes from './modules/results/routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/exams', examRoutes);
app.use('/results', resultRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

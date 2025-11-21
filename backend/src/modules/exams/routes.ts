import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../db/store.js';
import { authRequired, requireRole } from '../../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const rows = await store.listExams();
  res.json(rows);
});

const examSchema = z.object({
  title: z.string().min(1),
  durationMinutes: z.number().int().min(1),
  startTime: z.string(),
  endTime: z.string(),
  questionIds: z.array(z.number().int()).default([])
});

router.post('/', authRequired, requireRole('Admin'), async (req, res) => {
  const parsed = examSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const e = parsed.data;
  const id = await store.createExam(e);
  res.status(201).json({ id });
});

export default router;

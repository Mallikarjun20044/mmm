import { Router } from 'express';
import { z } from 'zod';
import { store } from '../../db/store.js';
import { authRequired, requireRole } from '../../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const rows = await store.listQuestions();
  res.json(rows);
});

const qSchema = z.object({
  subject: z.string().default('General'),
  topic: z.string().default('General'),
  type: z.enum(['MCQ','TF','SUBJECTIVE']),
  text: z.string().min(1),
  options: z.array(z.string()).optional(),
  answerKey: z.string().optional(),
  marks: z.number().int().min(0).default(1),
  negativeMarks: z.number().int().min(0).default(0)
});

router.post('/', authRequired, requireRole('Admin'), async (req, res) => {
  const parsed = qSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
  const q = parsed.data;
  const id = await store.createQuestion({ subject: q.subject, topic: q.topic, type: q.type, text: q.text, options: q.options, answerKey: q.answerKey, marks: q.marks, negativeMarks: q.negativeMarks });
  res.status(201).json({ id });
});

export default router;

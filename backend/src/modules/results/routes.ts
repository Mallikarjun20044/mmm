import { Router } from 'express';
import { store } from '../../db/store.js';
import { authRequired } from '../../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const rows = await store.listResults();
  res.json(rows);
});

export default router;

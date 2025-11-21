import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtUser { id: number; email: string; role: 'Admin' | 'Student' }

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtUser;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role: 'Admin' | 'Student') {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

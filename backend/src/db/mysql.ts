import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

let pool: mysql.Pool | null = null;
function ensurePool() {
  if (!pool) {
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required for MySQL');
    const url = new URL(env.DATABASE_URL);
    pool = mysql.createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: url.username,
      password: url.password || undefined,
      database: url.pathname.replace(/^\//, ''),
      connectionLimit: 10,
      multipleStatements: true
    });
  }
  return pool;
}

export async function migrateMySQL(schemaSql: string) {
  const conn = await ensurePool().getConnection();
  try {
    await conn.query(schemaSql);
  } finally {
    conn.release();
  }
}

export const mysqlStore = {
  async getUserByEmail(email: string) {
    const [rows] = await ensurePool().execute('SELECT * FROM users WHERE email = ?', [email]);
    const r = rows as any[];
    return r[0] || null;
  },
  async listQuestions() {
    const [rows] = await ensurePool().query('SELECT id, subject, topic, type, text, marks, negative_marks FROM questions ORDER BY id DESC');
    return rows as any[];
  },
  async createQuestion(q: { subject?: string; topic?: string; type: string; text: string; options?: string[]; answerKey?: string|null; marks: number; negativeMarks: number; }) {
    const [res] = await ensurePool().execute(
      'INSERT INTO questions (subject, topic, type, text, options_json, answer_key, marks, negative_marks) VALUES (?,?,?,?,?,?,?,?)',
      [q.subject||'General', q.topic||'General', q.type, q.text, q.options? JSON.stringify(q.options) : null, q.answerKey??null, q.marks, q.negativeMarks]
    );
    // @ts-ignore
    return (res.insertId as number);
  },
  async listExams() {
    const [rows] = await ensurePool().query('SELECT id, title, duration_minutes, start_time, end_time FROM exams ORDER BY id DESC');
    return rows as any[];
  },
  async createExam(e: { title: string; durationMinutes: number; startTime: string; endTime: string; questionIds: number[]; }) {
    const conn = await ensurePool().getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.execute('INSERT INTO exams (title, duration_minutes, start_time, end_time) VALUES (?,?,?,?)', [e.title, e.durationMinutes, e.startTime, e.endTime]);
      // @ts-ignore
      const examId = res.insertId as number;
      for (let i=0;i<e.questionIds.length;i++) {
        await conn.execute('INSERT INTO exam_questions (exam_id, question_id, seq) VALUES (?,?,?)', [examId, e.questionIds[i], i+1]);
      }
      await conn.commit();
      return examId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  async listResults() {
    const [rows] = await ensurePool().query(
      'SELECT r.id, r.total_marks, r.obtained_marks, r.status, a.exam_id, a.user_id FROM results r JOIN attempts a ON r.attempt_id=a.id ORDER BY r.id DESC'
    );
    return rows as any[];
  }
};

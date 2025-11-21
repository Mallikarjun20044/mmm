import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool({ connectionString: env.DATABASE_URL });

export async function migrate(schemaSql: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export const pgStore = {
  async getUserByEmail(email: string) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return rows[0] || null;
  },
  async listQuestions() {
    const { rows } = await pool.query('SELECT id, subject, topic, type, text, marks, negative_marks FROM questions ORDER BY id DESC');
    return rows;
  },
  async createQuestion(q: { subject?: string; topic?: string; type: string; text: string; options?: string[]; answerKey?: string|null; marks: number; negativeMarks: number; }) {
    const { rows } = await pool.query(
      'INSERT INTO questions (subject, topic, type, text, options_json, answer_key, marks, negative_marks) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [q.subject||'General', q.topic||'General', q.type, q.text, q.options? JSON.stringify(q.options) : null, q.answerKey??null, q.marks, q.negativeMarks]
    );
    return rows[0].id as number;
  },
  async listExams() {
    const { rows } = await pool.query('SELECT id, title, duration_minutes, start_time, end_time FROM exams ORDER BY id DESC');
    return rows;
  },
  async createExam(e: { title: string; durationMinutes: number; startTime: string; endTime: string; questionIds: number[]; }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const r = await client.query('INSERT INTO exams (title, duration_minutes, start_time, end_time) VALUES ($1,$2,$3,$4) RETURNING id', [e.title, e.durationMinutes, e.startTime, e.endTime]);
      const examId = r.rows[0].id as number;
      for (let i=0; i<e.questionIds.length; i++) {
        await client.query('INSERT INTO exam_questions (exam_id, question_id, seq) VALUES ($1,$2,$3)', [examId, e.questionIds[i], i+1]);
      }
      await client.query('COMMIT');
      return examId;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  async listResults() {
    const { rows } = await pool.query(
      'SELECT r.id, r.total_marks, r.obtained_marks, r.status, a.exam_id, a.user_id FROM results r JOIN attempts a ON r.attempt_id=a.id ORDER BY r.id DESC'
    );
    return rows;
  }
};

import { env } from '../config/env.js';
import { tables } from './index.js';
import { pgStore } from './pg.js';
import { mysqlStore } from './mysql.js';

// Unified store API used by routes. Chooses JSON (lowdb) or PostgreSQL (pg) by env.

const isPg = env.DB_ENGINE === 'pg' && !!env.DATABASE_URL;
const isMy = env.DB_ENGINE === 'mysql' && !!env.DATABASE_URL;

export const store = {
  async getUserByEmail(email: string) {
    if (isPg) return pgStore.getUserByEmail(email);
    if (isMy) return mysqlStore.getUserByEmail(email);
    return tables.users().find(u => u.email === email) || null;
  },
  async listQuestions() {
    if (isPg) return pgStore.listQuestions();
    if (isMy) return mysqlStore.listQuestions();
    return tables.questions().map(q => ({ id: q.id, subject: q.subject, topic: q.topic, type: q.type, text: q.text, marks: q.marks, negative_marks: q.negative_marks }))
      .sort((a,b) => Number(b.id) - Number(a.id));
  },
  async createQuestion(q: { subject?: string; topic?: string; type: 'MCQ'|'TF'|'SUBJECTIVE'; text: string; options?: string[]; answerKey?: string|null; marks: number; negativeMarks: number; }) {
    if (isPg) return pgStore.createQuestion(q);
    if (isMy) return mysqlStore.createQuestion(q as any);
    const id = tables.nextId('questions');
    tables.questions().push({ id, subject: q.subject, topic: q.topic, type: q.type, text: q.text, options_json: q.options ? JSON.stringify(q.options) : null, answer_key: q.answerKey ?? null, marks: q.marks, negative_marks: q.negativeMarks, created_at: new Date().toISOString() });
    await tables.write();
    return id;
  },
  async listExams() {
    if (isPg) return pgStore.listExams();
    if (isMy) return mysqlStore.listExams();
    return tables.exams().map(e => ({ id: e.id, title: e.title, duration_minutes: e.duration_minutes, start_time: e.start_time, end_time: e.end_time }))
      .sort((a,b) => Number(b.id) - Number(a.id));
  },
  async createExam(e: { title: string; durationMinutes: number; startTime: string; endTime: string; questionIds: number[]; }) {
    if (isPg) return pgStore.createExam(e);
    if (isMy) return mysqlStore.createExam(e as any);
    const id = tables.nextId('exams');
    tables.exams().push({ id, title: e.title, duration_minutes: e.durationMinutes, start_time: e.startTime, end_time: e.endTime, created_at: new Date().toISOString() });
    e.questionIds.forEach((qid, idx) => tables.exam_questions().push({ exam_id: id, question_id: qid, seq: idx+1 }));
    await tables.write();
    return id;
  },
  async listResults() {
    if (isPg) return pgStore.listResults();
    if (isMy) return mysqlStore.listResults();
    return tables.results().map(r => {
      const a = tables.attempts().find(x => x.id === r.attempt_id);
      return { id: r.id, total_marks: r.total_marks, obtained_marks: r.obtained_marks, status: r.status, exam_id: a?.exam_id, user_id: a?.user_id };
    }).sort((a,b) => Number(b.id) - Number(a.id));
  }
};

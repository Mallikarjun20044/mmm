import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { env } from '../config/env.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

type User = { id: number; name: string; email: string; password_hash: string; role: 'Admin'|'Student'; created_at: string };
type Question = { id: number; subject?: string; topic?: string; type: 'MCQ'|'TF'|'SUBJECTIVE'; text: string; options_json?: string|null; answer_key?: string|null; marks: number; negative_marks: number; created_at: string };
type Exam = { id: number; title: string; duration_minutes: number; start_time: string; end_time: string; created_at: string };
type ExamQuestion = { exam_id: number; question_id: number; seq?: number };
type Attempt = { id: number; user_id: number; exam_id: number; status: string; started_at: string; submitted_at?: string|null };
type Answer = { attempt_id: number; question_id: number; response?: string|null; marks_awarded?: number|null };
type Result = { id: number; attempt_id: number; total_marks: number; obtained_marks: number; status: string; published_at: string };

type Data = {
  meta: { nextIds: Record<string, number> };
  users: User[];
  questions: Question[];
  exams: Exam[];
  exam_questions: ExamQuestion[];
  attempts: Attempt[];
  answers: Answer[];
  results: Result[];
};

const dbPath = path.resolve(process.cwd(), env.DB_FILE.endsWith('.json') ? env.DB_FILE : 'data.json');
const adapter = new JSONFile<Data>(dbPath);
export const db = new Low(adapter, {
  meta: { nextIds: {} },
  users: [], questions: [], exams: [], exam_questions: [], attempts: [], answers: [], results: []
});

await db.read();

function nextId(table: keyof Data) {
  const curr = db.data!.meta.nextIds[table as string] ?? 1;
  db.data!.meta.nextIds[table as string] = curr + 1;
  return curr;
}

// Seed admin user if absent
if (!db.data!.users.find(u => u.role === 'Admin')) {
  const hash = bcrypt.hashSync('Admin@123', 10);
  db.data!.users.push({ id: nextId('users'), name: 'Administrator', email: 'admin@example.com', password_hash: hash, role: 'Admin', created_at: new Date().toISOString() });
  await db.write();
}

export const tables = {
  users: () => db.data!.users,
  questions: () => db.data!.questions,
  exams: () => db.data!.exams,
  exam_questions: () => db.data!.exam_questions,
  attempts: () => db.data!.attempts,
  answers: () => db.data!.answers,
  results: () => db.data!.results,
  nextId,
  write: () => db.write()
};

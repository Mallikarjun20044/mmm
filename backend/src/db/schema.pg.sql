CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Admin','Student')),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  subject TEXT,
  topic TEXT,
  type TEXT NOT NULL CHECK(type IN ('MCQ','TF','SUBJECTIVE')),
  text TEXT NOT NULL,
  options_json TEXT,
  answer_key TEXT,
  marks INTEGER DEFAULT 1,
  negative_marks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_questions (
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  seq INTEGER,
  PRIMARY KEY (exam_id, question_id)
);

CREATE TABLE IF NOT EXISTS attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  status TEXT NOT NULL DEFAULT 'InProgress',
  started_at TIMESTAMP DEFAULT now(),
  submitted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
  attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  response TEXT,
  marks_awarded INTEGER,
  PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL UNIQUE REFERENCES attempts(id),
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Calculated',
  published_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Admin','Student')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT,
  topic TEXT,
  type TEXT NOT NULL CHECK(type IN ('MCQ','TF','SUBJECTIVE')),
  text TEXT NOT NULL,
  options_json TEXT,
  answer_key TEXT,
  marks INTEGER DEFAULT 1,
  negative_marks INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_questions (
  exam_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  seq INTEGER,
  PRIMARY KEY (exam_id, question_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'InProgress',
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE IF NOT EXISTS answers (
  attempt_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  response TEXT,
  marks_awarded INTEGER,
  PRIMARY KEY (attempt_id, question_id),
  FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL UNIQUE,
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Calculated',
  published_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES attempts(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT,
  action TEXT,
  details TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

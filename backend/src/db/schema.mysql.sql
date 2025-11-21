CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin','Student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(255),
  topic VARCHAR(255),
  type ENUM('MCQ','TF','SUBJECTIVE') NOT NULL,
  text TEXT NOT NULL,
  options_json TEXT,
  answer_key TEXT,
  marks INT DEFAULT 1,
  negative_marks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exam_questions (
  exam_id INT NOT NULL,
  question_id INT NOT NULL,
  seq INT,
  PRIMARY KEY (exam_id, question_id),
  CONSTRAINT fk_eq_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT fk_eq_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exam_id INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'InProgress',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_attempt_exam FOREIGN KEY (exam_id) REFERENCES exams(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS answers (
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  response TEXT,
  marks_awarded INT,
  PRIMARY KEY (attempt_id, question_id),
  CONSTRAINT fk_ans_attempt FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_ans_question FOREIGN KEY (question_id) REFERENCES questions(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL UNIQUE,
  total_marks INT NOT NULL,
  obtained_marks INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Calculated',
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_res_attempt FOREIGN KEY (attempt_id) REFERENCES attempts(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor VARCHAR(255),
  action VARCHAR(255),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

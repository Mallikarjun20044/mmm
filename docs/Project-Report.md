# Online Examination System — Software Engineering Mini-Project
Combined SDLC: Waterfall Model (Development) + V-Model (Verification & Validation)

## 1. Introduction

### 1.1 Problem Statement
Traditional examinations suffer from logistical overhead, limited scalability, delayed results, and security risks (paper leaks, impersonation). Institutions need a secure, scalable, and auditable online examination platform with automated evaluation, controlled scheduling, and robust analytics.

### 1.2 Objectives
- Provide secure authentication and role-based access (Admin, Student).
- Allow admins to manage question banks, create/schedule exams, and monitor attempts.
- Enable students to take timed exams with autosave and navigable sections.
- Automate evaluation for objective questions and support manual review for subjective ones.
- Generate results, analytics (scores, time taken, topic-wise performance), and downloadable reports.
- Ensure security, availability, and auditability (logging and traceability).

### 1.3 Scope
- Users: Admins and Students.
- Exam types: Objective (MCQ, True/False), Subjective (short/long).
- Platform features: Question bank, exam scheduling, attempt workflow, automatic grading, result publishing, analytics.
- Out of scope: Payment processing, large-scale webcam/AI proctoring (extension points provided).

### 1.4 Existing vs Proposed System
- Existing: Paper-based/manual tools; high effort, low scalability, slow results, security risks.
- Proposed: Web-based, centralized, role-based system; automated evaluation, scheduling, instant results, access control, and audit logs.

## 2. SDLC Approach

### 2.1 Waterfall Model (Development)
- Requirement Analysis: Elicit functional/non-functional requirements; define scope, constraints, interfaces.
- System Design: High-level architecture, data model, security model, technology stack selection.
- Implementation: Develop backend APIs, frontend UI, database schemas, and integrations.
- Integration: Assemble modules (auth, exams, questions, results) and verify contracts.
- Testing: Developer-level testing followed by QA cycles aligned to V-Model.
- Deployment: Package application, migrate schema, seed admin user, deploy to target environment.
- Maintenance: Bug fixes, performance tuning, incremental enhancements, security patches.

### 2.2 V-Model (Verification & Validation)
Verification (left side):
- Requirements Analysis → Acceptance Test Design
- System Design → System Test Design
- Architecture Design → Integration Test Design
- Module Design → Unit Test Design

Validation (right side):
- Unit Testing: Validate module-level logic (services, utilities).
- Integration Testing: Validate API routes + DB + middleware interactions.
- System Testing: Validate end-to-end user flows and NFRs (performance, security).
- Acceptance Testing: Validate business requirements with stakeholders against acceptance criteria.

### 2.3 Combined Usage
- Waterfall drives linear development phases to control scope and documentation.
- V-Model ensures each development artifact has a corresponding test activity and traceability.
- Together: Predictable delivery with strong quality assurance and clear sign-offs.

## 3. Requirements

### 3.1 Functional Requirements
- FR1: User Authentication (login, JWT-based session), password hashing, roles (Admin, Student).
- FR2: Admin can create/update/delete users; reset passwords.
- FR3: Question Bank Management: CRUD questions; metadata: subject, topic, difficulty, marks, type (MCQ/TF/Subjective).
- FR4: Exam Creation & Scheduling: Title, duration, start/end window, allowed attempts.
- FR5: Exam Composition: Randomization by topic/difficulty; fixed/pooled questions; negative marking support.
- FR6: Student Exam Attempt: Start exam within schedule, timer, autosave answers, navigate prev/next, submit.
- FR7: Automatic Evaluation: Objective questions auto-graded; subjective queued for manual review (optional).
- FR8: Results: Calculate score, rank, publish results; allow re-evaluation (admin).
- FR9: Analytics: Per-exam and per-student performance; topic-wise breakdown; export CSV/PDF.
- FR10: Audit & Logs: Login events, exam attempts, submissions, result publication with timestamps.
- FR11: Access Control: Role-based route protection; admin-only management of exams/questions/users.

### 3.2 Non-Functional Requirements
- NFR1 Performance: Support 1,000 concurrent students per node; API p95 < 300ms for common operations.
- NFR2 Availability: 99.5% uptime for exam windows.
- NFR3 Security: OWASP ASVS practices; salted hash (bcrypt), JWT expiry/refresh; HTTPS in production; input validation.
- NFR4 Scalability: Horizontal scaling behind a load balancer; stateless APIs; DB connection pooling.
- NFR5 Reliability: Autosave every 10 seconds, idempotent submission, recoverable from tab refresh.
- NFR6 Usability: Accessible UI (WCAG AA), keyboard navigation, responsive design.
- NFR7 Auditability: Immutable logs for exam events; time-stamped entries.
- NFR8 Compliance: Data protection and retention policies; configurable PII retention.

### 3.3 Hardware/Software Requirements
- Server: 2 vCPU, 4–8 GB RAM, SSD; Node.js 18+, SQLite/PostgreSQL; Windows/Linux.
- Client: Modern browser (Chrome/Edge/Firefox), 4+ GB RAM.
- Software: Node.js, npm, Git, VS Code.

## 4. System Design

References to Mermaid diagrams under `docs/diagrams`.

- Use Case: `diagrams/use-cases.mmd`
- DFD Level 0/1/2: `diagrams/dfd-l0.mmd`, `diagrams/dfd-l1.mmd`, `diagrams/dfd-l2.mmd`
- ER Diagram: `diagrams/er.mmd`
- UML: Class `diagrams/class-diagram.mmd`, Sequence (Login/Exam) `diagrams/sequence-login.mmd`, `diagrams/sequence-exam.mmd`, Activity `diagrams/activity-exam.mmd`, State `diagrams/state-attempt.mmd`
- Deployment: `diagrams/deployment.mmd`
- System Architecture: `diagrams/architecture.mmd`

### 4.1 Architecture Summary
- Frontend: React TS SPA with role-based views.
- Backend: RESTful API (Express TS), JWT auth, input validation, centralized error handling.
- Database: Relational (SQLite for demo; can swap to PostgreSQL).
- Security: Bcrypt for passwords, JWT for sessions, RBAC middleware.
- Observability: Basic request logging; audit table for critical events.

## 5. Modules Description
- User Authentication: Login, JWT issuance, password hashing; refresh token hook.
- Admin Panel: Manage users, questions, exams; monitor attempts; publish results; analytics.
- Student Panel: View upcoming exams, start/continue attempts, submit, view results.
- Question Bank Management: CRUD, bulk import/export, tagging by subject/topic/difficulty.
- Exam Creation & Scheduling: Compose exams, set duration, availability window, randomization pools.
- Automatic Evaluation: Auto-grade objective answers; compute partial/negative marking; queue subjective for review.
- Result Generation & Performance Analysis: Aggregate scores, ranks, item analysis, topic-wise metrics; export.

## 6. Testing (V-Model Aligned)

### 6.1 Unit Testing Plan
Scope: Services (auth, questions, exams), utilities (scoring, validation).

Sample Test Cases:
- UT-01: Password hashing and verification.
- UT-02: JWT generation and verification.
- UT-03: Scoring engine handles negative marking and unanswered items.
- UT-04: Exam scheduling validity (within window).

### 6.2 Integration Testing Plan
Scope: API routes + DB + middleware.

Sample Test Cases:
- IT-01: POST /auth/login returns token for valid user.
- IT-02: POST /exams creates exam, GET /exams lists it.
- IT-03: POST /questions creates question, GET /questions returns it.
- IT-04: Results generation computes scores after submission.

### 6.3 System Testing Plan
- Validate end-to-end flows: Admin creates exam → Student attempts → Auto-evaluate → Results published.
- Validate NFRs: Performance under 200 users; security scans (common OWASP risks), usability checks.

### 6.4 Acceptance Testing Plan
- Derived from FR1–FR11; stakeholder sign-off with traceability matrix (RTM).

## 7. Implementation

### 7.1 Sample UI Mockups
- Login: Email/password form; error state. [Placeholder]
- Dashboard: Upcoming exams list with start times. [Placeholder]
- Exam Screen: Timer top-right, question pane, navigation. [Placeholder]
- Results: Score summary, topic-wise chart. [Placeholder]

### 7.2 Database Schema/Tables (SQLite)
See `backend/src/db/schema.sql` for the DDL.

### 7.3 Backend/Frontend Code Samples
- Backend: Express + TypeScript in `backend/src`. Minimal routes `/auth/login`, `/questions`, `/exams`, `/results`.
- Frontend: React TS in `frontend/src` with `Login`, `Dashboard`, `TakeExam`, `Results`, `AdminPanel` pages.

### 7.4 Screenshots (Placeholder Descriptions)
- S1: Admin creates a new exam (title, duration, window).
- S2: Student starts exam within allowed time; timer visible.
- S3: Automatic evaluation result shown post submission.
- S4: Admin views analytics and exports CSV.

## 8. Advantages of Hybrid Waterfall + V-Model
- Predictability: Clear milestones and documentation (Waterfall) with mapped test activities (V-Model).
- Traceability: Each artifact has linked tests; strong RTM alignment.
- Quality Focus: Early test design catches ambiguity and gaps.
- Suitability: Exam systems have stable, regulated requirements and high quality/security needs.

## 9. Conclusion
A hybrid Waterfall + V-Model approach provides a predictable, traceable, and high-quality delivery path for an Online Examination System, combining strong upfront design with rigorous verification and validation throughout.

## 10. References
- Pressman, R. S., & Maxim, B. R. Software Engineering: A Practitioner’s Approach.
- Sommerville, I. Software Engineering.
- OWASP ASVS & Top 10.
- ISO/IEC/IEEE 29119 Software Testing.

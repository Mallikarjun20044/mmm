# Online Examination System (Waterfall + V-Model)

This repository contains a complete Software Engineering mini-project for an Online Examination System using a combined SDLC approach: Waterfall for development and V-Model for verification/validation.

- docs: Academic report, diagrams, testing plans
- backend: Minimal API server (Node.js + Express + TypeScript + SQLite)
- frontend: Minimal React + Vite TypeScript UI

Quick start (Windows, PowerShell):

Backend (JSON store by default)
````powershell
cd "backend"
npm install
npm run dev
````

Frontend (in a new terminal)
````powershell
cd "frontend"
npm install
npm run dev
````

## Backend Deploy (Render)

Use the included `render.yaml` (Infrastructure as Code) to deploy the backend:

1) Push this repo to GitHub (done if you're reading this there).
2) Go to https://dashboard.render.com/iac and import the repository.
3) Render provisions a free Node Web Service from `backend/`.
4) After deploy, note the URL (e.g., `https://your-api.onrender.com`).

Backend uses a JSON store by default (`DB_ENGINE=json`). You can switch to MySQL/Postgres later.

## Deploy to Vercel (Frontend)

This monorepo deploys the frontend to Vercel. The backend runs elsewhere (Render/Railway/VPS). Point the frontend to that backend URL via an env variable.

Steps:
- Import the repo in Vercel.
- If using repo root as project:
  - Build Command: `cd frontend && npm ci && npm run build`
  - Output Directory: `frontend/dist`
- Or set Root Directory to `frontend` (auto-detect Vite).
- Add Environment Variable: `VITE_API_BASE=https://your-backend.example.com`
- Deploy.

Frontend uses `VITE_API_BASE` for API calls (fallback: `http://localhost:3001`).

Read the full report in `docs/Project-Report.md`. Diagrams are in `docs/diagrams` (Mermaid `.mmd`).

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

## Deploy to Vercel (Frontend)

This monorepo deploys the frontend to Vercel. The backend is a long-running Express API and should be hosted separately (e.g., Render/Railway/VPS). Point the frontend to that API via an environment variable.

Steps:
- Push this repository to GitHub.
- Import into Vercel from GitHub.
- If using repo root as project:
	- Build Command: `cd frontend && npm ci && npm run build`
	- Output Directory: `frontend/dist`
- Or set Root Directory to `frontend` and let Vercel auto-detect Vite.
- Add Environment Variable: `VITE_API_BASE=https://your-backend.example.com`
- Deploy.

Frontend uses `VITE_API_BASE` for API calls (fallback: `http://localhost:3001`).
````

Read the full report in `docs/Project-Report.md`. Diagrams are in `docs/diagrams` (Mermaid `.mmd`).

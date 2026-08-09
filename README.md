# Achievo

A small productivity tracker (progress + todos) with frontend (Vite + React) and a lightweight Express backend.

Quick start (development)
1. Install dependencies:

```bash
npm install
```

2. Start both servers (backend + Vite frontend):

```bash
npm run dev
```

3. Open the frontend in your browser (Vite prints the exact URL, typically http://localhost:3000).

How it works
- Backend: [backend/server.js](backend/server.js) (default port 5000, configurable with `PORT` env var).
- Frontend: Vite serves the app and proxies `/api` to the backend (see [vite.config.js](vite.config.js)).
- Data is stored in JSON files under [backend/data](backend/data).

Demo accounts and simple API
You can create demo users from the UI (Auth panel) or with curl:

```bash
# create user
curl -X POST -H "Content-Type: application/json" http://localhost:5000/api/auth/signup -d '{"username":"demo","password":"pass"}'

# login
curl -X POST -H "Content-Type: application/json" http://localhost:5000/api/auth/login -d '{"username":"demo","password":"pass"}'
```

Per-user data
- Progress and todos are scoped to the signed-in user. Sign in as different users to see different data.

Production build
1. Build frontend:

```bash
npm run build
```

2. Serve the built frontend with the backend (backend serves `frontend/dist`):

```bash
node backend/server.js
# or set a specific port:
PORT=5000 node backend/server.js
```

Troubleshooting
- If port 5000 is already in use, find and stop the process:

```bash
lsof -iTCP:5000 -sTCP:LISTEN -P -n
kill <PID>
```

- If Vite fails to bind to 3000, either stop the process using it, or run Vite on a different port:

```bash
vite --port 3001
```

Files you may inspect
- Frontend entry: [frontend/src/App.jsx](frontend/src/App.jsx)
- Progress routes: [backend/routes/progressRoutes.js](backend/routes/progressRoutes.js)
- Todo routes: [backend/routes/todoRoutes.js](backend/routes/todoRoutes.js)

If you want, I can add pre-filled demo accounts and sample data before your review — say "add demo data" and I'll populate a few users and entries.

Local dev URLs
- Frontend (Vite dev): http://localhost:3000/  (if 3000 is occupied, Vite may use 3001, 3002, ...)
- Backend (API + production preview): http://localhost:5000/

If you start the app with `npm run dev`, Vite prints the exact frontend URL in its output — open that URL in your browser. If a port is in use, stop the conflicting process or open the alternate port Vite reports.

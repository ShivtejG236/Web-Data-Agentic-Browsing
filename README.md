# NemoForge — Secure AI Web Data Agent Platform

> **Built for the Bright Data × NVIDIA AI Agents Web Data Hackathon**

NemoForge is a production-ready, end-to-end AI agent platform that autonomously researches the web. It combines **Bright Data's Scraping Browser** for network-level evasion, **Ghost Cursor** for behavioural stealth, and **NVIDIA's Llama-3.1-8b-instruct** model (via the NVIDIA NIM API) for analyst-grade DOM comprehension — all streamed live to a premium Cream Neumorphic UI.

---

## How It Works — Two-Stage Pipeline

NemoForge is not a single model. It is a pipeline of two specialist systems working in sequence:

```
  USER PROMPT  ──▶  Stage 1: NemoClaw Agent          ──▶  Stage 2: NVIDIA Intelligence
                    ─────────────────────────────          ────────────────────────────
                    Bright Data Scraping Browser           meta/llama-3.1-8b-instruct
                    Ghost Cursor (Bézier paths)            via NVIDIA NIM API
                    Puppeteer orchestration                
                    ↓ Live viewport screenshots            ↓ Analyst-grade response
                    ↓ Execution logs (WebSocket)           ↓ Markdown export
                    ↓ Cleaned DOM text ──────────────────▶ (fed as context)
```

**Stage 1 — NemoClaw Browser Agent:** Navigates the target site using a Bright Data residential Scraping Browser, moves the mouse with human-like Bézier curves via Ghost Cursor, streams live base64 viewport screenshots and execution logs to the frontend over WebSockets, and extracts the cleaned page DOM.

**Stage 2 — NVIDIA Llama-3.1 Intelligence:** The cleaned DOM text is sent alongside the user's original natural language prompt to `meta/llama-3.1-8b-instruct` via the NVIDIA NIM API (`integrate.api.nvidia.com/v1/chat/completions`). The model acts as an expert analyst and returns a structured, human-readable Markdown answer — like a chatbot that actually read the page.

---

## Features

| Layer | Technology | What it does |
|---|---|---|
| **Network Evasion** | Bright Data Scraping Browser | Residential IP rotation, TLS fingerprint spoofing, CAPTCHA bypass |
| **Behavioural Stealth** | Ghost Cursor (`ghost-cursor`) | Bézier-curve mouse paths statistically indistinguishable from humans |
| **Intelligence** | NVIDIA Llama-3.1-8b-instruct (NIM API) | Analyst-grade DOM comprehension; no brittle CSS selectors |
| **Orchestration** | Node.js + WebSockets | Real-time execution logs + base64 viewport screenshots streamed to the UI |
| **Frontend** | React 19 + Vite + Framer Motion + Zustand | Premium Cream Neumorphic UI with smooth micro-interactions |
| **Persistence** | SQLite (`better-sqlite3`) | Session history, agent logs, and result storage |
| **Deployment** | Render (backend) + Vercel (frontend) | Docker-ready; `render.yaml` Blueprint included for one-click backend deploy |

---

## Quick Start (Local Demo)

1. Clone or unpack the repository.
2. Run the one-click launch script:
   ```bash
   chmod +x scripts/launch.sh
   ./scripts/launch.sh
   ```
3. The platform will be available at `http://localhost:5173`.

> **Note:** Standard and Advanced stealth modes use your local Google Chrome installation. To use Bright Data's remote Scraping Browser on a cloud server, set `BRIGHTDATA_WS_ENDPOINT` in your `.env`.

---

## Environment Configuration

Copy `.env.example` to `.env` at the project root and fill in your credentials:

```env
# Backend
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# Bright Data — Scraping Browser (WebSocket endpoint)
BRIGHTDATA_WS_ENDPOINT=wss://brd-customer-[ID]-zone-[ZONE]:[PASS]@brd.superproxy.io:9222

# Bright Data — Web Unlocker (HTTP proxy)
BRIGHTDATA_PROXY_URL=http://brd-customer-[ID]-zone-web_unlocker1:[PASS]@brd.superproxy.com:22225

# NVIDIA NIM API (Llama-3.1-8b-instruct)
NEMOCLAW_API_KEY=nvapi-...

# Database
DB_PATH=./nemoforge.sqlite
```

### Vercel (Frontend) environment variables
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_WS_URL` | `wss://your-backend.onrender.com` |

### Render (Backend) environment variables
| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Any strong random string |
| `NEMOCLAW_API_KEY` | Your NVIDIA NIM API key |
| `BRIGHTDATA_WS_ENDPOINT` | Your Bright Data Scraping Browser WS URL |
| `BRIGHTDATA_PROXY_URL` | Your Bright Data Web Unlocker HTTP URL |

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                      │
│   React 19 · Vite · Tailwind · Framer Motion · Zustand     │
│   Cream Neumorphic UI · Live WS log stream · MD export     │
└───────────────────┬────────────────────────────────────────┘
                    │ WebSocket + REST
┌───────────────────▼─────────────────────────────────────────┐
│               ORCHESTRATOR (Render — Node.js)               │
│   Express · WebSocket server · BullMQ job queue · SQLite    │
│   Streams: execution logs + base64 screenshots in real-time │
└──────┬────────────────┬─────────────────────────────────────┘
       │                │                         │
┌──────▼──────┐  ┌──────▼───────┐       ┌──────────▼──────────┐
│ Bright Data │  │ Ghost Cursor │       │    NVIDIA NIM API   │
│  Scraping   │  │  ghost-cursor│       │ meta/llama-3.1-8b-  │
│  Browser    │  │  Bézier paths│       │     instruct        │
│  WS connect │  │  Injected in │       │ DOM → intelligence  │
│  IP rotation│  │  browser     │       │ Analyst-grade output│
└──────┬──────┘  └──────────────┘       └─────────────────────┘
       │
┌──────▼──────────────────────────────┐
│         TARGET WEB                  │
│  Amazon · Cloudflare-protected sites│
└─────────────────────────────────────┘
```

---

## Project Structure

```
/
├── frontend/          # React 19, Vite, Tailwind CSS v4, Framer Motion, Zustand
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   │   ├── orchestrator.ts  # Core agent loop + WS broadcasting
│   │   │   ├── stealth.ts       # Bright Data / local Puppeteer launcher
│   │   │   └── worker.ts        # BullMQ job worker
│   │   ├── db/database.ts       # SQLite session persistence
│   │   ├── middleware/auth.ts   # JWT auth middleware
│   │   └── routes/              # Express REST routes
│   └── package.json
├── scripts/launch.sh  # One-click local dev launcher
├── render.yaml        # Render Blueprint for one-click backend deploy
└── .env.example       # Environment variable template
```

---

## Stealth Modes

| Mode | Browser | Use case |
|---|---|---|
| **Standard** | Local Chromium (puppeteer-core) | Local testing |
| **Advanced** | Local Chromium + Stealth Plugin | Local testing with extra evasion flags |
| **Bright Data** | Remote Bright Data Scraping Browser | Production — enterprise anti-bot bypass |
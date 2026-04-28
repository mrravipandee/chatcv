# ChatCV — AI Resume Builder

> Build your resume by just chatting. No forms, no templates to fill — just talk and watch your resume come alive.

![ChatCV Dashboard](https://chatcv-gamma.vercel.app/og-image.png)

---

## What is ChatCV?

ChatCV is a full-stack AI-powered resume builder where you **chat with an AI assistant** to build your resume in real time. Tell it your name, your skills, your experience — and it automatically structures everything into a professional resume, live on screen.

When you're done, download it as a **LaTeX-compiled PDF** or copy the raw `.tex` source to edit in Overleaf.

---

## How it works

```
You type:  "Hi, I'm Ravi, I'm a Backend Developer"
    ↓
AI extracts your name + role → updates resume live
    ↓
You type:  "I know Node.js, MongoDB, Docker"
    ↓
AI appends skills → resume updates instantly
    ↓
Click PDF → LaTeX compiled → downloaded to your machine
```

---

## Features

- 💬 **Chat to build** — conversational resume building, no forms
- 👁️ **Live preview** — resume updates in real time as you chat
- 📄 **LaTeX PDF export** — professional PDF via ytotech compiler
- 📋 **Copy `.tex` source** — paste into Overleaf to edit further
- 🗂️ **Multiple resumes** — create and switch between resumes
- 💾 **Auto-save** — chat history and resume data persisted
- 🔐 **Auth** — JWT-based login with OTP email verification
- 💳 **Free / Premium plans** — free tier with one chat session

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- WebSocket (real-time PDF status)

**Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Google Gemini AI (`gemini-2.0-flash`)
- WebSocket (`ws`) for live PDF generation updates
- ytotech LaTeX compiler API

---

## Project Structure

```
chatcv/
├── client/                         # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── dashboard/          # Main resume workspace
│       │   ├── login/
│       │   └── register/
│       ├── components/
│       │   └── dashboard/
│       │       ├── ChatPanel.tsx   # Chat UI
│       │       ├── ResumePreview.tsx # Live preview + PDF/LaTeX export
│       │       └── Sidebar.tsx     # Resume list + navigation
│       └── lib/
│           └── api.ts              # API client with retry logic
│
└── server/                         # Express backend
    └── src/
        ├── modules/
        │   ├── auth/               # Register, OTP verify, login
        │   ├── chat/               # AI chat service + Gemini integration
        │   └── resume/             # Resume CRUD
        ├── latex/
        │   ├── latex.builder.ts    # Pure TS LaTeX template builder
        │   ├── latex.compiler.ts   # ytotech API caller
        │   ├── latex.service.ts    # PDF pipeline orchestrator
        │   └── pdf.store.ts        # In-memory PDF store (10min TTL)
        └── ws/
            └── ws.manager.ts       # WebSocket connection manager
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key → [get one here](https://aistudio.google.com)

### 1. Clone the repo

```bash
git clone https://github.com/mrravipandee/chatcv.git
cd chatcv
```

### 2. Setup backend

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

**`server/.env`**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chatcv
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
YTOTECH_URL=https://latex.ytotech.com/builds/sync
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Setup frontend

```bash
cd client
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

**`client/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 4. Open the app

```
http://localhost:3000
```

---

## PDF Generation Flow

```
User clicks "PDF"
    ↓
Frontend opens WebSocket → ws://server/ws/:resumeId
    ↓
POST /api/latex/generate { resumeId }
    ↓
Backend fetches resume from MongoDB
    ↓
Builds LaTeX string (pure TypeScript, no LLM)
    ↓
Sends to ytotech.com → compiles to PDF
    ↓
WebSocket pushes status: fetching → building → compiling → done
    ↓
Frontend auto-downloads PDF
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://mongodb.com/atlas) |

**Live:** [chatcv-gamma.vercel.app](https://chatcv-gamma.vercel.app)

---

## Author

**Ravi Pandey** — [@mrravipandee](https://github.com/mrravipandee)

---

## License

MIT
# ChatCV — AI Resume Builder

> Build your resume by just chatting. No forms, no templates to fill — just talk and watch your resume come alive.

![ChatCV Dashboard](https://resumebuilder-chatcv.vercel.app/og-image.png)

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
- 📰 **Dynamic Blog System** — SSR & ISR blog engine backed by MongoDB with on-demand cache revalidation, category/tag filtering, and automated database seeding
- 🛡️ **Admin CMS & SEO Console** — full blog management with draft protection, role-based authorization, and real-time SEO diagnostics

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (v4)
- WebSocket (real-time PDF status)

**Backend**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Google Gemini AI (`gemini-2.0-flash`)
- WebSocket (`ws`) for live PDF generation updates
- ytotech LaTeX compiler API

---

## SEO & Search Indexing Architecture

To achieve premium search engine visibility, ChatCV features a dedicated growth engineering framework:
- **Dynamic Blog Engine**: SSR and ISR rendered articles with 1-hour cache tags, on-demand revalidation (`/api/revalidate`), and zero client JavaScript waterfall.
- **Index Guarding**: All private routes under `/dashboard/` and `/login`/`/register`/`/verify-otp` layout files are strictly configured with `noindex, nofollow` metadata headers.
- **Client-Server Metadata Separation**: The waitlist page `/subscribe` and blog pages export dynamic search metadata wrapping interactive client components.
- **Dynamic Sitemaps & Robots**: Auto-aligns allowed crawl rules. The sitemap dynamically generates public post links and career example directories while excluding drafts and forbidden routes.
- **JSON-LD Schema Markup**: The root HTML and article templates dynamically register:
  - **Article / NewsArticle Schema**: Enhanced rich snippets for blog posts.
  - **BreadcrumbList Schema**: Structured hierarchical navigation.
  - **Organization Schema**: Connects ChatCV with brand assets.
  - **WebSite Schema**: Adds Sitelinks Searchbox compatibility.
  - **SoftwareApplication Schema**: Drives rich visual product search cards.

---

## Blog API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/blogs` | List published blog posts (paginated, filtered by category/tag/search) | Public |
| `GET` | `/api/blogs/:slug` | Get single published article with related posts & view count | Public |
| `GET` | `/api/blogs/meta/categories` | Get all blog categories with article counts | Public |
| `GET` | `/api/blogs/meta/tags` | Get all blog tags with article counts | Public |
| `GET` | `/api/blogs/featured` | Get currently featured blog post | Public |
| `GET` | `/api/admin/blogs` | List all blogs (drafts, published, archived) | Admin JWT |
| `POST` | `/api/admin/blogs` | Create a new blog post | Admin JWT |
| `GET` | `/api/admin/blogs/:id` | Get blog post by ID for editing | Admin JWT |
| `PUT` | `/api/admin/blogs/:id` | Update existing blog post | Admin JWT |
| `PATCH` | `/api/admin/blogs/:id/status` | Update publication status (`draft` / `published` / `archived`) | Admin JWT |
| `DELETE` | `/api/admin/blogs/:id` | Delete blog post | Admin JWT |

---

## Project Structure

```
chatcv/
├── client/                         # Next.js 16 frontend (App Router)
│   └── src/
│       ├── app/
│       │   ├── (marketing)/
│       │   │   ├── blog/           # Dynamic SSR/ISR Blog routes
│       │   │   │   ├── [slug]/     # Dynamic article page + SEO metadata
│       │   │   │   ├── category/   # Category index & dynamic category pages
│       │   │   │   ├── tag/        # Tag cloud & dynamic tag pages
│       │   │   │   └── author/     # Author directories & profiles
│       │   │   └── resume-examples/ # Programmatic career resume guides
│       │   ├── admin/              # Protected admin control console
│       │   ├── api/
│       │   │   └── revalidate/     # On-demand Next.js cache revalidation
│       │   ├── dashboard/          # Main resume workspace
│       │   ├── sitemap.ts          # Real-time dynamic XML sitemap
│       │   └── feed.xml/           # Dynamic RSS 2.0 feed
│       ├── components/
│       │   ├── blog/               # Blog cards, reading progress, TOC
│       │   └── dashboard/          # ChatPanel, ResumePreview, Sidebar
│       └── lib/
│           ├── api.ts              # API client with retry logic
│           ├── blog.ts             # Dynamic blog loader with ISR + fallback
│           └── blogAdminApi.ts     # Admin blog management API client
│
└── server/                         # Express 5 backend
    └── src/
        ├── modules/
        │   ├── admin/              # Admin metrics, SEO audits, logs
        │   ├── auth/               # Register, OTP verify, login
        │   ├── blog/               # Blog model, routes, controller, service
        │   ├── chat/               # AI chat service + Gemini integration
        │   └── resume/             # Resume CRUD
        ├── latex/
        │   ├── latex.builder.ts    # Pure TS LaTeX template builder
        │   ├── latex.compiler.ts   # ytotech API caller
        │   ├── latex.service.ts    # PDF pipeline orchestrator
        │   └── pdf.store.ts        # In-memory PDF store (10min TTL)
        ├── utils/
        │   └── seeder.ts           # Automatic database bootstrap seeder
        └── wa/
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

## Contributing

We welcome contributions to ChatCV! Please read [CONTRIBUTING.md](file:///Users/ravipandey/Ravii/Web%202.0/MERN/fullstack/chatcv/CONTRIBUTING.md) for details on code style, lint check rules, and submission pipelines.

---

## Author

**Ravi Pandey** — [@mrravipandee](https://github.com/mrravipandee)

---

## License

MIT
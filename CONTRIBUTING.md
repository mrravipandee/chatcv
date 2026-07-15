# Contributing to ChatCV

First off, thank you for taking the time to contribute to ChatCV! We appreciate your support in making the conversational resume builder better.

Following these guidelines helps ensure a smooth contribution process for everyone.

---

## Technical Standards & Code Guidelines

### 1. TypeScript & React (Next.js App Router)
- **Next.js 16 (App Router)**: Leverage Server and Client components appropriately.
- **Client Components**: Prefix files that require hooks or side-effects with `"use client";`. Avoid nesting metadata exports in client components; use a Server wrapper instead.
- **TypeScript**: Always define strict type interfaces. Do not use `any`.

### 2. Styling with Tailwind CSS (v4)
- Maintain dark-mode visual continuity (use `#050505` black base and neon emerald accent highlights like `#00ff9c`).
- Leverage standard classes rather than ad-hoc custom rules.

### 3. SEO & Indexing Best Practices
- **No-Index Rules**: All private dashboards, billing paths, internal APIs, and authentication forms must export indexation blockers:
  ```typescript
  export const metadata = {
    robots: {
      index: false,
      follow: false,
    },
  };
  ```
- **Static Metadata**: Supply clear page-level titles, canonical alternates, and meta descriptions to target landing paths.
- **Path Standards**: Never use relative image assets (e.g., `./logo.svg`) in shared components like Navbar or Footer. Always use root-absolute paths (e.g., `/logo.svg`) so they resolve correctly on nested paths.

---

## Development Workflow

### Step 1: Clone and Setup
1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/your-username/chatcv.git
   cd chatcv
   ```
2. Follow the setup instructions in the [README.md](file:///Users/ravipandey/Ravii/Web%202.0/MERN/fullstack/chatcv/README.md) to set up both the backend `server` and frontend `client`.

### Step 2: Build Verification
Before staging your changes for commit, ensure the application builds successfully:
```bash
# In client/
npm run build
npm run lint

# In server/
npm run build
```

### Step 3: Git Commit & Push Guidelines
- Write descriptive commit messages matching standard conventions (e.g., `feat: add PDF template options` or `fix: handle token expiry in auth guard`).
- Push your changes to your fork and submit a Pull Request (PR) to the `main` branch.

Thank you for contributing!

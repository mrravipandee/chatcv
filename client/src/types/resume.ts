// ─── Contact / Links ──────────────────────────────────────────────────────────

export interface Link {
  label: string; // "GitHub", "LinkedIn", "Portfolio"
  url: string;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface SkillGroup {
  category: string; // "Frontend", "Backend", "Soft Skills"
  items: string[];
}

// ─── Experience ───────────────────────────────────────────────────────────────

export interface Experience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  name: string;
  tags: string[];    // tech stack tags
  bullets: string[]; // description points
  liveUrl?: string;
  githubUrl?: string;
}

// ─── Education ────────────────────────────────────────────────────────────────

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

// ─── Achievement ──────────────────────────────────────────────────────────────

export interface Achievement {
  title: string;
  description?: string;
}

// ─── Full Resume Data (mirrors server IResumeData exactly) ───────────────────

export interface ResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  links: Link[];
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  achievements: Achievement[];
}

// ─── Chat & Resume ────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  createdAt?: string;
}

export interface Resume {
  _id: string;
  title: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}
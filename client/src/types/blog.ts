export interface BlogAuthor {
  name: string;
  slug: string; // URL-safe slug for author page, e.g. "ravi-pandey"
  role: string;
  avatar: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
}

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'code' | 'callout' | 'table';
  level?: 2 | 3 | 4; // for heading elements <h2>, <h3>, <h4>
  text?: string;
  items?: string[]; // for lists
  ordered?: boolean; // for ordered lists
  src?: string; // for images
  alt?: string; // for images
  caption?: string; // for images
  code?: string; // for code blocks
  language?: string; // for code syntax highlighting
  style?: 'info' | 'warning' | 'success'; // style classes for callout box
  headers?: string[]; // for table header row
  rows?: string[][]; // for table content rows
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PostCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  type: 'banner' | 'card' | 'sidebar' | 'interactive';
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'informational' | 'transactional' | 'commercial' | 'navigational';
  difficulty: 'easy' | 'medium' | 'hard';
  contentType: 'pillar' | 'supporting' | 'comparison' | 'guide';
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: BlogAuthor;
  publishDate: string;
  updatedDate: string;
  readingTime: number; // in minutes
  featuredImage: string;
  imageAltText: string;
  content: ContentBlock[];
  faqs?: FAQItem[];
  cta?: PostCTA;
  relatedPostsSlugs: string[];
  seo: SEOData;
  featured: boolean;
  draft: boolean;
  language: string;
}

export interface ProgrammaticResumeRole {
  role: string; // URL-safe slug e.g. "software-engineer"
  title: string; // page title e.g. "Software Engineer Resume Examples"
  jobTitle: string; // e.g. "Software Engineer"
  industry: string; // e.g. "Technology"
  experienceLevel: 'entry' | 'mid' | 'senior' | 'all';
  metaDescription: string;
  summaryExamples: Array<{
    title: string;
    text: string;
  }>;
  atsKeywords: string[];
  bulletPoints: Array<{
    category: string;
    points: string[];
  }>;
  latexCode: string;
  faqs: FAQItem[];
  relatedRoles: string[];
  updatedDate: string;
}

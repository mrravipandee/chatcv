import { Schema, model, Document } from 'mongoose';

export interface IBlogAuthor {
  name: string;
  slug: string;
  role: string;
  avatar: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
}

export interface IContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'code' | 'callout' | 'table';
  level?: 2 | 3 | 4;
  text?: string;
  items?: string[];
  ordered?: boolean;
  src?: string;
  alt?: string;
  caption?: string;
  code?: string;
  language?: string;
  style?: 'info' | 'warning' | 'success';
  headers?: string[];
  rows?: string[][];
}

export interface IFAQItem {
  question: string;
  answer: string;
}

export interface IPostCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  type: 'banner' | 'card' | 'sidebar' | 'interactive';
}

export interface ISEOData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: 'informational' | 'transactional' | 'commercial' | 'navigational';
  difficulty?: 'easy' | 'medium' | 'hard';
  contentType?: 'pillar' | 'supporting' | 'comparison' | 'guide';
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: IBlogAuthor;
  status: 'draft' | 'published' | 'archived';
  publishDate: Date;
  updatedDate: Date;
  readingTime: number;
  featuredImage: string;
  imageAltText?: string;
  content: IContentBlock[];
  faqs?: IFAQItem[];
  cta?: IPostCTA;
  relatedPostsSlugs?: string[];
  seo: ISEOData;
  featured: boolean;
  language: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading', 'list', 'image', 'code', 'callout', 'table'],
    },
    level: { type: Number, enum: [2, 3, 4] },
    text: { type: String },
    items: [{ type: String }],
    ordered: { type: Boolean, default: false },
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    code: { type: String },
    language: { type: String },
    style: { type: String, enum: ['info', 'warning', 'success'] },
    headers: [{ type: String }],
    rows: [[{ type: String }]],
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    author: {
      name: { type: String, required: true },
      slug: { type: String, required: true },
      role: { type: String, default: 'Author' },
      avatar: { type: String, default: '' },
      bio: { type: String, default: '' },
      linkedin: { type: String },
      twitter: { type: String },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    readingTime: {
      type: Number,
      default: 5,
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true,
    },
    imageAltText: {
      type: String,
      default: '',
    },
    content: {
      type: [ContentBlockSchema],
      default: [],
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        _id: false,
      },
    ],
    cta: {
      title: { type: String },
      description: { type: String },
      buttonText: { type: String },
      buttonLink: { type: String },
      type: {
        type: String,
        enum: ['banner', 'card', 'sidebar', 'interactive'],
        default: 'banner',
      },
    },
    relatedPostsSlugs: {
      type: [String],
      default: [],
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      focusKeyword: { type: String },
      secondaryKeywords: [{ type: String }],
      searchIntent: {
        type: String,
        enum: ['informational', 'transactional', 'commercial', 'navigational'],
        default: 'informational',
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
      },
      contentType: {
        type: String,
        enum: ['pillar', 'supporting', 'comparison', 'guide'],
        default: 'guide',
      },
      canonicalUrl: { type: String },
      noIndex: { type: Boolean, default: false },
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal search and listing query performance
BlogSchema.index({ status: 1, publishDate: -1 });
BlogSchema.index({ status: 1, category: 1, publishDate: -1 });
BlogSchema.index({ status: 1, tags: 1, publishDate: -1 });
BlogSchema.index({ title: 'text', excerpt: 'text' });

export const Blog = model<IBlog>('Blog', BlogSchema);

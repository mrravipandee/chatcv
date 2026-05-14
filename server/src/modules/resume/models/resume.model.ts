import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContactLink {
  label: string;
  url: string;
}

export interface ISkillGroup {
  category: string; // e.g. "Frontend", "Sales Tools", "Soft Skills"
  items: string[];
}

export interface IEducation {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface IExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface IProject {
  name: string;
  tags: string[];   // tech stack for devs, tools/skills for others
  bullets: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface IAchievement {
  title: string;
  description?: string;
}

export interface IResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  links: IContactLink[];
  summary?: string;
  education: IEducation[];
  skills: ISkillGroup[];
  projects: IProject[];
  experience: IExperience[];
  achievements: IAchievement[];
}

export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  data: IResumeData;
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const ContactLinkSchema = new Schema<IContactLink>(
  { label: { type: String, default: '' }, url: { type: String, default: '' } },
  { _id: false }
);

const SkillGroupSchema = new Schema<ISkillGroup>(
  { category: { type: String, default: '' }, items: { type: [String], default: [] } },
  { _id: false }
);

const EducationSchema = new Schema<IEducation>(
  {
    degree:      { type: String, default: '' },
    institution: { type: String, default: '' },
    location:    { type: String, default: '' },
    startYear:   { type: String, default: '' },
    endYear:     { type: String, default: '' },
    grade:       { type: String },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    role:      { type: String, default: '' },
    company:   { type: String, default: '' },
    location:  { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate:   { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    bullets:   { type: [String], default: [] },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name:      { type: String, default: '' },
    tags:      { type: [String], default: [] },
    bullets:   { type: [String], default: [] },
    liveUrl:   { type: String },
    githubUrl: { type: String },
  },
  { _id: false }
);

const AchievementSchema = new Schema<IAchievement>(
  {
    title:       { type: String, default: '' },
    description: { type: String },
  },
  { _id: false }
);

// ── Root schema ───────────────────────────────────────────────────────────────

const ResumeDataSchema = new Schema<IResumeData>(
  {
    name:         { type: String, default: '' },
    role:         { type: String, default: '' },
    email:        { type: String, default: '' },
    phone:        { type: String, default: '' },
    location:     { type: String, default: '' },
    links:        { type: [ContactLinkSchema],  default: [] },
    summary:      { type: String, default: '' },
    education:    { type: [EducationSchema],    default: [] },
    skills:       { type: [SkillGroupSchema],   default: [] },
    projects:     { type: [ProjectSchema],      default: [] },
    experience:   { type: [ExperienceSchema],   default: [] },
    achievements: { type: [AchievementSchema],  default: [] },
  },
  { _id: false }
);

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:  { type: String, default: 'My Resume', trim: true },
    data:   { type: ResumeDataSchema, default: () => ({}) },
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  title: string;
  company: string;
  year: string;
  description: string;
}

export interface IProject {
  name: string;
  description: string;
}

export interface ILink {
  name: string;   // e.g., "GitHub", "LinkedIn", "Portfolio"
  url: string;    // full URL
}

export interface IResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: IExperience[];
  projects: IProject[];
  links: ILink[];
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  data: IResumeData;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, default: '' },
  company: { type: String, default: '' },
  year: { type: String, default: '' },
  description: { type: String, default: '' },
});

const ProjectSchema = new Schema<IProject>({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
});

const LinkSchema = new Schema<ILink>({
  name: { type: String, default: '' },
  url: { type: String, default: '' },
});

const ResumeDataSchema = new Schema<IResumeData>({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  summary: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: [ExperienceSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  links: { type: [LinkSchema], default: [] },
});

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'My Resume' },
    data: { type: ResumeDataSchema, required: true, default: {} },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
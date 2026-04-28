export interface Experience {
  title: string;
  company: string;
  year: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
}

export interface Link {
  name: string;
  url: string;
}

export interface ResumeData {
  name: string;       // not "fullName"
  role: string;       // not "title"
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  links: Link[];  
}

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
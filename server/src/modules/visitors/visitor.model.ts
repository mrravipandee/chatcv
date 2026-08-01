import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorEventLog {
  id: string;
  action: 'Page View' | 'Click' | 'Scroll' | 'Compile PDF' | 'Download' | 'Sign Up';
  path: string;
  timestamp: string;
  detail?: string;
}

export interface IVisitorSession extends Document {
  sessionId: string;
  ip: string;
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  screenResolution: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  language: string;
  darkMode: boolean;
  connectionType: 'Wifi' | '4G' | '5G' | 'Ethernet' | 'Unknown';
  referrer: string;
  landingPage: string;
  exitPage: string;
  sessionDuration: string;
  sessionDurationSeconds: number;
  pagesVisited: string[];
  clicks: number;
  scrollPercentage: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userType: 'New' | 'Returning';
  isBot: boolean;
  timeline: IVisitorEventLog[];
  createdAt: Date;
  updatedAt: Date;
}

const VisitorEventLogSchema = new Schema<IVisitorEventLog>({
  id: { type: String, required: true },
  action: { type: String, required: true },
  path: { type: String, required: true },
  timestamp: { type: String, required: true },
  detail: { type: String }
}, { _id: false });

const VisitorSessionSchema = new Schema<IVisitorSession>(
  {
    sessionId: { type: String, required: true, index: true, unique: true },
    ip: { type: String, required: true, index: true },
    country: { type: String, default: 'Unknown', index: true },
    state: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown', index: true },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    timezone: { type: String, default: 'UTC' },
    isp: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown', index: true },
    browserVersion: { type: String, default: 'Unknown' },
    operatingSystem: { type: String, default: 'Unknown', index: true },
    screenResolution: { type: String, default: 'Unknown' },
    deviceType: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'], default: 'Desktop', index: true },
    language: { type: String, default: 'en' },
    darkMode: { type: Boolean, default: false },
    connectionType: { type: String, enum: ['Wifi', '4G', '5G', 'Ethernet', 'Unknown'], default: 'Unknown' },
    referrer: { type: String, default: 'Direct', index: true },
    landingPage: { type: String, default: '/', index: true },
    exitPage: { type: String, default: '/', index: true },
    sessionDuration: { type: String, default: '0m 00s' },
    sessionDurationSeconds: { type: Number, default: 0 },
    pagesVisited: { type: [String], default: [] },
    clicks: { type: Number, default: 0 },
    scrollPercentage: { type: Number, default: 0 },
    utmSource: { type: String, index: true },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    userType: { type: String, enum: ['New', 'Returning'], default: 'New', index: true },
    isBot: { type: Boolean, default: false, index: true },
    timeline: { type: [VisitorEventLogSchema], default: [] }
  },
  { timestamps: true }
);

// Optimize indices for aggregations
VisitorSessionSchema.index({ createdAt: 1 });
VisitorSessionSchema.index({ country: 1, createdAt: 1 });
VisitorSessionSchema.index({ isBot: 1, createdAt: 1 });
VisitorSessionSchema.index({ updatedAt: -1 });

export const VisitorSession = mongoose.model<IVisitorSession>('VisitorSession', VisitorSessionSchema);

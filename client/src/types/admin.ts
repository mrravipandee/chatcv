export interface SparklinePoint {
  date: string;
  value: number;
}

export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  change: string; // e.g. "+12.4%" or "-2.1%"
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string; // lucide icon name
  sparkline: SparklinePoint[];
  description: string;
}

export interface ChartDataPoint {
  date: string;
  visitors: number;
  resumes: number;
  users: number;
  downloads: number;
  aiMessages: number;
}

export interface DemographicItem {
  name: string;
  count: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  visitors: number;
  bounceRate: string;
  conversionRate: string;
}

export interface PagePerformance {
  path: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: string;
}

export interface ActivityLog {
  id: string;
  type: 'register' | 'download' | 'feedback' | 'contact' | 'error';
  user: string;
  action: string;
  detail: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Premium';
  date: string;
}

export interface ResumeDownload {
  id: string;
  title: string;
  format: 'PDF' | 'JSON' | 'LaTeX';
  userEmail: string;
  timestamp: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread' | 'replied';
  timestamp: string;
}

export interface SystemError {
  id: string;
  error: string;
  path: string;
  count: number;
  status: 'active' | 'resolved';
  time: string;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';

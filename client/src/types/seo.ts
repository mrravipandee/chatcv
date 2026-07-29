export interface SeoSparklinePoint {
  date: string;
  value: number;
}

export interface SeoStatCard {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  sparkline: SeoSparklinePoint[];
  description: string;
}

export interface SeoChartPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface KeywordItem {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  volume: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  traffic: number;
  url: string;
}

export interface PageSpeedRecord {
  score: number;
  lcp: string; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  inp: string; // Interaction to Next Paint
}

export interface CoreWebVitalsData {
  mobile: PageSpeedRecord;
  desktop: PageSpeedRecord;
}

export interface CrawlDiagnostic {
  id: string;
  url: string;
  type: '404' | 'broken-link' | 'redirect-chain';
  detail: string;
  source?: string;
  target?: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MetaIssue {
  id: string;
  url: string;
  issue: 'missing-title' | 'duplicate-desc' | 'missing-alt' | 'missing-h1';
  detail: string;
}

export interface SchemaItem {
  id: string;
  type: string;
  status: 'valid' | 'warning' | 'error';
  warningsCount: number;
  errorsCount: number;
}

export interface SeoSuggestion {
  id: string;
  title: string;
  page: string;
  action: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Technical' | 'Content' | 'Keywords';
}

export interface QueryRecord {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DemographicRecord {
  name: string;
  value: number;
  percentage: number;
}

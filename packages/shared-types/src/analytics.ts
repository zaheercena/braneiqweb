export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
  mixed: number;
}

export interface PlatformMetrics {
  platform: string;
  mentionCount: number;
  engagement: number;
  avgSentiment: number;
}

export interface TopicMetrics {
  topic: string;
  count: number;
  avgSentiment: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ShareOfVoiceMetrics {
  entityId: string;
  entityName: string;
  entityType: 'brand' | 'competitor';
  mentionCount: number;
  percentage: number;
  reach: number;
}

export interface VolumeSpike {
  id: string;
  workspaceId: string;
  platform?: string;
  keyword?: string;
  currentVolume: number;
  baselineVolume: number;
  spikePercentage: number;
  detectedAt: string;
  windowMinutes: number;
}

export interface DashboardOverview {
  totalMentions: number;
  mentionChange: number;
  sentimentDistribution: SentimentDistribution;
  avgSentimentScore: number;
  platformBreakdown: PlatformMetrics[];
  topTopics: TopicMetrics[];
  shareOfVoice: ShareOfVoiceMetrics[];
  activeSpikes: VolumeSpike[];
  recentAlerts: number;
}

export interface AnalyticsQuery {
  workspaceId: string;
  from: string;
  to: string;
  brandIds?: string[];
  platforms?: string[];
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

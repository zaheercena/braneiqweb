import { Platform } from './platform';

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface MentionAuthor {
  platformAuthorId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  followersCount?: number;
  verified?: boolean;
  profileUrl?: string;
}

export interface MentionEngagement {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
}

export interface MentionMedia {
  type: 'image' | 'video' | 'gif' | 'link';
  url: string;
  thumbnailUrl?: string;
}

export interface MentionGeo {
  country?: string;
  city?: string;
  coordinates?: [number, number];
}

export interface MentionEntity {
  type: string;
  value: string;
  confidence?: number;
}

export interface MentionEnrichment {
  sentiment: Sentiment;
  sentimentScore: number;
  emotion: string;
  topics: string[];
  intent: string;
  language: string;
  translatedText?: string;
  entities: MentionEntity[];
  spamScore: number;
  crisisScore: number;
  priorityScore: number;
  summary?: string;
  provider: string;
  enrichedAt: string;
}

export interface NormalizedMention {
  mentionId: string;
  tenantId: string;
  workspaceId: string;
  platform: Platform;
  platformMentionId: string;
  platformParentId?: string;
  text: string;
  textHtml?: string;
  language?: string;
  author: MentionAuthor;
  engagement: MentionEngagement;
  media: MentionMedia[];
  url: string;
  publishedAt: string;
  ingestedAt: string;
  brandIds: string[];
  keywordIds: string[];
  competitorIds: string[];
  isCompetitorMention: boolean;
  geo?: MentionGeo;
  rawS3Key: string;
  trackingConfigId: string;
  brandId: string;
  sourceType?: string;
  contentHash?: string;
  preliminarySpamScore?: number;
  enrichment?: MentionEnrichment;
}

export interface MentionSearchFilters {
  q?: string;
  platforms?: Platform[];
  sentiments?: Sentiment[];
  brandIds?: string[];
  keywordIds?: string[];
  from?: string;
  to?: string;
  minPriority?: number;
  maxSpamScore?: number;
  isCompetitor?: boolean;
  cursor?: string;
  limit?: number;
}

export interface MentionSearchResult {
  mentions: NormalizedMention[];
  total: number;
  cursor?: string;
  hasMore: boolean;
}

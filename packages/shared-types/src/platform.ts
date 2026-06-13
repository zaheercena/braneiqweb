export enum Platform {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  REDDIT = 'reddit',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
  RSS = 'rss',
  NEWS = 'news',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.TWITTER]: 'X / Twitter',
  [Platform.FACEBOOK]: 'Facebook',
  [Platform.INSTAGRAM]: 'Instagram',
  [Platform.YOUTUBE]: 'YouTube',
  [Platform.REDDIT]: 'Reddit',
  [Platform.TIKTOK]: 'TikTok',
  [Platform.LINKEDIN]: 'LinkedIn',
  [Platform.RSS]: 'RSS',
  [Platform.NEWS]: 'News',
};

export interface RateLimitConfig {
  requestsPerWindow: number;
  windowMs: number;
  burstLimit?: number;
}

export interface ConnectorHealth {
  platform: Platform;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  lastSuccessAt?: string;
  lastError?: string;
  rateLimitRemaining?: number;
}

export interface ConnectorCredentials {
  platform: Platform;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  apiSecret?: string;
  bearerToken?: string;
  clientId?: string;
  clientSecret?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface TrackingConfig {
  id: string;
  workspaceId: string;
  brandId?: string;
  platform: Platform;
  keywords: string[];
  hashtags: string[];
  handles: string[];
  excludeKeywords: string[];
  languages?: string[];
  scheduleCron: string;
}

export interface RawPayload {
  platform: Platform;
  platformMentionId: string;
  payload: Record<string, unknown>;
  fetchedAt: string;
  trackingConfigId: string;
}

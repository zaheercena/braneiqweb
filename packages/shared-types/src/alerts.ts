export enum AlertRuleType {
  VOLUME_SPIKE = 'volume_spike',
  SENTIMENT_SHIFT = 'sentiment_shift',
  KEYWORD_MATCH = 'keyword_match',
  CRISIS_SCORE = 'crisis_score',
  INFLUENCER_MENTION = 'influencer_mention',
  COMPETITOR_SURGE = 'competitor_surge',
  CUSTOM_QUERY = 'custom_query',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export type AlertOperator = 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'matches';

export interface AlertCondition {
  field: string;
  operator: AlertOperator;
  value: unknown;
  windowMinutes?: number;
}

export interface EmailChannel {
  type: 'email';
  recipients: string[];
}

export interface SlackChannel {
  type: 'slack';
  webhookUrl: string;
}

export interface WebhookChannel {
  type: 'webhook';
  url: string;
  headers?: Record<string, string>;
}

export interface InAppChannel {
  type: 'in_app';
}

export type NotificationChannel =
  | EmailChannel
  | SlackChannel
  | WebhookChannel
  | InAppChannel;

export interface AlertRule {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  ruleType: AlertRuleType;
  conditions: AlertCondition[];
  severity: AlertSeverity;
  channels: NotificationChannel[];
  cooldownMinutes: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  workspaceId: string;
  mentionId?: string;
  severity: AlertSeverity;
  title: string;
  message?: string;
  metadata?: Record<string, unknown>;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

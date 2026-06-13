import { randomUUID } from 'crypto';

export interface BraneIQEvent<T = unknown> {
  eventId: string;
  eventType: string;
  eventVersion: string;
  /** ISO 8601 timestamp — alias: occurredAt */
  timestamp: string;
  occurredAt: string;
  tenantId: string;
  workspaceId: string;
  brandId: string;
  correlationId: string;
  idempotencyKey: string;
  retryCount: number;
  payload: T;
  metadata?: Record<string, unknown>;
}

export const EVENT_VERSION = '1.0';

export const Topics = {
  INGESTION_RAW_RECEIVED: 'ingestion.raw.received',
  MENTION_NORMALIZED: 'mention.normalized',
  MENTION_DEDUPLICATED: 'mention.deduplicated',
  MENTION_ENRICHMENT_REQUESTED: 'mention.enrichment.requested',
  MENTION_ENRICHMENT_COMPLETED: 'mention.enrichment.completed',
  MENTION_INDEX_REQUESTED: 'mention.index.requested',
  MENTION_INDEX_COMPLETED: 'mention.index.completed',
  MENTION_ANALYTICS_REQUESTED: 'mention.analytics.requested',
  MENTION_ANALYTICS_COMPLETED: 'mention.analytics.completed',
  INGESTION_FAILED_DLQ: 'ingestion.failed.dlq',
  // Legacy / future pipeline topics
  ALERTS_EVALUATE: 'alerts.evaluate',
  ALERTS_TRIGGERED: 'alerts.triggered',
  REPORTS_GENERATE: 'reports.generate',
  GDPR_PURGE_REQUESTED: 'gdpr.purge.requested',
  CONNECTOR_RUN_REQUESTED: 'connector.run.requested',
} as const;

export type TopicName = (typeof Topics)[keyof typeof Topics];

export interface IngestionRawReceivedPayload {
  platform: string;
  sourceType: string;
  externalId: string;
  contentText: string;
  author: import('./mention').MentionAuthor;
  publishedAt: string;
  brandId: string;
  engagement?: import('./mention').MentionEngagement;
  url?: string;
  media?: import('./mention').MentionMedia[];
  rawPayload?: Record<string, unknown>;
  rawS3Key?: string;
  trackingConfigId?: string;
}

export interface MentionNormalizedPayload {
  mention: import('./mention').NormalizedMention;
  contentHash: string;
  preliminarySpamScore: number;
}

export interface MentionDeduplicatedPayload {
  mention: import('./mention').NormalizedMention;
  contentHash: string;
}

export interface MentionEnrichmentRequestedPayload {
  mention: import('./mention').NormalizedMention;
  contentHash: string;
}

export interface MentionEnrichmentCompletedPayload {
  mention: import('./mention').NormalizedMention;
  enrichment: import('./mention').MentionEnrichment;
  provider: string;
  processingMs: number;
}

export interface MentionIndexRequestedPayload {
  mention: import('./mention').NormalizedMention;
}

export interface MentionIndexCompletedPayload {
  mentionId: string;
  tenantId: string;
  workspaceId: string;
  indexName: string;
}

export interface MentionAnalyticsRequestedPayload {
  mention: import('./mention').NormalizedMention;
}

export interface MentionAnalyticsCompletedPayload {
  mentionId: string;
  tenantId: string;
  workspaceId: string;
}

export interface IngestionFailedDlqPayload {
  originalEvent: BraneIQEvent<unknown>;
  error: string;
  workerName: string;
  failedAt: string;
}

export interface AlertTriggeredPayload {
  ruleId: string;
  workspaceId: string;
  mentionId?: string;
  severity: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ReportGeneratePayload {
  scheduleId?: string;
  workspaceId: string;
  format: 'csv' | 'pdf';
  config: Record<string, unknown>;
  requestedBy?: string;
}

export interface ConnectorRunRequestedPayload {
  ruleId: string;
  dryRun?: boolean;
  requestedBy?: string;
}

export interface GdprPurgePayload {
  tenantId: string;
  requestId: string;
  type: 'export' | 'delete';
}

export interface EventContext {
  tenantId: string;
  workspaceId: string;
  brandId: string;
  correlationId?: string;
  idempotencyKey?: string;
  retryCount?: number;
}

export function createEvent<T>(
  eventType: string,
  payload: T,
  context: EventContext,
): BraneIQEvent<T> {
  const now = new Date().toISOString();
  return {
    eventId: randomUUID(),
    eventType,
    eventVersion: EVENT_VERSION,
    timestamp: now,
    occurredAt: now,
    tenantId: context.tenantId,
    workspaceId: context.workspaceId,
    brandId: context.brandId,
    correlationId: context.correlationId ?? randomUUID(),
    idempotencyKey: context.idempotencyKey ?? randomUUID(),
    retryCount: context.retryCount ?? 0,
    payload,
  };
}

export function withRetry<T>(event: BraneIQEvent<T>): BraneIQEvent<T> {
  return {
    ...event,
    eventId: randomUUID(),
    retryCount: event.retryCount + 1,
    occurredAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
  };
}

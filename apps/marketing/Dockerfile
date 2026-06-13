FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/marketing/package.json ./apps/marketing/
RUN pnpm install --frozen-lockfile --filter @braneiq/marketing...

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/marketing/node_modules ./apps/marketing/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
EXPOSE 3001
CMD ["pnpm", "--filter", "@braneiq/marketing", "dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/marketing/node_modules ./apps/marketing/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG NEXT_PUBLIC_APP_URL=https://app.braneiq.com
ARG NEXT_PUBLIC_SITE_URL=https://braneiq.com
ARG NEXT_PUBLIC_GTM_ID=GTM-5GWN244W
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
RUN mkdir -p apps/marketing/public && touch apps/marketing/public/.keep
RUN pnpm --filter @braneiq/marketing build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_SITE_URL=https://braneiq.com
ENV NEXT_PUBLIC_APP_URL=https://app.braneiq.com
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/marketing/public ./apps/marketing/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/marketing/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/marketing/.next/static ./apps/marketing/.next/static
USER nextjs
ENTRYPOINT ["node"]
CMD ["apps/marketing/server.js"]

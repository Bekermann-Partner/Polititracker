FROM node:23-alpine AS base

RUN apk add --no-cache openssl

ARG PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci


FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

RUN npm run build

FROM base AS run

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
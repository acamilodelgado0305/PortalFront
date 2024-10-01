# Install dependencies only when needed
FROM node:20.12.2-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /main

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM node:20.12.2-alpine AS builder
WORKDIR /main
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#RUN yarn build
# RUN npm install typescript --force

# If using npm comment out above and use below instead
RUN npm run build

EXPOSE 3001

ENV PORT 3001

CMD ["npm", "run", "start"]
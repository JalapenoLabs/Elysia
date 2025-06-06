FROM node:24.1.0-alpine

# Note: This must be built from the context of the root directory (one level up from this file!)

WORKDIR /app

RUN mkdir -p /app/elysia/src

COPY elysia/src/ /app/elysia/src
COPY elysia/tsconfig.json /app/elysia/tsconfig.json
COPY elysia/package.json /app/elysia/package.json
COPY elysia/yarn.lock /app/elysia/yarn.lock
COPY library /app/library
COPY global.d.ts /app/global.d.ts
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile --non-interactive --no-progress

CMD ["yarn", "tsx", "elysia/src/index.ts"]

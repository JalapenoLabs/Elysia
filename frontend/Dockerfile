# It's dev, the latest is fine
FROM node:latest

WORKDIR /elysia

# Configs
COPY package.json .
COPY yarn.lock .
COPY index.html .
COPY tsconfig.json .
COPY vite.config.ts .

# Source
COPY src/ ./src
COPY public/ ./public

# Install dependencies
RUN yarn install

# Default command
CMD ["yarn", "dev"]

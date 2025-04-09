FROM node:latest

WORKDIR /elysia

# Configs
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

# Source
COPY src/ ./src
COPY public/ ./public

# Install dependencies
RUN yarn install

# Default command
CMD ["yarn", "dev"]

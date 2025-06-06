FROM node:20.19.2-bullseye-slim

# Note: This must be built from the context of the root directory (one level up from this file!)

WORKDIR /app

RUN apt update -y && apt install -y \
  curl \
  build-essential

# Install dependencies
RUN mkdir -p /model
RUN curl -L -O /model/deepspeech-0.9.3-models.pbmm https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm
RUN curl -L -O /model/deepspeech-0.9.3-models.scorer https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer

# Copy only what’s needed for installing dependencies
COPY voice/package.json       /app/voice/
COPY voice/yarn.lock          /app/voice/
COPY package.json             /app/
COPY yarn.lock                /app/
COPY tsconfig.json            /app/

# Copy the source code
COPY global.d.ts              /app/global.d.ts
COPY library                  /app/library

# Copy your source files (so that 'yarn install' can see any local file references)
COPY voice/src/               /app/voice/src

RUN yarn install --non-interactive --no-progress

CMD ["tsx", "voice/src/index.ts"]

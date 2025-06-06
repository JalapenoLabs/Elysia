FROM python:3.12-slim

RUN apt-get update -y && \
    apt-get install -y \
      build-essential \
      python3-dev \
      libportaudio2 \
      portaudio19-dev \
      alsa-utils \
      pulseaudio-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY asound.conf /etc/asound.conf
COPY transcription.py .

# Install dependencies
RUN pip install --no-cache-dir whisper-live

CMD [ "python", "transcription.py" ]

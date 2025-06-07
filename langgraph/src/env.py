# Copyright © 2025 Jalapeno Labs

import os

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
SERVER_PORT = int(os.environ.get("SERVER_PORT", "2024"))
SERVER_HOST = os.environ.get("SERVER_HOST", "127.0.0.1")
SERVER_URL = f"http://{SERVER_HOST}:{SERVER_PORT}"
RELOAD = os.environ.get("RELOAD", "true").lower() in ("true", "1", "yes")

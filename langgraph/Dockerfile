FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./

# Base packages
RUN python -m pip install --no-cache-dir --upgrade pip poetry

# Install project dependencies
RUN poetry install --no-root --no-interaction --no-ansi

# Source code
COPY src/ src/
COPY templates/ templates/

CMD ["python", "src/app.py"]

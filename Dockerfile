# ── Stage 1: Build the React frontend ──────────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
# Result: /app/frontend/dist/


# ── Stage 2: Python backend that serves frontend + API ──────────────────────
FROM python:3.12-slim

# System deps needed by Pillow / xhtml2pdf
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libxml2 \
    libxslt1.1 \
    libffi-dev \
    libssl-dev \
    fonts-dejavu-core \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code + assets
COPY backend/ ./

# Copy compiled frontend into the backend working directory
COPY --from=frontend-builder /app/frontend/dist ./dist

# Cloud Run sets $PORT (default 8080). FastAPI will bind to it.
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]

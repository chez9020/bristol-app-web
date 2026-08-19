#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kill_port() {
  lsof -tiTCP:"$1" -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
}

cleanup() {
  echo "Deteniendo..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  kill_port 8000
  kill_port 5173
}
trap cleanup EXIT INT TERM

kill_port 8000
kill_port 5173

echo "Backend en http://127.0.0.1:8000 ..."
cd "$ROOT_DIR/backend"
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Frontend en http://localhost:5173 ..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
FRONTEND_PID=$!

wait

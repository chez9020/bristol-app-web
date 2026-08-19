# bristol-app-web

Firebase-backed app, split frontend/backend.

## Stack
- `frontend/`: React 19 + Vite, Firebase client SDK, PDF gen (jspdf, html2canvas). Commands: `npm run dev`, `npm run build`, `npm run lint`.
- `backend/`: FastAPI + uvicorn, firebase-admin, PDF gen (xhtml2pdf, reportlab, pypdf), Pillow. Entry: `backend/main.py`. Deps: `backend/requirements.txt`.
- `Dockerfile` at root for deployment.

## Notes
- `upload_users.py` / `usuarios_ejemplo.csv` at root: bulk user import tooling.
- Both frontend and backend generate PDFs independently (different libs) — check which path a PDF bug is actually in before fixing.

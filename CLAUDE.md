# bristol-app-web

Firebase-backed app, split frontend/backend.

## Stack
- `frontend/`: React 19 + Vite, Firebase client SDK, PDF gen (jspdf, html2canvas). Commands: `npm run dev`, `npm run build`, `npm run lint`.
- `backend/`: FastAPI + uvicorn, firebase-admin, PDF gen (xhtml2pdf, reportlab, pypdf), Pillow. Entry: `backend/main.py`. Deps: `backend/requirements.txt`.
- `Dockerfile` at root for deployment.

## Notes
- `upload_users.py` / `usuarios_ejemplo.csv` at root: bulk user import tooling.
- Both frontend and backend generate PDFs independently (different libs) — check which path a PDF bug is actually in before fixing.

## Figma reskin (ongoing)
Frontend is being reskinned screen-by-screen against Figma file "blood 2026" (`fileKey: 9GiM8A1KywgkNQvzWbsqPz`), light theme replacing the old dark "CAMZYOS" look. User supplies one Figma node per screen. Rules per screen: match Figma visuals exactly, keep existing real functionality/business logic, never touch `backend/`, delete orphaned old-theme code/assets for that screen only.

- Shared header/nav pattern lives in `Agenda.css` (`.agenda-header`, `.agenda-header-text h1`, `.agenda-subtitle`, `.agenda-header-bell`, `.back-btn-circle`) — every reskinned screen imports it instead of redefining.
- Design tokens in use: header purple `#4f0180`; brand gradient `linear-gradient(90deg, #4f0180 0%, #c601b6 100%)`; heading purple `#45006a`; body text `#3a3534`; muted text `#7f7383`; card bg `#fbfdff`; page bg light lavender; font `var(--font-inter)`.
- Figma asset URLs (`download_assets`/`get_design_context`) expire in ~7 days — download and commit into `frontend/public/assets/` immediately, never reference the temporary CDN URL in committed code.
- **Class-name collision gotcha**: Vite bundles all imported CSS together regardless of route, so two unrelated screens reusing the same class name (e.g. `.ponentes-container`) will bleed into each other even though they're never rendered at the same time. Before naming classes for a new/reskinned screen, grep the class name across `frontend/src/*.css` first; prefer screen-specific prefixes for generic names (container/grid/card/list).
- Screens reskinned so far: Inicio, Agenda, Biblioteca, Traslados, Logistica, Interacciones, Perfil, Constancia, Notas/Apuntes, Ponentes.

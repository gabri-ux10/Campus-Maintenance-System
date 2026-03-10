# Frontend (React + Vite)

CampusFix frontend for students, maintenance staff, and admins.

## Tech Stack

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8080`

## Local Setup

```bash
cp .env.example .env
# Windows PowerShell: copy .env.example .env
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

The dev server proxies `/api` requests to `VITE_DEV_PROXY_TARGET` (defaults to `http://localhost:8080`).

## Build

```bash
npm run build
npm run preview
```

For production builds, set:

- `VITE_API_BASE_URL=/api` when the frontend and backend share the same origin or reverse proxy
- `VITE_API_BASE_URL=https://api.example.com/api` when the API is hosted separately

## Lint

```bash
npm run lint
```

## Authentication UX Flow

- Register -> verify code page
- Verify code -> redirect to login
- Login -> role-based dashboard routing
- Forgot password -> reset email link
- Reset password -> success state, then sign in

## Related Docs

- `../README.md`
- `../documentation/guides/setup-guide.md`
- `../documentation/api/endpoints.md`

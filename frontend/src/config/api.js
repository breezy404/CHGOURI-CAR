// API base URL — Render in production, localhost in dev
const RENDER_API_ROOT = 'https://chgouri-car-backend.onrender.com';

function normalizeApiBaseUrl(url) {
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

const fromEnv = import.meta.env.VITE_API_URL
  ? normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
  : null;

export const API_BASE_URL =
  fromEnv ||
  (import.meta.env.PROD
    ? `${RENDER_API_ROOT}/api`
    : 'http://localhost:5000/api');

/** Root URL for /uploads images (no /api suffix) */
export const API_ROOT_URL = API_BASE_URL.replace(/\/api$/, '');

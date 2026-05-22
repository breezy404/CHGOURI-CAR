// API base URL — Railway in production, localhost in dev
const RAILWAY_API_ROOT = 'https://chgouri-car-production.up.railway.app';

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
    ? `${RAILWAY_API_ROOT}/api`
    : 'http://localhost:5000/api');

/** Root URL for /uploads images (no /api suffix) */
export const API_ROOT_URL = API_BASE_URL.replace(/\/api$/, '');

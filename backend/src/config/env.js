/** Strip quotes/spaces from Railway Raw Editor values */
function cleanEnv(name, fallback = '') {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return fallback;
  return String(raw).replace(/^["']|["']$/g, '').trim() || fallback;
}

module.exports = { cleanEnv };

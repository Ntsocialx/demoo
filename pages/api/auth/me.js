// CORS-enabled proxy for /me
const DEFAULT_BACKEND = process.env.API_URL || 'http://localhost:5000';
const ALLOWED_ORIGIN = process.env.VERCEL_APP_URL || process.env.NEXT_PUBLIC_APP_URL || '*';

export default async function handler(req, res) {
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).set(headers).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).set(headers).json({ error: 'Method Not Allowed' });
  }

  try {
    const backendRes = await fetch(`${DEFAULT_BACKEND}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: req.headers.authorization || '' },
    });

    const text = await backendRes.text();
    res.set(headers);
    res.status(backendRes.status).send(text);
  } catch (err) {
    res.set(headers);
    res.status(502).json({ error: 'Bad Gateway', details: err.message });
  }
}

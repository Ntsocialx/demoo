// CORS-enabled proxy for register
const DEFAULT_BACKEND = process.env.API_URL || 'http://localhost:5000';
const ALLOWED_ORIGIN = process.env.VERCEL_APP_URL || process.env.NEXT_PUBLIC_APP_URL || '*';

export default async function handler(req, res) {
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).set(headers).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).set(headers).json({ error: 'Method Not Allowed' });
  }

  try {
    const backendRes = await fetch(`${DEFAULT_BACKEND}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await backendRes.text();
    res.set(headers);
    res.status(backendRes.status).send(text);
  } catch (err) {
    res.set(headers);
    res.status(502).json({ error: 'Bad Gateway', details: err.message });
  }
}

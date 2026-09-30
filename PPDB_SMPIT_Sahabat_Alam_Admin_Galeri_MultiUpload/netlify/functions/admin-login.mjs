import { signToken, cookieOptions, json } from './_auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json();
    const username = String(body.username || '');
    const password = String(body.password || '');
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
      return json({ error: 'Admin belum dikonfigurasi di Netlify.' }, 500);
    }
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return json({ error: 'Username atau password salah.' }, 401);
    }
    const token = signToken(username);
    return json({ ok: true }, 200, { 'Set-Cookie': `ppdb_admin=${token}; ${cookieOptions()}; Max-Age=28800` });
  } catch {
    return json({ error: 'Permintaan login tidak valid.' }, 400);
  }
};

export const config = { path: '/api/admin/login', method: ['POST'] };

import crypto from 'node:crypto';

export function cookieOptions() {
  return 'Path=/; HttpOnly; Secure; SameSite=Lax';
}

export function signToken(username) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET belum diset.');
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || !token) return false;
    const [payload, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.u === process.env.ADMIN_USERNAME && Number(data.exp) > Date.now();
  } catch { return false; }
}

export function isAdmin(req) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)ppdb_admin=([^;]+)/);
  return verifyToken(match?.[1]);
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }
  });
}

import { json } from './_auth.mjs';
export default async () => json({ ok: true }, 200, { 'Set-Cookie': 'ppdb_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
export const config = { path: '/api/admin/logout', method: ['POST'] };

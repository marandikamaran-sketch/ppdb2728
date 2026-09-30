import { isAdmin, json } from './_auth.mjs';

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  return json({ authenticated: isAdmin(req) });
};

export const config = { path: '/api/admin/status', method: ['GET'] };

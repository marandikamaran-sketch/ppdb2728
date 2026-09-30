import { getStore } from '@netlify/blobs';
import { isAdmin, json } from './_auth.mjs';

export default async (req, context) => {
  if (req.method !== 'DELETE') return json({ error: 'Method not allowed' }, 405);
  if (!isAdmin(req)) return json({ error: 'Akses admin diperlukan.' }, 401);
  const id = context.params.id;
  if (!/^[a-f0-9-]{36}$/.test(id)) return json({ error: 'ID tidak valid.' }, 400);
  const db = getStore('smpit-program-gallery');
  const metaKey = `meta/${id}.json`;
  const meta = await db.get(metaKey, { type: 'json' });
  if (!meta) return json({ error: 'Gambar tidak ditemukan.' }, 404);
  await db.delete(meta.imageKey);
  await db.delete(metaKey);
  return json({ ok: true });
};

export const config = { path: '/api/gallery/delete/:id', method: ['DELETE'] };

import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  const id = context.params.id;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const db = getStore('smpit-program-gallery');
  const meta = await db.get(`meta/${id}.json`, { type: 'json' });
  if (!meta) return new Response('Not found', { status: 404 });
  const data = await db.get(meta.imageKey, { type: 'arrayBuffer' });
  if (!data) return new Response('Not found', { status: 404 });
  return new Response(data, { headers: { 'Content-Type': meta.type, 'Cache-Control': 'public, max-age=31536000, immutable' } });
};

export const config = { path: '/api/gallery/image/:id', method: ['GET'] };

import { getStore } from '@netlify/blobs';
import { isAdmin, json } from './_auth.mjs';
import crypto from 'node:crypto';

const CATEGORIES = new Set([
  'unggulan', 'kegiatan', 'fasilitas', 'ekskul', 'prestasi'
]);
const MAX_BYTES = 4_800_000;
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function store() { return getStore('smpit-program-gallery'); }

export default async (req) => {
  const db = store();
  if (req.method === 'GET') {
    const { blobs } = await db.list({ prefix: 'meta/' });
    const items = [];
    for (const b of blobs) {
      const item = await db.get(b.key, { type: 'json' });
      if (item) items.push({ ...item, url: `/api/gallery/image/${item.id}` });
    }
    items.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    return json({ items }, 200, { 'Cache-Control': 'public, max-age=30' });
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!isAdmin(req)) return json({ error: 'Akses admin diperlukan.' }, 401);

  try {
    const form = await req.formData();
    const category = String(form.get('category') || '');
    const title = String(form.get('title') || '').trim();
    const file = form.get('file');
    if (!CATEGORIES.has(category)) return json({ error: 'Kategori tidak valid.' }, 400);
    if (!title) return json({ error: 'Judul gambar wajib diisi.' }, 400);
    if (!(file instanceof File)) return json({ error: 'File gambar belum dipilih.' }, 400);
    if (!TYPES.has(file.type)) return json({ error: 'Gunakan JPG, PNG, WEBP, atau GIF.' }, 400);
    if (file.size > MAX_BYTES) return json({ error: 'Ukuran gambar maksimal 4,8 MB.' }, 400);

    const id = crypto.randomUUID();
    const ext = ({ 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/gif':'gif' })[file.type];
    const imageKey = `image/${id}.${ext}`;
    const meta = { id, category, title, fileName: file.name, type: file.type, size: file.size, imageKey, createdAt: new Date().toISOString() };
    await db.set(imageKey, file, { metadata: { category, title } });
    await db.setJSON(`meta/${id}.json`, meta);
    return json({ ok: true, item: { ...meta, url: `/api/gallery/image/${id}` } }, 201);
  } catch (e) {
    return json({ error: 'Upload gagal.', detail: String(e?.message || e) }, 500);
  }
};

export const config = { path: '/api/gallery', method: ['GET', 'POST'] };

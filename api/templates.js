import { kv } from '@vercel/kv';

const TPL_KEY = 'casely:templates';

const DEFAULTS = [
  { id: 'w1', label: 'Clean White',  src: null, bg: '#ffffff' },
  { id: 'w2', label: 'Cream',        src: null, bg: '#fdf6ec' },
  { id: 'w3', label: 'Soft Pink',    src: null, bg: '#fde8f0' },
  { id: 'w4', label: 'Sky Blue',     src: null, bg: '#e8f4fd' },
  { id: 'w5', label: 'Lavender',     src: null, bg: '#f0ecfd' },
  { id: 'w6', label: 'Mint',         src: null, bg: '#e8fdf2' },
  { id: 'w7', label: 'Charcoal',     src: null, bg: '#2a2a2a' },
  { id: 'w8', label: 'Black',        src: null, bg: '#0d0d0d' },
];

async function getTemplates() {
  const data = await kv.get(TPL_KEY);
  return data ?? DEFAULTS;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/templates
  if (req.method === 'GET') {
    const templates = await getTemplates();
    return res.status(200).json(templates);
  }

  // POST /api/templates
  if (req.method === 'POST') {
    const { label, bg, src } = req.body;
    if (!label) return res.status(400).json({ error: 'label required' });
    const templates = await getTemplates();
    const tpl = { id: 'tpl_' + Date.now(), label, bg: bg || '#ffffff', src: src || null };
    templates.unshift(tpl);
    await kv.set(TPL_KEY, templates);
    return res.status(201).json(tpl);
  }

  // DELETE /api/templates?id=xxx
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    const templates = await getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return res.status(404).json({ error: 'not found' });
    await kv.set(TPL_KEY, filtered);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'method not allowed' });
}

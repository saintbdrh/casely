import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const STICKER_KEY = 'casely:stickers';

async function getStickers() {
  const data = await redis.get(STICKER_KEY);
  return data ?? [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const stickers = await getStickers();
    return res.status(200).json(stickers);
  }

  if (req.method === 'POST') {
    const { label, src } = req.body;
    if (!label) return res.status(400).json({ error: 'label required' });
    if (!src)   return res.status(400).json({ error: 'src required' });
    const stickers = await getStickers();
    const sticker = { id: 'stk_' + Date.now(), label, src };
    stickers.unshift(sticker);
    await redis.set(STICKER_KEY, stickers);
    return res.status(201).json(sticker);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    const stickers = await getStickers();
    const filtered = stickers.filter(s => s.id !== id);
    if (filtered.length === stickers.length) return res.status(404).json({ error: 'not found' });
    await redis.set(STICKER_KEY, filtered);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'method not allowed' });
}

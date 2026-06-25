# Casely — Vercel Deployment

## One-time setup (10 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/casely.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com → **Add New Project**
2. Import your GitHub repo
3. Click **Deploy** (no build settings needed — Vercel auto-detects)

### 3. Add Vercel KV (database)

1. In your Vercel project → **Storage** tab → **Create Database** → **KV**
2. Name it anything (e.g. `casely-kv`)
3. Click **Connect to Project** — this auto-injects the env vars your API needs

That's it. Redeploy if prompted.

### 4. Your URLs

| Page     | URL                                      |
|----------|------------------------------------------|
| Designer | `https://your-project.vercel.app/`       |
| Admin    | `https://your-project.vercel.app/admin`  |
| API      | `https://your-project.vercel.app/api/templates` |

## How sync works

- Admin adds/removes a template or sticker → saved to Vercel KV
- Designer polls `/api/templates` and `/api/stickers` every 4 seconds
- If the list changed, the UI updates automatically (no page refresh)

## Updating

```bash
git add .
git commit -m "your change"
git push
```
Vercel auto-deploys on every push to `main`.

## Storage limits (free tier)

| Resource        | Free limit     | Notes                          |
|-----------------|----------------|--------------------------------|
| Vercel KV       | 30MB           | Fine for ~50–100 images        |
| Vercel Functions| 100GB-hrs/mo   | More than enough               |
| Bandwidth       | 100GB/mo       | Fine for this use case         |

If you hit 30MB on KV, swap base64 storage for Vercel Blob
(also free up to 100GB) and store image URLs instead.

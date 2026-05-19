# MemoryRisk

MemoryRisk is a Cloudflare Workers + Pages SaaS site for AI memory shortage and HBM shortage procurement risk planning.

## Local

```bash
npm install
npm run build
npm run dev
```

## Cloudflare

Worker and Pages deploy automatically from GitHub Actions after pushes to `main`.

Required secrets:

- `CLOUDFLARE_API_KEY`
- `CLOUDFLARE_EMAIL`
- `CLOUDFLARE_ACCOUNT_ID`
- Worker/Pages secret `API_PROD_KEY` for Creem checkout

The public site is `https://memoryrisk.space` with `https://www.memoryrisk.space` supported.


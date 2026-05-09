const LIVE_ORIGIN = 'https://memoryrisk.space'
const LIVE_HOST = 'memoryrisk.space'
const ALT_HOSTS = new Set(['www.memoryrisk.space'])
const ANNUAL_DISCOUNT_MULTIPLIER = 0.5
const INDEXNOW_KEY = '6f9c23f79e2e4dbf9f33e1d7e5b8a912'

const creemProductCache = new Map()

const planCatalog = {
  watchlist: {
    id: 'watchlist',
    name: 'Watchlist',
    monthlyAmountCents: 9900,
    currency: 'USD',
    summary: 'single-buyer AI memory shortage watchlist',
  },
  team: {
    id: 'team',
    name: 'Team',
    monthlyAmountCents: 19900,
    currency: 'USD',
    summary: 'default shared MemoryRisk workspace for BOM scoring and reports',
  },
  partner: {
    id: 'partner',
    name: 'Channel',
    monthlyAmountCents: 29900,
    currency: 'USD',
    summary: 'partner customer workspaces and MSP reporting',
  },
}

const indexablePaths = [
  '/',
  '/ai-memory-shortage-update',
  '/memory-shortage-2026',
  '/global-memory-shortage',
  '/when-will-the-memory-shortage-end',
  '/memory-chip-shortage',
  '/memory-chip-shortage-2026',
  '/hbm-memory-shortage',
  '/memory-supply',
  '/hbm-shortage-reddit',
  '/semianalysis-hbm',
  '/hbm-demand',
  '/sk-hynix-stock',
  '/why-is-there-a-chip-shortage',
  '/silicon-shortage',
  '/pricing',
  '/privacy',
  '/terms',
]

const staticAssetPaths = new Set([...indexablePaths, '/checkout/done'])

function securityHeaders(request) {
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  })

  const origin = request?.headers?.get?.('Origin')
  if (isAllowedCorsOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    headers.set('Vary', 'Origin')
  }

  return headers
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return false

  try {
    const url = new URL(origin)
    if (url.hostname === LIVE_HOST || ALT_HOSTS.has(url.hostname)) return true
    if (url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev')) return true
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true
  } catch {}

  return false
}

function jsonResponse(data, status = 200, request = null) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(data), { status, headers })
}

function handleOptions(request) {
  return new Response(null, { status: 204, headers: securityHeaders(request) })
}

function maybeRedirectToHttps(requestUrl) {
  if (requestUrl.protocol !== 'https:') {
    const redirectUrl = new URL(requestUrl)
    redirectUrl.protocol = 'https:'
    return Response.redirect(redirectUrl.toString(), 308)
  }
  return null
}

function resolvePublicAppOrigin(requestUrl) {
  if (requestUrl.hostname === LIVE_HOST || ALT_HOSTS.has(requestUrl.hostname)) {
    return `https://${requestUrl.hostname}`
  }

  if (requestUrl.hostname.endsWith('.pages.dev') || requestUrl.hostname.endsWith('.workers.dev')) {
    return requestUrl.origin
  }

  return LIVE_ORIGIN
}

function resolveCreemBase(env) {
  const raw = String(env?.CREEM_API_BASE ?? '').trim()
  return raw ? raw.replace(/\/+$/, '') : 'https://api.creem.io'
}

async function getSecretValue(value) {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value.get === 'function') {
    const resolved = await value.get()
    return typeof resolved === 'string' ? resolved.trim() : ''
  }
  return ''
}

async function firstSecretEnv(env, ...keys) {
  for (const key of keys) {
    const value = await getSecretValue(env?.[key])
    if (value) return value
  }
  return ''
}

function normalizeEnvKey(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function formatMoney(amountCents, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100)
}

function resolveConfiguredProductId(env, planId, billing) {
  const cycle = billing === 'monthly' ? 'MONTHLY' : 'YEARLY'
  const tier = planId === 'partner' ? 'PARTNER' : planId === 'watchlist' ? 'WATCHLIST' : 'TEAM'
  const normalizedSelection = normalizeEnvKey(`${planId}_${billing}`)
  const keys = [
    `CREEM_PRODUCT_${tier}_${cycle}`,
    `CREEM_PRODUCT_ID_MEMORYRISK_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${normalizedSelection}`,
    `CREEM_PRODUCT_ID_${tier}`,
    'CREEM_PRODUCT_ID',
  ]

  for (const key of keys) {
    const value = env?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

async function requestCreemJson(apiKey, url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const rawText = await response.text()
  let payload = null
  if (rawText) {
    try {
      payload = JSON.parse(rawText)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === 'object'
        ? payload.message || payload.error || 'Creem request failed.'
        : 'Creem request failed.',
    )
  }

  return payload || {}
}

async function getOrCreateCreemProduct(env, apiKey, plan, billing, successUrl) {
  const configuredProductId = resolveConfiguredProductId(env, plan.id, billing)
  if (configuredProductId) return configuredProductId

  const cacheKey = `${plan.id}:${billing}`
  if (creemProductCache.has(cacheKey)) return creemProductCache.get(cacheKey)

  const monthlyAmountCents =
    billing === 'annual' ? Math.round(plan.monthlyAmountCents * ANNUAL_DISCOUNT_MULTIPLIER) : plan.monthlyAmountCents
  const totalAmountCents = billing === 'annual' ? monthlyAmountCents * 12 : monthlyAmountCents
  const billingLabel = billing === 'annual' ? 'annual' : 'monthly'

  const product = await requestCreemJson(apiKey, `${resolveCreemBase(env)}/v1/products`, {
    name: `MemoryRisk ${plan.name} (${billingLabel})`,
    description: `${formatMoney(monthlyAmountCents, plan.currency)}/mo - ${plan.summary}`,
    price: totalAmountCents,
    currency: plan.currency,
    billing_type: 'onetime',
    tax_mode: 'inclusive',
    tax_category: 'saas',
    default_success_url: successUrl,
  })

  const productId = product.id || product.product_id
  if (!productId) throw new Error('Creem did not return a product id.')

  creemProductCache.set(cacheKey, productId)
  return productId
}

function extractCheckoutUrl(payload) {
  const candidates = [payload?.checkout_url, payload?.checkoutUrl, payload?.url]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }
  return ''
}

async function handleCheckout(request, env, requestUrl) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  }

  const apiKey = await firstSecretEnv(env, 'API_PROD_KEY', 'CREEM_API_KEY', 'CREEM_KEY')
  if (!apiKey) {
    return jsonResponse({ ok: false, error: 'Payment is not configured yet.' }, 503, request)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const planId = typeof body?.planId === 'string' ? body.planId : 'team'
  const billing = body?.billing === 'monthly' ? 'monthly' : 'annual'
  const plan = planCatalog[planId] || planCatalog.team
  const successUrl = `${resolvePublicAppOrigin(requestUrl)}/checkout/done`

  try {
    const productId = await getOrCreateCreemProduct(env, apiKey, plan, billing, successUrl)
    const checkout = await requestCreemJson(apiKey, `${resolveCreemBase(env)}/v1/checkouts`, {
      product_id: productId,
      units: 1,
      success_url: successUrl,
      request_id: `memoryrisk_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      metadata: {
        site: 'memoryrisk.space',
        planId: plan.id,
        billing,
      },
    })
    const checkoutUrl = extractCheckoutUrl(checkout)
    if (!checkoutUrl) throw new Error('Creem did not return a checkout URL.')
    return jsonResponse({ ok: true, checkoutUrl }, 200, request)
  } catch {
    return jsonResponse({ ok: false, error: 'Secure checkout could not be created yet.' }, 502, request)
  }
}

function handleRuntime(request, requestUrl) {
  return jsonResponse(
    {
      ok: true,
      publicAppOrigin: resolvePublicAppOrigin(requestUrl),
      deployment: 'cloudflare-workers-assets',
      paymentProvider: 'creem',
      defaultPlan: 'team',
      defaultBilling: 'annual',
      annualDiscount: '50%',
      analytics: 'first-party-kv-with-d1-ready',
      ts: Date.now(),
    },
    200,
    request,
  )
}

async function ensureAnalyticsSchema(env) {
  if (!env?.ANALYTICS_DB?.prepare) return false

  await env.ANALYTICS_DB.prepare(
    `CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      path TEXT,
      occurred_at TEXT,
      visitor_id TEXT,
      session_id TEXT,
      referrer_host TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      metadata TEXT,
      ip_country TEXT,
      user_agent TEXT,
      received_at TEXT NOT NULL
    )`,
  ).run()

  return true
}

async function handleAnalytics(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const events = Array.isArray(body?.events) ? body.events.slice(0, 40) : []
  const acceptedEvents = events.filter((event) => event && typeof event.id === 'string' && typeof event.name === 'string')
  const country = request.headers.get('CF-IPCountry') || null
  const userAgent = request.headers.get('User-Agent') || null
  const receivedAt = new Date().toISOString()

  let persisted = false
  let store = 'console'
  try {
    persisted = await ensureAnalyticsSchema(env)
    if (persisted && acceptedEvents.length) {
      await env.ANALYTICS_DB.batch(
        acceptedEvents.map((event) =>
          env.ANALYTICS_DB.prepare(
            `INSERT OR IGNORE INTO analytics_events (
              id, name, path, occurred_at, visitor_id, session_id, referrer_host,
              utm_source, utm_medium, utm_campaign, metadata, ip_country, user_agent, received_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ).bind(
            event.id,
            event.name.slice(0, 120),
            String(event.path || '').slice(0, 500),
            String(event.occurredAt || ''),
            String(event.visitorId || '').slice(0, 120),
            String(event.sessionId || '').slice(0, 120),
            event.referrerHost ? String(event.referrerHost).slice(0, 250) : null,
            event.utmSource ? String(event.utmSource).slice(0, 180) : null,
            event.utmMedium ? String(event.utmMedium).slice(0, 180) : null,
            event.utmCampaign ? String(event.utmCampaign).slice(0, 180) : null,
            JSON.stringify(event.metadata || {}).slice(0, 4000),
            country,
            userAgent ? userAgent.slice(0, 500) : null,
            receivedAt,
          ),
        ),
      )
      store = 'd1'
    } else if (env?.ANALYTICS_KV?.put && acceptedEvents.length) {
      const day = receivedAt.slice(0, 10)
      const hour = receivedAt.slice(11, 13)
      const batchId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      await env.ANALYTICS_KV.put(
        `events/${day}/${hour}/${batchId}.json`,
        JSON.stringify({
          site: 'memoryrisk.space',
          receivedAt,
          country,
          accepted: acceptedEvents.length,
          events: acceptedEvents,
        }),
        { expirationTtl: 60 * 60 * 24 * 180 },
      )
      persisted = true
      store = 'kv'
    }
  } catch (error) {
    console.log(JSON.stringify({ type: 'analytics_store_error', site: 'memoryrisk.space', message: String(error?.message || error) }))
    persisted = false
  }

  console.log(JSON.stringify({ type: 'analytics', site: 'memoryrisk.space', accepted: acceptedEvents.length, persisted, store }))
  return jsonResponse({ ok: true, accepted: acceptedEvents.length, persisted, store }, 202, request)
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = indexablePaths
    .map((path) => {
      const priority = path === '/' ? '1.0' : path === '/privacy' || path === '/terms' ? '0.4' : path === '/pricing' ? '0.9' : '0.78'
      const changefreq = path === '/' || path === '/pricing' ? 'weekly' : 'monthly'
      const canonicalPath = path === '/' ? '/' : `${path}/`
      return `  <url>
    <loc>${LIVE_ORIGIN}${canonicalPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

function handleSitemap(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/xml; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(buildSitemapXml(), { status: 200, headers })
}

function handleRobots(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done
Sitemap: ${LIVE_ORIGIN}/sitemap.xml
`
  return new Response(body, { status: 200, headers })
}

function handleIndexNowKey(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=86400')
  return new Response(INDEXNOW_KEY, { status: 200, headers })
}

async function fetchAsset(request, env) {
  if (env?.SITE_ASSETS?.fetch) {
    const requestUrl = new URL(request.url)
    const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/'

    if (staticAssetPaths.has(normalizedPath)) {
      const assetUrl = new URL(request.url)
      assetUrl.pathname = normalizedPath === '/' ? '/' : `${normalizedPath}/index.html`
      const assetResponse = await env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), request))
      if (assetResponse.status !== 404) return assetResponse
    }

    return env.SITE_ASSETS.fetch(request)
  }

  return new Response('Cloudflare asset binding is unavailable.', {
    status: 500,
    headers: securityHeaders(request),
  })
}

export async function handleRequest(request, env) {
  const requestUrl = new URL(request.url)

  if (request.method === 'OPTIONS') return handleOptions(request)
  if (requestUrl.pathname === '/api/runtime') return handleRuntime(request, requestUrl)
  if (requestUrl.pathname === '/api/checkout') return handleCheckout(request, env, requestUrl)
  if (requestUrl.pathname === '/api/analytics/events') return handleAnalytics(request, env)

  const redirect = maybeRedirectToHttps(requestUrl)
  if (redirect) return redirect

  if (requestUrl.pathname === '/sitemap.xml') return handleSitemap(request)
  if (requestUrl.pathname === '/robots.txt') return handleRobots(request)
  if (requestUrl.pathname === `/${INDEXNOW_KEY}.txt`) return handleIndexNowKey(request)

  return fetchAsset(request, env)
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch {
      return jsonResponse({ ok: false, error: 'Internal server error.' }, 500, request)
    }
  },
}

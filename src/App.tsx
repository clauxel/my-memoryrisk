import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Cloud,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Gauge,
  HardDrive,
  LineChart,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  Scale,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Upload,
  Wallet,
  X,
} from 'lucide-react'
import * as XLSX from 'xlsx'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { legalPrivacySections, legalTermsSections, type LegalSection } from './content/legal'
import { trackEvent, trackPageView } from './lib/analytics'
import { analyzeBom, buildCsvTemplate, getSampleBom, normalizeBomRows, type BomItem, type PlanId, type RiskSummary } from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://memoryrisk.space'
const pagesApiBaseUrl = 'https://my-memoryrisk.yangdengkui01.workers.dev'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Start Team annual'
const ctaCheckout = 'Checkout Team annual'

const plans: Array<{
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'watchlist',
    name: 'Watchlist',
    shortName: 'Watchlist',
    tagline: 'For one buyer tracking a small AI server or memory refresh list.',
    monthlyUsd: 99,
    bullets: ['CSV/XLSX import', '6-month shortage score', 'Budget sensitivity', 'Email support'],
  },
  {
    id: 'team',
    name: 'Team',
    shortName: 'Team',
    tagline: 'The default plan for procurement, finance, IT, and MSP teams sharing live shortage risk.',
    monthlyUsd: 199,
    popular: true,
    bullets: ['Shared BOM workspaces', 'Supplier comparison', 'Purchase calendar', 'MSP customer reports'],
  },
  {
    id: 'partner',
    name: 'Channel',
    shortName: 'Channel',
    tagline: 'For partners managing multiple customer spaces and repeat project reports.',
    monthlyUsd: 299,
    bullets: ['Customer workspaces', 'Report templates', 'Partner review queue', 'Priority onboarding'],
  },
]

const trustItems = [
  { label: 'BOM risk score', value: '6 mo', detail: 'Decision horizon' },
  { label: 'Default plan', value: 'Team', detail: 'Middle tier selected' },
  { label: 'Annual savings', value: '50%', detail: 'Annual selected first' },
  { label: 'Data posture', value: 'No secrets', detail: 'Planning fields only' },
]

const featureCards = [
  {
    title: 'BOM risk scoring',
    body: 'Score AI server, HBM, DDR5, NAND, and cloud fallback lines with lead time and supplier concentration visible.',
    icon: <Gauge size={21} />,
  },
  {
    title: 'Substitute mapping',
    body: 'Keep fallback memory, server bundles, and cloud capacity choices attached to the exact line that can block delivery.',
    icon: <PackageCheck size={21} />,
  },
  {
    title: 'Budget sensitivity',
    body: 'Show finance what happens if memory quotes move, HBM-heavy lines reprice, or delay costs hit the project.',
    icon: <CircleDollarSign size={21} />,
  },
  {
    title: 'MSP-ready reports',
    body: 'Turn shortage risk into a customer-facing decision memo with priority, dates, and supplier comparison.',
    icon: <Building2 size={21} />,
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing) {
  const response = await fetch(resolveApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'memoryrisk-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#0c1f2e;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#bddbd5">Your MemoryRisk payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'memoryrisk-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'memoryrisk-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="mr-main">
      <section className="mr-center-panel">
        <p className="mr-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="mr-muted">You will return to the MemoryRisk homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

function scoreTone(score: number) {
  if (score >= 78) return 'critical'
  if (score >= 62) return 'high'
  if (score >= 42) return 'watch'
  return 'controlled'
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('team')
  const [items, setItems] = useState<BomItem[]>(() => getSampleBom())
  const [inputText, setInputText] = useState(() => buildCsvTemplate())
  const [importMessage, setImportMessage] = useState('Sample AI server BOM loaded')
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)

  const risk: RiskSummary = useMemo(() => analyzeBom(items), [items])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({ pathname, routeView, publicAppOrigin, keywordPage })
    syncSeoDocument(seo)
    trackPageView(`${pathname}${search}`)
  }, [keywordPage, pathname, publicAppOrigin, routeView, search])

  useEffect(() => {
    let active = true
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (active && payload?.publicAppOrigin) setPublicAppOrigin(payload.publicAppOrigin)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'memoryrisk-checkout-complete') return
      setCheckoutModal(null)
      setCheckoutLoadingKey(null)
      trackEvent('checkout_success_return', { provider: 'creem' })
      navigate('/?payment=success')
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  function openPage(path: string) {
    trackEvent('internal_navigation', { target: path })
    navigate(path)
  }

  function parseWorkbook(workbook: XLSX.WorkBook) {
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
    const normalized = normalizeBomRows(rows)
    setItems(normalized)
    setImportMessage(`${normalized.length} lines analyzed from ${sheetName || 'uploaded file'}`)
    trackEvent('bom_imported', { rows: normalized.length, source: 'file_or_text' })
  }

  async function handleFileUpload(file: File) {
    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      parseWorkbook(workbook)
      setImportMessage(`${file.name} analyzed`)
    } catch {
      setImportMessage('Could not read that file. Try CSV or XLSX with a header row.')
      trackEvent('bom_import_failed', { fileName: file.name })
    }
  }

  function runPastedBom() {
    try {
      const workbook = XLSX.read(inputText, { type: 'string' })
      parseWorkbook(workbook)
      setImportMessage('Pasted BOM analyzed')
    } catch {
      setImportMessage('Could not parse the pasted data. Keep the CSV header row and try again.')
      trackEvent('bom_paste_failed')
    }
  }

  function loadSampleBom() {
    setItems(getSampleBom())
    setInputText(buildCsvTemplate())
    setImportMessage('Sample AI server BOM loaded')
    trackEvent('sample_bom_loaded')
  }

  function downloadTemplate() {
    const blob = new Blob([buildCsvTemplate()], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'memoryrisk-bom-template.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    trackEvent('template_downloaded')
  }

  async function startHostedCheckout(planId: PlanId, billingCycle: Billing, loadingKey: string) {
    const popup = openCenteredCheckoutWindow()
    setSelectedPlanId(planId)
    setBilling(billingCycle)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'loading' })
    trackEvent('checkout_open_start', { planId, billing: billingCycle, popup: Boolean(popup) })

    try {
      const checkoutUrl = await createCheckoutSession(planId, billingCycle)
      const popupReady = sendPopupToCheckout(popup, checkoutUrl)
      trackEvent('checkout_session_created', { planId, billing: billingCycle, popupReady })
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: popupReady ? 'popup' : 'retry', checkoutUrl })
    } catch (error) {
      try {
        popup?.close()
      } catch {}
      trackEvent('checkout_session_failed', { planId, billing: billingCycle, message: error instanceof Error ? error.message : 'unknown' })
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'retry' })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  function chooseTeamAnnual(source: string) {
    setBilling('annual')
    setSelectedPlanId('team')
    trackEvent('primary_cta_click', { source, planId: 'team', billing: 'annual' })
    void startHostedCheckout('team', 'annual', `cta-${source}`)
  }

  const renderHeader = () => (
    <header className={`mr-header${headerCompact ? ' compact' : ''}`}>
      <div className="mr-header-inner">
        <a
          className="mr-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            openPage('/')
          }}
        >
          <span className="mr-brand-mark">
            <Cpu size={22} />
          </span>
          <span className="mr-brand-copy">
            <strong>MemoryRisk</strong>
            <span>AI memory shortage planner</span>
          </span>
        </a>
        <nav className="mr-nav" aria-label="Primary navigation">
          <a href="/ai-memory-shortage-update" onClick={(event) => { event.preventDefault(); openPage('/ai-memory-shortage-update') }}>AI memory</a>
          <a href="/hbm-memory-shortage" onClick={(event) => { event.preventDefault(); openPage('/hbm-memory-shortage') }}>HBM shortage</a>
          <a href="/memory-supply" onClick={(event) => { event.preventDefault(); openPage('/memory-supply') }}>Supply</a>
          <a href="/pricing" onClick={(event) => { event.preventDefault(); openPage('/pricing') }}>Pricing</a>
        </nav>
        <button type="button" className="mr-btn mr-btn-primary mr-header-cta" onClick={() => chooseTeamAnnual('header')}>
          <Wallet size={18} />
          {ctaPrimary}
        </button>
      </div>
    </header>
  )

  const renderRiskConsole = () => (
    <aside className="mr-console" id="planner" aria-label="MemoryRisk BOM planner">
      <div className="mr-console-head">
        <div>
          <p className="mr-eyebrow">BOM risk console</p>
          <h2>Upload a server list. Get a six-month buying plan.</h2>
        </div>
        <div className={`mr-score ${scoreTone(risk.score)}`}>
          <strong>{risk.score}</strong>
          <span>{risk.label}</span>
        </div>
      </div>

      <div className="mr-upload-row">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            if (file) void handleFileUpload(file)
          }}
        />
        <button type="button" className="mr-btn mr-btn-primary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={18} />
          Upload CSV/XLSX
        </button>
        <button type="button" className="mr-btn mr-btn-ghost" onClick={downloadTemplate}>
          <Download size={18} />
          Template
        </button>
        <button type="button" className="mr-btn mr-btn-subtle" onClick={loadSampleBom}>
          <RefreshCw size={18} />
          Sample
        </button>
      </div>

      <p className="mr-import-message">
        <FileSpreadsheet size={16} />
        {importMessage}
      </p>

      <textarea
        className="mr-csv-box"
        value={inputText}
        onChange={(event) => setInputText(event.currentTarget.value)}
        aria-label="Paste BOM CSV"
      />
      <button type="button" className="mr-btn mr-btn-ghost mr-run-btn" onClick={runPastedBom}>
        <Search size={18} />
        Analyze pasted BOM
      </button>

      <div className="mr-metric-grid">
        <article>
          <span>Exposed spend</span>
          <strong>{formatMoney(risk.exposedSpend)}</strong>
        </article>
        <article>
          <span>Weighted lead time</span>
          <strong>{risk.weightedLeadWeeks.toFixed(1)} wk</strong>
        </article>
        <article>
          <span>HBM share</span>
          <strong>{formatPercent(risk.hbmShare)}</strong>
        </article>
        <article>
          <span>Top supplier</span>
          <strong>{formatPercent(risk.supplierConcentration)}</strong>
        </article>
      </div>

      <section className="mr-priority-panel">
        <div className="mr-panel-title">
          <ClipboardList size={18} />
          <strong>Procurement priority</strong>
        </div>
        <div className="mr-priority-list">
          {risk.priority.slice(0, 4).map((entry) => (
            <article key={`${entry.rank}-${entry.item.part}`}>
              <div>
                <span>#{entry.rank}</span>
                <strong>{entry.item.part}</strong>
                <small>{entry.action}</small>
              </div>
              <b>{entry.risk}</b>
            </article>
          ))}
        </div>
      </section>
    </aside>
  )

  const renderPricingSection = (standalone = false) => (
    <section className={`mr-section mr-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
      <div className="mr-section-head mr-pricing-head">
        <div>
          <p className="mr-eyebrow">Pricing</p>
          <h2>Team annual is selected because shortage risk is a shared, recurring buying workflow.</h2>
          <p>Annual billing is active by default and is 50% cheaper than the monthly run-rate. Project reports can be sold separately from 499 to 1,999 USD.</p>
        </div>
        <div className="mr-cycle" role="group" aria-label="Billing cycle">
          <button
            type="button"
            data-active={billing === 'monthly' ? 'true' : 'false'}
            onClick={() => {
              setBilling('monthly')
              trackEvent('billing_cycle_change', { billing: 'monthly' })
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            data-active={billing === 'annual' ? 'true' : 'false'}
            onClick={() => {
              setBilling('annual')
              trackEvent('billing_cycle_change', { billing: 'annual' })
            }}
          >
            Annual 50% off
          </button>
        </div>
      </div>

      <div className="mr-plan-grid">
        {plans.map((plan) => {
          const monthly = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
          const strike = billing === 'annual' ? plan.monthlyUsd : null
          const loadingKey = `plan-${plan.id}-${billing}`
          const active = selectedPlanId === plan.id

          return (
            <article className="mr-plan-card" data-popular={plan.popular ? 'true' : 'false'} data-active={active ? 'true' : 'false'} key={plan.id}>
              {plan.popular ? <span className="mr-plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className="mr-price-line">
                {formatMoney(monthly)}
                <small>/mo</small>
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="mr-billing-note">
                {billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
              </strong>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={15} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mr-plan-actions">
                <button
                  type="button"
                  className={plan.popular ? 'mr-btn mr-btn-primary' : 'mr-btn mr-btn-ghost'}
                  onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                  onMouseEnter={() => setSelectedPlanId(plan.id)}
                  disabled={checkoutLoadingKey !== null}
                >
                  {checkoutLoadingKey === loadingKey ? 'Opening secure checkout...' : plan.id === 'team' ? ctaCheckout : `Checkout ${plan.shortName} ${billing}`}
                </button>
                {active ? <span className="mr-plan-selected">Selected</span> : null}
              </div>
            </article>
          )
        })}
      </div>

      {standalone ? (
        <div className="mr-faq-grid">
          <article>
            <h3>Why is Team selected first?</h3>
            <p>Most serious buyers need shared BOMs, supplier comparison, and reports before procurement risk can move across IT, finance, and customer teams.</p>
          </article>
          <article>
            <h3>Where do project reports fit?</h3>
            <p>One-off reports can be sold from 499 to 1,999 USD when a buyer or MSP needs a dated decision memo without a full workspace.</p>
          </article>
          <article>
            <h3>What happens after Team checkout?</h3>
            <p>The buyer gets a shared workspace for BOM imports, supplier comparison, purchase calendar reviews, and MSP-ready reporting.</p>
          </article>
        </div>
      ) : null}
    </section>
  )

  const renderHome = () => {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="mr-main">
        {paymentSuccess ? (
          <section className="mr-success-banner">
            <CheckCircle2 size={18} />
            Payment received. MemoryRisk onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="mr-hero">
          <div className="mr-hero-copy">
            <p className="mr-eyebrow">AI memory shortage risk planner</p>
            <h1>Upload a BOM and see which memory lines can break the next six months.</h1>
            <p className="mr-lede">
              MemoryRisk turns AI memory shortage and HBM shortage pressure into a concrete buying plan: risk score, substitutes, budget sensitivity, supplier comparison, and purchase priority.
            </p>

            <div className="mr-hero-actions">
              <button type="button" className="mr-btn mr-btn-primary" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} />
                Upload BOM
              </button>
              <button type="button" className="mr-btn mr-btn-ghost" onClick={() => chooseTeamAnnual('hero')}>
                <Wallet size={18} />
                {ctaPrimary}
              </button>
              <button type="button" className="mr-btn mr-btn-subtle" onClick={() => navigate('/pricing#pricing')}>
                <BarChart3 size={18} />
                Review plans
              </button>
            </div>
            <p className="mr-payment-note">
              <CheckCircle2 size={16} />
              <span>Team annual selected. Annual saves 50%.</span>
            </p>

            <div className="mr-hero-proof">
              <div>
                <span>Input</span>
                <strong>BOM, supplier quotes, price indexes, lead times, cloud instance prices, and purchase history</strong>
              </div>
              <div>
                <span>Output</span>
                <strong>6-month risk score, alternative parts, budget sensitivity, purchase calendar, and MSP-ready report</strong>
              </div>
            </div>
          </div>

          {renderRiskConsole()}
        </section>

        <section className="mr-proof-strip" aria-label="MemoryRisk proof points">
          {trustItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="mr-section mr-media-section">
          <div className="mr-section-head">
            <p className="mr-eyebrow">Decision view</p>
            <h2>The buyer should see the risk, the money, and the next purchase action before checkout.</h2>
            <p>MemoryRisk is built for procurement teams that need a clear answer when AI server demand collides with memory supply pressure.</p>
          </div>
          <div className="mr-media-grid">
            <figure className="mr-dashboard-shot">
              <img src="/memoryrisk-risk-map.svg" alt="MemoryRisk dashboard preview with risk score, budget sensitivity, substitutes, and procurement calendar" />
              <figcaption>Risk map preview showing the report structure customers expect after upload.</figcaption>
            </figure>
            <div className="mr-signal-list">
              <article>
                <AlertTriangle size={20} />
                <h3>Risk score with cause</h3>
                <p>The score stays tied to memory type, lead time, supplier concentration, spend, and fallback readiness.</p>
              </article>
              <article>
                <Cloud size={20} />
                <h3>Cloud fallback in the same report</h3>
                <p>Temporary cloud capacity is treated as a procurement option, not a separate spreadsheet.</p>
              </article>
              <article>
                <LockKeyhole size={20} />
                <h3>Planning data only</h3>
                <p>The public flow asks for purchasing fields, not supplier portal passwords, cards, keys, or secrets.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mr-section">
          <div className="mr-section-head">
            <p className="mr-eyebrow">Core workflow</p>
            <h2>Shortage risk gets easier to fund when the buyer can immediately see what to buy first.</h2>
            <p>Start with CSV/XLSX imports, transparent risk scoring, and board-ready reports; expand into live channel quotes, cloud price APIs, and team approvals as purchasing gets more complex.</p>
          </div>

          <div className="mr-card-grid">
            {featureCards.map((card) => (
              <article className="mr-card" key={card.title}>
                <div className="mr-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mr-section mr-report-section">
          <div className="mr-report-grid">
            <article className="mr-report-card">
              <p className="mr-eyebrow">Supplier comparison</p>
              <h2>Which supplier controls the risk?</h2>
              <div className="mr-supplier-table">
                {risk.supplierRows.slice(0, 4).map((supplier) => (
                  <div key={supplier.supplier}>
                    <strong>{supplier.supplier}</strong>
                    <span>{formatMoney(supplier.spend)}</span>
                    <span>{formatPercent(supplier.share)}</span>
                    <b>{supplier.leadWeeks.toFixed(1)} wk</b>
                  </div>
                ))}
              </div>
            </article>
            <article className="mr-report-card dark">
              <p className="mr-eyebrow">Budget sensitivity</p>
              <h2>{formatMoney(risk.sixMonthSpend)} six-month pressure case</h2>
              <div className="mr-budget-list">
                {risk.budgetSensitivity.map((scenario) => (
                  <div key={scenario.scenario}>
                    <span>{scenario.scenario}</span>
                    <strong>{formatMoney(scenario.spend)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="mr-section">
          <div className="mr-section-head">
            <p className="mr-eyebrow">Market intelligence</p>
            <h2>Useful pages for buyers researching shortage risk before they upload a BOM.</h2>
            <p>Each page answers a real planning question, then ties the market signal back to a practical BOM decision.</p>
          </div>
          <div className="mr-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: 'MemoryRisk pricing',
                intent: 'Choose Watchlist, Team, or Channel with Team annual already selected.',
              },
            ].map((page) => (
              <a
                className="mr-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="mr-main">
      <article className="mr-article">
        <a
          className="mr-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to MemoryRisk
        </a>
        <p className="mr-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="mr-lede">{page.lede}</p>
        <div className="mr-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Common questions</h2>
          <div className="mr-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="mr-article-cta">
          <div>
            <p className="mr-eyebrow">Recommended next step</p>
            <h2>Upload the BOM, then keep Team annual selected if the report fits.</h2>
            <p>Team annual is the default for shared procurement, finance review, and recurring MSP reporting.</p>
          </div>
          <div className="mr-article-cta-actions">
            <button type="button" className="mr-btn mr-btn-primary" onClick={() => chooseTeamAnnual(`article-${page.path}`)}>
              <Wallet size={18} />
              {page.ctaLabel}
            </button>
            <button type="button" className="mr-btn mr-btn-ghost" onClick={() => navigate('/#planner')}>
              <Upload size={18} />
              Open risk console
            </button>
          </div>
        </aside>
      </article>
    </main>
  )

  const renderPricingPage = () => (
    <main className="mr-main">
      <section className="mr-pricing-page-hero">
        <p className="mr-eyebrow">Pricing</p>
        <h1>MemoryRisk pricing starts with Team selected and annual billing already on.</h1>
        <p className="mr-lede">
          Watchlist fits a single buyer. Team is the default for shared procurement and MSP reports. Channel fits partners managing multiple customer spaces.
        </p>
      </section>
      {renderPricingSection(true)}
    </main>
  )

  const renderLegalPage = (title: string, intro: string, sections: LegalSection[]) => (
    <main className="mr-main">
      <article className="mr-article">
        <p className="mr-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="mr-lede">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const plan = plans.find((item) => item.id === checkoutModal.planId) ?? plans[1]
    const monthly = checkoutModal.billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd

    return (
      <div className="mr-checkout-backdrop" role="dialog" aria-modal="true" aria-label="Secure checkout status">
        <section className="mr-checkout-modal">
          <button
            type="button"
            className="mr-checkout-close"
            aria-label="Close checkout status"
            onClick={() => {
              setCheckoutModal(null)
              setCheckoutLoadingKey(null)
              trackEvent('checkout_overlay_closed', { planId: checkoutModal.planId, billing: checkoutModal.billing })
            }}
          >
            <X size={18} />
          </button>
          {checkoutModal.status === 'loading' ? (
            <div className="mr-checkout-loading">
              <span aria-hidden />
              <div>
                <h2>Preparing Creem checkout...</h2>
                <p>Team annual stays selected while the secure payment window opens.</p>
              </div>
            </div>
          ) : (
            <div className="mr-checkout-copy">
              <p className="mr-eyebrow">Secure checkout</p>
              <h2>{checkoutModal.status === 'popup' ? 'Your Creem payment window is open.' : 'Popup blocked or checkout needs a retry.'}</h2>
              <p>
                {plan.name} {checkoutModal.billing} is set to {formatMoney(monthly)}/mo
                {checkoutModal.billing === 'annual' ? ' with 50% annual savings.' : '.'}
              </p>
              <div className="mr-checkout-actions">
                {checkoutModal.checkoutUrl ? (
                  <button
                    type="button"
                    className="mr-btn mr-btn-primary"
                    onClick={() => {
                      trackEvent('checkout_focus_click', { planId: checkoutModal.planId, billing: checkoutModal.billing })
                      sendPopupToCheckout(openCenteredCheckoutWindow(), checkoutModal.checkoutUrl || '')
                    }}
                  >
                    <ExternalLink size={18} />
                    Focus checkout
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mr-btn mr-btn-primary"
                    onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                  >
                    <ExternalLink size={18} />
                    Retry checkout
                  </button>
                )}
                <button type="button" className="mr-btn mr-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Keep reviewing
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderNotFound = () => (
    <main className="mr-main">
      <section className="mr-center-panel">
        <p className="mr-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="mr-muted">That route is not available.</p>
        <button type="button" className="mr-btn mr-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage('Privacy Policy', 'This policy covers how MemoryRisk handles analytics, checkout, BOM uploads, and public-site interactions.', legalPrivacySections)
  } else if (routeView === 'terms') {
    body = renderLegalPage('Terms of Service', 'These terms describe the limits and responsibilities of the MemoryRisk site, hosted payment flow, and procurement-risk outputs.', legalTermsSections)
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="mr-shell">
      <div className="mr-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="mr-footer">
        <div className="mr-footer-inner">
          <span>MemoryRisk</span>
          <a href="/privacy" onClick={(event) => { event.preventDefault(); navigate('/privacy') }}>Privacy</a>
          <a href="/terms" onClick={(event) => { event.preventDefault(); navigate('/terms') }}>Terms</a>
          <a href="/memory-shortage-2026" onClick={(event) => { event.preventDefault(); navigate('/memory-shortage-2026') }}>Memory shortage 2026</a>
          <a href="/hbm-memory-shortage" onClick={(event) => { event.preventDefault(); navigate('/hbm-memory-shortage') }}>HBM shortage</a>
          <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
          <span className="mr-footer-note">
            <ShieldCheck size={15} />
            Hosted on Cloudflare
          </span>
        </div>
      </footer>
    </div>
  )
}

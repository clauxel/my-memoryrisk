export type PlanId = 'watchlist' | 'team' | 'partner'

export type BomItem = {
  part: string
  category: string
  supplier: string
  quantity: number
  unitCost: number
  leadWeeks: number
  memoryType: string
  cloudFallback: string
  notes: string
}

export type RiskSummary = {
  score: number
  label: string
  sixMonthSpend: number
  exposedSpend: number
  weightedLeadWeeks: number
  hbmShare: number
  supplierConcentration: number
  supplierCount: number
  budgetSensitivity: Array<{ scenario: string; delta: number; spend: number }>
  priority: Array<{ rank: number; item: BomItem; risk: number; action: string }>
  alternatives: Array<{ item: string; suggestion: string; reason: string }>
  supplierRows: Array<{ supplier: string; spend: number; share: number; leadWeeks: number; risk: number }>
  calendar: Array<{ window: string; action: string; detail: string }>
}

const sampleBom: BomItem[] = [
  {
    part: 'NVIDIA H200 SXM cluster allocation',
    category: 'AI server',
    supplier: 'Primary distributor',
    quantity: 16,
    unitCost: 38000,
    leadWeeks: 28,
    memoryType: 'HBM3E',
    cloudFallback: 'H200 reserved instance',
    notes: 'Training cluster expansion',
  },
  {
    part: 'DDR5 128GB RDIMM 5600 ECC',
    category: 'server memory',
    supplier: 'OEM channel',
    quantity: 192,
    unitCost: 610,
    leadWeeks: 14,
    memoryType: 'DDR5 RDIMM',
    cloudFallback: 'r7i bare metal',
    notes: 'Inference node refresh',
  },
  {
    part: '2U inference server with 8 GPUs',
    category: 'server',
    supplier: 'Systems integrator',
    quantity: 6,
    unitCost: 124000,
    leadWeeks: 22,
    memoryType: 'HBM bundle',
    cloudFallback: 'A100/H100 on demand',
    notes: 'Customer delivery quarter',
  },
  {
    part: 'Enterprise SSD 15.36TB NVMe',
    category: 'storage',
    supplier: 'Secondary distributor',
    quantity: 80,
    unitCost: 1250,
    leadWeeks: 10,
    memoryType: 'NAND',
    cloudFallback: 'object storage tier',
    notes: 'KV cache and logging',
  },
]

function text(value: unknown, fallback = '') {
  return String(value ?? fallback).trim()
}

function numberValue(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value ?? '').replace(/[$,\s]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : fallback
}

function pick(row: Record<string, unknown>, candidates: string[]) {
  const normalized = new Map(Object.keys(row).map((key) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), key]))
  for (const candidate of candidates) {
    const key = normalized.get(candidate.toLowerCase().replace(/[^a-z0-9]/g, ''))
    if (key) return row[key]
  }
  return undefined
}

export function normalizeBomRows(rows: Array<Record<string, unknown>>): BomItem[] {
  const normalized = rows
    .map((row, index) => {
      const part = text(pick(row, ['part', 'part number', 'sku', 'item', 'component', 'server', 'description']), `Line ${index + 1}`)
      const category = text(pick(row, ['category', 'type', 'class', 'family']), 'memory')
      const supplier = text(pick(row, ['supplier', 'vendor', 'manufacturer', 'source']), 'Unassigned supplier')
      const memoryType = text(pick(row, ['memory type', 'memory', 'dram', 'hbm', 'technology']), category)
      return {
        part,
        category,
        supplier,
        quantity: Math.max(1, numberValue(pick(row, ['quantity', 'qty', 'units', 'count']), 1)),
        unitCost: Math.max(0, numberValue(pick(row, ['unit cost', 'price', 'quote', 'unit price', 'cost']), 0)),
        leadWeeks: Math.max(0, numberValue(pick(row, ['lead weeks', 'lead time', 'leadtime', 'weeks', 'eta weeks']), 12)),
        memoryType,
        cloudFallback: text(pick(row, ['cloud fallback', 'cloud', 'instance', 'alternative cloud']), ''),
        notes: text(pick(row, ['notes', 'use case', 'project', 'owner']), ''),
      }
    })
    .filter((item) => item.part && item.part.toLowerCase() !== 'line')

  return normalized.length ? normalized : sampleBom
}

function categoryPressure(item: BomItem) {
  const haystack = `${item.part} ${item.category} ${item.memoryType} ${item.notes}`.toLowerCase()
  let score = 18
  if (haystack.includes('hbm4')) score += 34
  else if (haystack.includes('hbm3e')) score += 31
  else if (haystack.includes('hbm')) score += 28
  if (haystack.includes('gpu') || haystack.includes('h100') || haystack.includes('h200') || haystack.includes('b200')) score += 14
  if (haystack.includes('ddr5') || haystack.includes('rdimm') || haystack.includes('server memory')) score += 18
  if (haystack.includes('ssd') || haystack.includes('nand')) score += 9
  if (haystack.includes('cloud')) score -= 5
  return Math.min(70, Math.max(8, score))
}

function leadRisk(weeks: number) {
  if (weeks >= 26) return 24
  if (weeks >= 18) return 18
  if (weeks >= 12) return 12
  if (weeks >= 8) return 7
  return 3
}

function spend(item: BomItem) {
  return item.quantity * item.unitCost
}

function itemRisk(item: BomItem, supplierShare: number) {
  return Math.min(99, Math.round(categoryPressure(item) + leadRisk(item.leadWeeks) + supplierShare * 18))
}

function riskLabel(score: number) {
  if (score >= 78) return 'Critical'
  if (score >= 62) return 'High'
  if (score >= 42) return 'Watch'
  return 'Controlled'
}

function alternativeFor(item: BomItem) {
  const haystack = `${item.part} ${item.category} ${item.memoryType}`.toLowerCase()
  if (haystack.includes('hbm')) {
    return {
      item: item.part,
      suggestion: item.cloudFallback || 'Reserve cloud GPUs while negotiating HBM allocation',
      reason: 'HBM substitution is rarely pin-compatible, so the practical fallback is often workload scheduling, cloud capacity, or a different accelerator bundle.',
    }
  }
  if (haystack.includes('ddr5') || haystack.includes('rdimm')) {
    return {
      item: item.part,
      suggestion: 'Approve second-source DDR5 RDIMM equivalents with the same capacity, speed, rank, and platform validation.',
      reason: 'Server DRAM usually has more practical substitution paths than HBM, but validation and firmware compatibility still matter.',
    }
  }
  if (haystack.includes('ssd') || haystack.includes('nand')) {
    return {
      item: item.part,
      suggestion: 'Pre-approve an endurance-matched NVMe SSD and a temporary cloud storage tier.',
      reason: 'NAND exposure can often be softened with endurance-class alternates and a short-term cloud storage buffer.',
    }
  }
  return {
    item: item.part,
    suggestion: 'Create a same-function alternate with quote owner, validation status, and last acceptable order date.',
    reason: 'A substitute is useful only when commercial terms and technical approval are ready before shortage pressure peaks.',
  }
}

export function analyzeBom(items: BomItem[]): RiskSummary {
  const rows = items.length ? items : sampleBom
  const totalSpend = rows.reduce((sum, item) => sum + spend(item), 0) || 1
  const suppliers = new Map<string, { spend: number; leadWeighted: number; riskWeighted: number }>()

  rows.forEach((item) => {
    const current = suppliers.get(item.supplier) ?? { spend: 0, leadWeighted: 0, riskWeighted: 0 }
    const itemSpend = spend(item)
    current.spend += itemSpend
    current.leadWeighted += item.leadWeeks * itemSpend
    suppliers.set(item.supplier, current)
  })

  const supplierShareByName = new Map<string, number>()
  suppliers.forEach((value, key) => supplierShareByName.set(key, value.spend / totalSpend))

  const priority = rows
    .map((item) => {
      const risk = itemRisk(item, supplierShareByName.get(item.supplier) ?? 0)
      const action =
        risk >= 82
          ? 'Lock quote, reserve allocation, and approve fallback this week'
          : risk >= 65
            ? 'Dual-source and set a last acceptable order date'
            : risk >= 45
              ? 'Watch weekly price and lead-time movement'
              : 'Keep in normal replenishment cadence'
      return { rank: 0, item, risk, action }
    })
    .sort((a, b) => b.risk - a.risk)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const score = Math.round(priority.reduce((sum, entry) => sum + entry.risk * spend(entry.item), 0) / totalSpend)
  const weightedLeadWeeks = rows.reduce((sum, item) => sum + item.leadWeeks * spend(item), 0) / totalSpend
  const hbmSpend = rows
    .filter((item) => `${item.part} ${item.category} ${item.memoryType}`.toLowerCase().includes('hbm'))
    .reduce((sum, item) => sum + spend(item), 0)
  const supplierRows = Array.from(suppliers.entries())
    .map(([supplier, value]) => {
      const share = value.spend / totalSpend
      return {
        supplier,
        spend: value.spend,
        share,
        leadWeeks: value.leadWeighted / Math.max(1, value.spend),
        risk: Math.round((share * 45) + Math.min(35, value.leadWeighted / Math.max(1, value.spend) * 1.4)),
      }
    })
    .sort((a, b) => b.spend - a.spend)

  const topSupplierShare = supplierRows[0]?.share ?? 0
  const exposedSpend = priority.filter((entry) => entry.risk >= 62).reduce((sum, entry) => sum + spend(entry.item), 0)
  const pressureMultiplier = score >= 75 ? 1.28 : score >= 58 ? 1.18 : 1.1
  const sixMonthSpend = totalSpend * pressureMultiplier

  return {
    score,
    label: riskLabel(score),
    sixMonthSpend,
    exposedSpend,
    weightedLeadWeeks,
    hbmShare: hbmSpend / totalSpend,
    supplierConcentration: topSupplierShare,
    supplierCount: suppliers.size,
    budgetSensitivity: [
      { scenario: 'Base quote', delta: 0, spend: totalSpend },
      { scenario: 'Memory +12%', delta: 12, spend: totalSpend * 1.12 },
      { scenario: 'HBM +28%', delta: 28, spend: totalSpend + hbmSpend * 0.28 + (totalSpend - hbmSpend) * 0.08 },
      { scenario: 'Delay penalty', delta: 0, spend: sixMonthSpend },
    ],
    priority,
    alternatives: priority.slice(0, 5).map((entry) => alternativeFor(entry.item)),
    supplierRows,
    calendar: [
      {
        window: 'Week 1',
        action: 'Freeze the high-risk lines',
        detail: 'Confirm quantities, quote owners, and whether allocation can be held without changing delivery dates.',
      },
      {
        window: 'Weeks 2-4',
        action: 'Approve substitutes',
        detail: 'Complete technical validation for DDR5, SSD, server bundle, and cloud fallback choices.',
      },
      {
        window: 'Month 2',
        action: 'Reprice budget bands',
        detail: 'Refresh supplier quotes, cloud instance prices, and memory price indexes before budget signoff.',
      },
      {
        window: 'Months 3-6',
        action: 'Stage purchase orders',
        detail: 'Pull forward critical orders and keep lower-risk replenishment on a rolling review calendar.',
      },
    ],
  }
}

export function getSampleBom() {
  return sampleBom
}

export function buildCsvTemplate() {
  return [
    'part,category,supplier,quantity,unit_cost,lead_weeks,memory_type,cloud_fallback,notes',
    ...sampleBom.map((item) =>
      [
        item.part,
        item.category,
        item.supplier,
        item.quantity,
        item.unitCost,
        item.leadWeeks,
        item.memoryType,
        item.cloudFallback,
        item.notes,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n')
}

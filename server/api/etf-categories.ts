import { CATEGORIES, fetchEtfFee } from '../utils/etf-codes'
import type { EtfItem } from '../utils/etf-codes'

interface EtfCategory {
  code: string
  label: string
  top: EtfItem
  others: EtfItem[]
}

let cache: { data: EtfCategory[]; timestamp: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000

export default defineEventHandler(async (): Promise<EtfCategory[]> => {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data
  }

  const allItemcodes = Object.values(CATEGORIES).flatMap((c) => c.itemcodes)
  const uniqueCodes = [...new Set(allItemcodes)]

  const results = await Promise.all(
    uniqueCodes.map(async (code) => ({ code, item: await fetchEtfFee(code) })),
  )
  const itemMap = new Map(results.filter((r) => r.item !== null).map((r) => [r.code, r.item!]))

  const categories: EtfCategory[] = Object.values(CATEGORIES).map((cat) => {
    const etfs = cat.itemcodes
      .map((code) => itemMap.get(code))
      .filter((item): item is EtfItem => item !== null)
      .sort((a, b) => a.fee - b.fee)

    const [top, ...others] = etfs
    return {
      code: cat.code,
      label: cat.label,
      top: top ?? { name: '-', provider: '-', fee: 0 },
      others,
    }
  })

  cache = { data: categories, timestamp: Date.now() }
  return categories
})

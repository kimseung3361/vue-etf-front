import { CATEGORIES, fetchEtfFee, fetchNaverEtfList } from '../../utils/etf-codes'
import type { EtfDetailItem } from '../../utils/etf-codes'

interface DetailResponse {
  code: string
  label: string
  description: string
  etfs: EtfDetailItem[]
  updatedAt: string
}

const cache = new Map<string, { data: DetailResponse; timestamp: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000

export default defineEventHandler(async (event): Promise<DetailResponse> => {
  const code = getRouterParam(event, 'code') ?? ''
  const cat = CATEGORIES[code]

  if (!cat) {
    throw createError({ statusCode: 404, message: '카테고리를 찾을 수 없습니다.' })
  }

  const cached = cache.get(code)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  // 시장 데이터와 수수료 데이터 병렬 조회
  const [marketMap, feeResults] = await Promise.all([
    fetchNaverEtfList(),
    Promise.all(
      cat.detailItemcodes.map(async (itemcode) => ({
        itemcode,
        item: await fetchEtfFee(itemcode),
      })),
    ),
  ])

  const etfs: EtfDetailItem[] = feeResults
    .filter((r) => r.item !== null)
    .map((r) => {
      const market = marketMap.get(r.itemcode)
      return {
        itemcode: r.itemcode,
        name: r.item!.name,
        provider: r.item!.provider,
        fee: r.item!.fee,
        nowVal: market?.nowVal ?? 0,
        changeVal: market?.changeVal ?? 0,
        changeRate: market?.changeRate ?? 0,
        nav: market?.nav ?? 0,
        marketSum: market?.marketSum ?? 0,
        threeMonthReturn: market?.threeMonthReturn ?? 0,
      }
    })
    .sort((a, b) => a.fee - b.fee)

  const data: DetailResponse = {
    code: cat.code,
    label: cat.label,
    description: cat.description,
    etfs,
    updatedAt: new Date().toISOString(),
  }

  cache.set(code, { data, timestamp: Date.now() })
  return data
})

export interface EtfItem {
  name: string
  provider: string
  fee: number
}

export interface EtfDetailItem extends EtfItem {
  itemcode: string
  nowVal: number       // 현재가 (원)
  changeVal: number    // 등락폭 (원)
  changeRate: number   // 당일 등락률 (%)
  nav: number          // NAV
  marketSum: number    // 순자산 (백만원)
  threeMonthReturn: number  // 3개월 수익률 (%)
}

export interface CategoryMeta {
  code: string
  label: string
  description: string
  // 홈용 3개 + 상세용 전체
  itemcodes: string[]
  detailItemcodes: string[]
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  SP500: {
    code: 'SP500',
    label: 'S&P 500',
    description: '미국 500대 대형주를 추종하는 ETF. 미국 주식 시장의 대표 지수.',
    itemcodes: ['360750', '379800', '360200'],
    detailItemcodes: ['360750', '379800', '360200', '379780'],
  },
  NDX: {
    code: 'NDX',
    label: '나스닥 100',
    description: '나스닥 상장 시가총액 상위 100개 기업 추종. 기술주 비중 높음.',
    itemcodes: ['133690', '379810', '367380'],
    detailItemcodes: ['133690', '379810', '367380', '368590'],
  },
  DOWDIV: {
    code: 'DOWDIV',
    label: '미국배당다우존스',
    description: '10년 이상 배당 성장을 이어온 미국 우량 기업에 투자.',
    itemcodes: ['458730', '446720', '402970'],
    detailItemcodes: ['458730', '446720', '402970'],
  },
  K200: {
    code: 'K200',
    label: '코스피200',
    description: '국내 코스피 시장 대형주 200개를 추종하는 ETF.',
    itemcodes: ['148020', '152100', '105190'],
    detailItemcodes: ['069500', '148020', '152100', '105190'],
  },
  USBOND30: {
    code: 'USBOND30',
    label: '미국30년국채',
    description: '미국 30년 만기 장기국채에 투자. 금리 하락 시 높은 수익.',
    itemcodes: ['461600', '453850', '484790'],
    detailItemcodes: ['461600', '453850', '484790'],
  },
  USTECH10: {
    code: 'USTECH10',
    label: '미국테크TOP10',
    description: '애플·엔비디아 등 미국 빅테크 상위 10종목 집중 투자.',
    itemcodes: ['461900', '481190', '381170'],
    detailItemcodes: ['461900', '481190', '381170'],
  },
  CHINASEMI: {
    code: 'CHINASEMI',
    label: '차이나항셍테크',
    description: '홍콩 항셍테크 지수 추종. 중국 대형 기술주에 투자.',
    itemcodes: ['371160', '372330', '371150'],
    detailItemcodes: ['371160', '372330', '371150', '371870'],
  },
  INDIA50: {
    code: 'INDIA50',
    label: '인도니프티50',
    description: '인도 최대 주가지수 니프티50 추종. 인도 경제 성장에 투자.',
    itemcodes: ['453810', '200250', '453870'],
    detailItemcodes: ['453810', '200250', '453870'],
  },
}

// 네이버 금융 개별 ETF 페이지에서 이름/운용사/총보수 파싱
export async function fetchEtfFee(itemcode: string): Promise<EtfItem | null> {
  try {
    const html = (await $fetch<string>(`https://finance.naver.com/item/main.naver?code=${itemcode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        Referer: 'https://finance.naver.com/etf/',
      },
      responseType: 'text',
    })) ?? ''

    const nameMatch = html.match(/<title>([^:]+)\s*:/)
    const name = nameMatch?.[1]?.trim() ?? ''

    const providerMatch = html.match(/<span title="([^"]+(?:자산운용|투자신탁운용))[^"]*">/)
    const provider = providerMatch?.[1]?.replace(/\(주\)/g, '').trim() ?? ''

    const feeMatch = html.match(/<td>연<em>([\d.]+)%<\/em><\/td>/)
    if (!feeMatch?.[1]) return null
    const fee = parseFloat(feeMatch[1]) / 100

    return { name, provider, fee }
  } catch {
    return null
  }
}

// 네이버 ETF 목록 API에서 시장 데이터 가져오기 (NAV, 수익률, 순자산 등)
// 응답이 euc-kr이므로 arraybuffer로 받아 iconv-lite로 디코딩
export async function fetchNaverEtfList(): Promise<Map<string, { nowVal: number; changeVal: number; changeRate: number; nav: number; marketSum: number; threeMonthReturn: number }>> {
  try {
    const { default: iconv } = await import('iconv-lite')
    const raw = await $fetch<ArrayBuffer>('https://finance.naver.com/api/sise/etfItemList.nhn', {
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://finance.naver.com' },
      responseType: 'arrayBuffer',
    })
    const decoded = iconv.decode(Buffer.from(raw), 'euc-kr')
    const json = JSON.parse(decoded)
    const items: any[] = json?.result?.etfItemList ?? []
    return new Map(
      items.map((item) => [
        item.itemcode as string,
        {
          nowVal: item.nowVal ?? 0,
          changeVal: item.changeVal ?? 0,
          changeRate: item.changeRate ?? 0,
          nav: item.nav ?? 0,
          marketSum: item.marketSum ?? 0,
          threeMonthReturn: item.threeMonthEarnRate ?? 0,
        },
      ]),
    )
  } catch {
    return new Map()
  }
}

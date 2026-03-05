export const useEtfFormat = () => {
  // 소수 비율 → 퍼센트 문자열  (예: 0.00005 → "0.005%")
  const pct = (fee: number) => (fee * 100).toFixed(3) + '%'

  // 순자산 단위 변환  (입력: 백만원 → 출력: 억 / 천억 / 조)
  const formatAum = (marketSum: number) => {
    const eok = marketSum / 100
    if (eok >= 10000) return (eok / 10000).toFixed(1) + '조'
    if (eok >= 1000) return (eok / 1000).toFixed(1) + '천억'
    return eok.toFixed(0) + '억'
  }

  // 수익률 문자열  양수면 + 기호 붙임  (예: +3.25% / -1.50%)
  const formatReturn = (val: number) => (val > 0 ? '+' : '') + val.toFixed(2) + '%'

  // 수익률 Tailwind 색상 클래스 
  const returnColor = (val: number) => {
    if (val > 0) return 'text-red-500'
    if (val < 0) return 'text-blue-500'
    return 'text-gray-500'
  }

  return { pct, formatAum, formatReturn, returnColor }
}

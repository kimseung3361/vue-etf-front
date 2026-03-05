export interface EtfItem {
  name: string
  provider: string
  fee: number // 0.001 = 0.100%
}

export interface EtfCategory {
  code: string
  label: string
  top: EtfItem
  others: EtfItem[]
}

export const useHomeCategories = () => {
  const { data, status, error, refresh } = useFetch<EtfCategory[]>('/api/etf-categories', {
    lazy: false,
    server: true,
  })

  const categories = computed<EtfCategory[]>(() => data.value ?? [])
  const loading = computed(() => status.value === 'pending')

  return { categories, loading, error, refresh }
}

export function useFlowbite(callback: (flowbite: any) => void) {
  if (import.meta.client) {
    import('flowbite').then((flowbite) => {
      callback(flowbite)
    })
  }
}
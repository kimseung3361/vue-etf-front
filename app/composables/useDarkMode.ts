export const useDarkMode = () => {
  const isDark = useState('darkMode', () => false)

  const apply = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(dark))
  }

  const toggle = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
  }

  const init = () => {
    const saved = localStorage.getItem('darkMode')
    const dark = saved === 'true'
    isDark.value = dark
    apply(dark)
  }

  return { isDark, toggle, init }
}

import type { SupabaseClient, User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const supabase = useNuxtApp().$supabase as SupabaseClient
  const authState = reactive<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  })

  // 현재 사용자 정보 조회
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    authState.user = data.user
    return data.user
  }

  // 로그인
  const login = async (email: string, password: string) => {
    authState.isLoading = true
    authState.error = null

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error(error.message)

      authState.user = data.user
      return { success: true, user: data.user }
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인 실패'
      authState.error = message
      return { success: false, error: message }
    } finally {
      authState.isLoading = false
    }
  }

  // 로그아웃
  const logout = async () => {
    authState.isLoading = true
    authState.error = null

    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw new Error(error.message)

      authState.user = null
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그아웃 실패'
      authState.error = message
      return { success: false, error: message }
    } finally {
      authState.isLoading = false
    }
  }

  // 회원가입
  const signup = async (email: string, password: string) => {
    authState.isLoading = true
    authState.error = null

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw new Error(error.message)

      authState.user = data.user
      return { success: true, user: data.user }
    } catch (err) {
      const message = err instanceof Error ? err.message : '회원가입 실패'
      authState.error = message
      return { success: false, error: message }
    } finally {
      authState.isLoading = false
    }
  }

  // 마운트 시 현재 사용자 확인
  onMounted(() => {
    fetchUser()
  })

  return {
    // State
    user: readonly(computed(() => authState.user)),
    isLoading: readonly(computed(() => authState.isLoading)),
    error: readonly(computed(() => authState.error)),
    isLoggedIn: readonly(computed(() => !!authState.user)),

    // Methods
    login,
    logout,
    signup,
    fetchUser,
  }
}

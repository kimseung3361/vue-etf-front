import { createClient } from '@supabase/supabase-js'

// Supabase의 Project URL과 anon public key를 입력합니다.
const supabaseUrl = 'https://deafduhenxsqwyywcsio.supabase.co'  // 대시보드에서 복사한 URL
const supabaseKey = 'sb_publishable_AQ4G0S5T60jP51Iq_eluuQ_aHKFu4EZ'    // 대시보드에서 복사한 anon key

export default defineNuxtPlugin(nuxtApp => {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // supabase 객체를 Nuxt 앱 전체에서 사용할 수 있도록 전역에 제공
  nuxtApp.provide('supabase', supabase)
})
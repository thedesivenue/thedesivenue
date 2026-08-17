'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Magic-link emails on this project deliver the session as a URL hash
// fragment (#access_token=...&refresh_token=...) rather than the PKCE
// "code" or OTP "token_hash" shapes — and @supabase/ssr's browser client,
// unlike plain supabase-js, does not auto-detect/consume that fragment
// (it's built around the cookie-based PKCE flow instead). This runs on
// every page to catch it manually wherever the redirect happens to land,
// since the app can't control which URL Supabase's dashboard-configured
// Site URL sends it to.
export function AuthHashHandler() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes('access_token')) return

    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    if (!access_token || !refresh_token) return

    const supabase = createClient()
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      if (!error) window.location.href = '/account'
    })
  }, [])

  return null
}

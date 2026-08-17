import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'

// Handles both the PKCE ("code") and OTP ("token_hash" + "type") link shapes,
// since which one Supabase actually sends depends on project-level email
// template settings we don't control from the app.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/account'
  const supabase = await createServerSupabase()

  const code = searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=invalid-link`)
}

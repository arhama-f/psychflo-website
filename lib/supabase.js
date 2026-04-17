import { createClient } from "@supabase/supabase-js";

// Server-side client (uses service role key — never expose to browser)
export function getSupabaseServer() {
  const url  = process.env.SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Browser-safe client (uses anon key)
export function getSupabaseBrowser() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

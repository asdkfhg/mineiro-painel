import { createClient } from "@supabase/supabase-js";

let client = null;

// Server-only client using the service role key. Never import this from
// client components — it bypasses Row Level Security on purpose because
// every table is only ever touched through our own authenticated API routes.
export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltam as variáveis SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}

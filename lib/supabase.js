import { createClient } from "@supabase/supabase-js";

// Hanya publishable key (role anon, dibatasi RLS). Jangan pernah memakai secret/service-role key di sini.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false } }
);

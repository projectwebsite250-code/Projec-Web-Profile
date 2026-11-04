import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
// Tanpa awalan NEXT_PUBLIC_ sehingga tidak pernah terkirim ke browser. Modul ini hanya untuk kode server.
const secretKey = process.env.SUPABASE_SECRET_KEY;
const options = { auth: { persistSession: false, autoRefreshToken: false } };

// null bila env belum diisi: halaman memakai lib/content.js dan penyimpanan data dilewati.
export const supabase = url && publishableKey ? createClient(url, publishableKey, options) : null;
export const supabaseAdmin = url && secretKey ? createClient(url, secretKey, options) : null;

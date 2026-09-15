import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hawrqmvozoscjcxobwrc.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__8Fjm1KQGeoSSpNwP6zwlA_AjqiVl64';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

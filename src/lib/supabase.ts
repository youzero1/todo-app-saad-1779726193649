import { createClient, SupabaseClient } from '@supabase/supabase-js';

/// <reference types="vite/client" />

const url = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_URL;
const key = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

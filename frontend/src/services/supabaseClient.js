import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Gracefully instantiate client or a safe fallback proxy
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c WanderWise running in Demo Mode %c \nSupabase keys not detected in frontend/.env. Using client-side storage & mock AI.',
    'background: #0d9488; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
    'color: #64748b;'
  );
}

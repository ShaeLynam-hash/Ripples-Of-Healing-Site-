/* =============================================
   Supabase client — shared across all pages
   ============================================= */
const SUPABASE_URL  = 'https://indmbezacqesboecocvn.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZG1iZXphY3Flc2JvZWNvY3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODYyODQsImV4cCI6MjA4OTU2MjI4NH0.MJOkY4zGzjJSUGV5s_nvp9GsccacF1DjVKoH4Lm9aCk';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,       // remember the user across browser closes
    storageKey: 'roh-auth',     // unique key in localStorage
    autoRefreshToken: true,     // silently refresh when token expires
    detectSessionInUrl: true,   // handle Google OAuth redirect automatically
  }
});

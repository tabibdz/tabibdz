import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqxexghglbgkueefnzkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeGV4Z2hnbGJna3VlZWZuemt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDI1MzgsImV4cCI6MjA4OTAxODUzOH0.PtnwXyy6foz2KEiXtiOnQZnE0UnLd9c5UP6a280Qzzg'

// Workaround for known Supabase bug: "Lock broken by another request"
// See: github.com/supabase/supabase-js/issues/1594
// Disables the Web Locks API which hangs in React 19 Strict Mode
// when multiple pages do auth checks simultaneously.
const noOpLock = async (name, acquireTimeout, fn) => {
  return await fn()
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    lock: noOpLock,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
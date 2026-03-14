import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqxexghglbgkueefnzkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeGV4Z2hnbGJna3VlZWZuemt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDI1MzgsImV4cCI6MjA4OTAxODUzOH0.PtnwXyy6foz2KEiXtiOnQZnE0UnLd9c5UP6a280Qzzg'

export const supabase = createClient(supabaseUrl, supabaseKey)
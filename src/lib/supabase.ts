import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with Radio TELsTP project credentials
const supabaseUrl = 'https://vrfyjirddfdnwuffzqhb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnlqaXJkZGZkbnd1ZmZ6cWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDYwNjMsImV4cCI6MjA3NTQ4MjA2M30.glgJwI2yIqUFG8ZtWJk2esxGdXw6nFp5eQ8aANbRAvE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    ACo7fb4171b31b748838f8b02e6ef49aebf: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export { supabase };

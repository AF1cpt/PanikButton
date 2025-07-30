import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// For development/testing, use mock mode
const MOCK_MODE = false;

let supabase;

if (MOCK_MODE) {
  // Mock client for development
  supabase = {
    auth: {
      signIn: async () => ({ data: { user: { id: 'mock-user', email: 'test@example.com' } }, error: null }),
      signUp: async () => ({ data: { user: { id: 'mock-user', email: 'test@example.com' } }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    functions: {
      invoke: async () => ({ data: { alertId: 'mock-alert-123' }, error: null }),
    },
  };
} else {
  // Real Supabase client (replace with your actual credentials)
  const supabaseUrl = 'https://jlvmcafdbzkbuifcctvn.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsdm1jYWZkYnprYnVpZmNjdHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjMxOTcsImV4cCI6MjA2OTI5OTE5N30.6g12RgxH3b394ok2wA2QOefiPr5W7QuXsnk7UotB4Tg';
  
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export { supabase }; 
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// For development/testing, use mock mode
const MOCK_MODE = true;

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
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  
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
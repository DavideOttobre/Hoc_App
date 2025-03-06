// Questo file è stato mantenuto per compatibilità con il codice esistente
// ma è stato modificato per non richiedere più le credenziali di Supabase
// Utilizzare le API in src/lib/api.ts invece di questo file

import { Database } from './database.types';

// Mock di Supabase per evitare errori durante la migrazione
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        range: () => ({
          then: () => Promise.resolve({ data: [], error: null })
        }),
        then: () => Promise.resolve({ data: [], error: null })
      }),
      eq: () => ({
        then: () => Promise.resolve({ data: [], error: null })
      }),
      then: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      then: () => Promise.resolve({ data: null, error: null })
    }),
    update: () => ({
      eq: () => ({
        then: () => Promise.resolve({ data: null, error: null })
      }),
      then: () => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: () => ({
        then: () => Promise.resolve({ data: null, error: null })
      }),
      then: () => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    admin: {
      updateUserById: () => Promise.resolve({ data: null, error: null })
    }
  }
} as any;

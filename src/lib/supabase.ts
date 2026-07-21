import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'lovechain',
        },
      },
    });
  }
  return supabaseClient;
}

// Export a proxy for backward compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (typeof window === 'undefined') {
      // During SSR, return a mock that throws if methods are called
      return () => {
        throw new Error('Supabase client cannot be used during SSR. Please use getSupabaseClient() only on the client side.');
      };
    }
    const client = getSupabaseClient();
    return client[prop as keyof typeof client];
  },
});

// Database types
export interface Couple {
  id: string;
  slug: string;
  edit_token: string;
  recovery_email?: string;
  created_at: string;
  content: CoupleContent;
}

export interface CoupleContent {
  // Home page
  partnerName?: string;
  welcomeMessage?: string;
  relationshipStartDate?: string;
  
  // Date page
  dateQuestion?: string;
  
  // Letter page
  letterText?: string;
  
  // Reasons page
  reasons?: string[];
  
  // Gallery page
  galleryPhotos?: Array<{
    url: string;
    caption: string;
  }>;
  
  // Voice page
  voiceNoteUrl?: string;
  
  // Playlist page
  songs?: Array<{
    title: string;
    artist: string;
    note: string;
    link: string;
  }>;
  
  // Future/Bucket List page
  bucketList?: Array<{
    text: string;
    done: boolean;
  }>;
  
  // Compliments page
  compliments?: string[];
  
  // Quiz page
  quizQuestions?: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
  quizScore?: number;
  
  // Map page
  mapPins?: Array<{
    x: number;
    y: number;
    label: string;
    memory: string;
  }>;
  
  // Constellation page
  constellationMemories?: Array<{
    x: number;
    y: number;
    memory: string;
    tapped?: boolean;
  }>;
  
  // Garden page
  gardenStages?: Array<{
    label: string;
    caption: string;
  }>;
  
  // Countdown page
  countdownDate?: string;
  
  // Finale page
  finaleMessage?: string;
  
  // Page visibility toggles
  enabledPages?: string[];
}

import { createClient } from '@supabase/supabase-js';

let supabase = null;
let supabaseServiceRole = null;

// Client with anon key (for client-side use)
const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      const error = new Error('Supabase environment variables are not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env.local file.');
      error.name = 'SupabaseConfigError';
      throw error;
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

// Client with service role key (bypasses RLS, for server-side use only)
export const getSupabaseServiceClient = () => {
  if (!supabaseServiceRole) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not configured');
    }
    
    supabaseServiceRole = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseServiceRole;
};

export const uploadToSupabase = async (file) => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.storage
      .from('gallery')
      .upload(`img-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = client.storage.from('gallery').getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    // Provide more helpful error message
    if (error.name === 'SupabaseConfigError') {
      throw new Error('Supabase is not configured. Please set up your environment variables. See README for instructions.');
    }
    throw error;
  }
};

export default getSupabaseClient;
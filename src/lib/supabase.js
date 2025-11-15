import { createClient } from '@supabase/supabase-js';

let supabase = null;
let supabaseServiceRole = null;

// Client with anon key (for client-side use)
const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables (SUPABASE_URL and SUPABASE_ANON_KEY) are not configured');
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
      .upload(`img-${Date.now()}.jpg`, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = client.storage.from('gallery').getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
};

export default getSupabaseClient;
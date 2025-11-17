import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getSupabaseServiceClient } from '@/lib/supabase';

const verifyToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function POST(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set SUPABASE_URL environment variable.' },
        { status: 500 }
      );
    }

    // Check if we have either service role key or anon key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase keys are not configured. Please set SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_ANON_KEY environment variable.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const bucketName = formData.get('bucket') || 'gallery'; // Allow custom bucket name

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Upload to Supabase using service role client (bypasses RLS)
    const client = getSupabaseServiceClient();
    const { data: uploadData, error: uploadError } = await client.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      // Provide helpful error message for bucket not found
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
        throw new Error(
          `Storage bucket "${bucketName}" not found in Supabase. ` +
          `Please create a bucket named "${bucketName}" in your Supabase Storage. ` +
          `Go to Supabase Dashboard > Storage > Create Bucket.`
        );
      }
      // Provide helpful error message for RLS policy violation
      if (uploadError.message?.includes('row-level security policy') || uploadError.message?.includes('RLS')) {
        throw new Error(
          `Row Level Security (RLS) policy violation. ` +
          `Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables (recommended for server-side uploads), ` +
          `or configure RLS policies in Supabase to allow anonymous uploads to the "${bucketName}" bucket. ` +
          `Go to Supabase Dashboard > Storage > Policies to manage RLS policies.`
        );
      }
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(uploadData.path);
    const url = urlData.publicUrl;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}


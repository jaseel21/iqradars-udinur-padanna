import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Gallery from '@/models/Gallery';

export async function GET() {
  await connectDB();
  const images = await Gallery.find().sort({ uploadedAt: -1 });
  console.log(images);
  
  return NextResponse.json(images);
}

export async function POST(req) {
  // Protected
  await connectDB();
  const { url } = await req.json();
  await new Gallery({ url }).save();
  return NextResponse.json({ success: true });
}
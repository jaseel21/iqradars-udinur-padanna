import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Contact from '@/models/Contact';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  await new Contact(body).save();
  return NextResponse.json({ success: true });
}
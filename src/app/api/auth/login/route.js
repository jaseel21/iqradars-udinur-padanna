import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';

export async function POST(req) {
  console.log('=== LOGIN ATTEMPT START ===');
  await connectDB();

  let body;
  try {
    body = await req.json();
    console.log('Request body parsed:', body);
  } catch (err) {
    console.error('Body parse error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body;
  console.log('Input email:', email);
  console.log('Input password length:', password?.length || 0);

  console.log('Env EMAIL:', process.env.EMAIL);
  console.log('Env PASSWORD loaded:', !!process.env.PASSWORD);

  const emailMatch = email === process.env.EMAIL;
  const pwMatch = password === process.env.PASSWORD;
  console.log('Email match:', emailMatch);
  console.log('Password match:', pwMatch);

  if (!emailMatch || !pwMatch) {
    console.log('=== LOGIN FAILED: Invalid credentials ===');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('Missing JWT_SECRET environment variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('Token generated successfully');

    const response = NextResponse.json({ success: true, message: 'Login successful' });
    response.cookies.set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/',
      sameSite: 'lax'
    });
    console.log('=== LOGIN SUCCESS ===');
    return response;
  } catch (jwtErr) {
    console.error('JWT error:', jwtErr);
    return NextResponse.json({ error: 'Token generation failed' }, { status: 500 });
  }
}
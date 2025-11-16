import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Committee from '@/models/Committee';

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

export async function GET() {
  try {
    await connectDB();
    const committees = await Committee.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ committees });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { wing, members } = await req.json();
    const committee = await new Committee({ wing, members }).save();
    return NextResponse.json({ success: true, committee });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create committee' }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, wing, members } = await req.json();
    const committee = await Committee.findByIdAndUpdate(
      id,
      { wing, members, updatedAt: new Date() },
      { new: true }
    );
    return NextResponse.json({ success: true, committee });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update committee' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await req.json();
    await Committee.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete committee' }, { status: 500 });
  }
}


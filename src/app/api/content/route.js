import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Content from '@/models/Content';
import Board from '@/models/Board';
import Organization from '@/models/Organization';
import Gallery from '@/models/Gallery';

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
  await connectDB();
  const content = await Content.findOne() || {};
  const board = await Board.find({}).lean();
  const organizations = await Organization.find({}).lean();
  const gallery = await Gallery.find({}).sort({ uploadedAt: -1 }).lean();
  return NextResponse.json({ content, board, organizations, gallery });
}

export async function POST(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { type, ...body } = await req.json();
    
    switch (type) {
      case 'board':
        if (body._id) {
          await Board.findByIdAndUpdate(body._id, body);
        } else {
          await new Board(body).save();
        }
        break;
      case 'organizations':
        if (body._id) {
          await Organization.findByIdAndUpdate(body._id, body);
        } else {
          await new Organization(body).save();
        }
        break;
      case 'gallery':
        await new Gallery(body).save();
        break;
      default:
        await Content.findOneAndUpdate({}, body, { upsert: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, type } = await req.json();
    
    switch (type) {
      case 'board':
        await Board.findByIdAndDelete(id);
        break;
      case 'organizations':
        await Organization.findByIdAndDelete(id);
        break;
      case 'gallery':
        await Gallery.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { type, ...body } = await req.json();
    
    if (type === 'content') {
      await Content.findOneAndUpdate({}, body, { upsert: true });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
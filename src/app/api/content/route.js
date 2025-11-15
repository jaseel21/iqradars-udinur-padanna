import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Content from '@/models/Content';
import Board from '@/models/Board';
import Organization from '@/models/Organization';
import Gallery from '@/models/Gallery';

export async function GET() {
  await connectDB();
  const content = await Content.findOne() || {};
  const board = await Board.find({}).lean();
  const organizations = await Organization.find({}).lean();
  const gallery = await Gallery.find({}).sort({ uploadedAt: -1 }).lean();
  return NextResponse.json({ content, board, organizations, gallery });
}

export async function POST(req) {
  await connectDB();
  const { type, ...body } = await req.json();
  switch (type) {
    case 'board':
      if (body._id) await Board.findByIdAndUpdate(body._id, body);
      else await new Board(body).save();
      break;
    case 'organization':
      if (body._id) await Organization.findByIdAndUpdate(body._id, body);
      else await new Organization(body).save();
      break;
    case 'gallery':
      const { file } = body;
      if (file) {
        const url = await uploadToSupabase(file); // From lib/supabase
        await new Gallery({ ...body, url }).save();
      }
      break;
    default:
      await Content.findOneAndUpdate({}, body, { upsert: true });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  await connectDB();
  const { id, type } = await req.json();
  switch (type) {
    case 'board': await Board.findByIdAndDelete(id); break;
    case 'organization': await Organization.findByIdAndDelete(id); break;
    case 'gallery': await Gallery.findByIdAndDelete(id); break;
  }
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  // For bulk updates, e.g., socials array
  await connectDB();
  const { type, ...body } = await req.json();
  if (type === 'content') {
    await Content.findOneAndUpdate({}, body, { upsert: true });
  }
  return NextResponse.json({ success: true });
}
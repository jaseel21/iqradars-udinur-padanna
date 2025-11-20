import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Article from '@/models/Article';

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

const buildSlug = (title) =>
  title
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 120);

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '0', 10);
  const type = searchParams.get('type');
  const language = searchParams.get('language');

  const query = {};
  if (type) query.type = type;
  if (language) query.language = language;

  const cursor = Article.find(query).sort({ createdAt: -1 });
  if (limit) cursor.limit(limit);

  const articles = await cursor.lean();
  return NextResponse.json({ articles });
}

export async function POST(request) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const payload = await request.json();
    const slug = payload.slug || buildSlug(payload.title || '');

    const article = await Article.create({
      ...payload,
      slug,
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Article POST error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const payload = await request.json();
    const { _id } = payload;
    if (!_id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    if (!payload.slug && payload.title) {
      payload.slug = buildSlug(payload.title);
    }

    const article = await Article.findByIdAndUpdate(_id, payload, { new: true });
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Article PUT error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    await Article.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Article DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}


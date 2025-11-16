import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import News from '@/models/News';

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

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const news = await News.findOne({ slug }).lean();
      return NextResponse.json({ news });
    }
    
    const news = await News.find({}).sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { title, content, thumbnail } = body;
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const news = await new News({
      title,
      content,
      thumbnail: thumbnail || '',
      slug,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    }).save();
    
    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('POST error:', error);
    // Return more detailed error message
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return NextResponse.json({ error: `Validation error: ${errors}` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create news' }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { id, title, content, thumbnail, publishedAt } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }
    
    const updateData = { 
      content: content || '', 
      thumbnail: thumbnail || '', 
      updatedAt: new Date() 
    };
    
    if (title) {
      updateData.title = title;
      // Regenerate slug if title changed
      updateData.slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    if (publishedAt) {
      updateData.publishedAt = new Date(publishedAt);
    }
    
    const news = await News.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('PUT error:', error);
    // Return more detailed error message
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return NextResponse.json({ error: `Validation error: ${errors}` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update news' }, { status: 500 });
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
    await News.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}


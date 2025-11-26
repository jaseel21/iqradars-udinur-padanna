import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Article from '@/models/Article';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
        }

        const article = await Article.findById(id).lean();

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ article });
    } catch (error) {
        console.error('Article GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}

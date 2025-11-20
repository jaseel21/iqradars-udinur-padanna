import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Article from '@/models/Article';
import AdminArticlesClient from './AdminArticlesClient';

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export default async function AdminArticlesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    redirect('/admin/login');
  }

  await connectDB();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();

  return <AdminArticlesClient initialArticles={JSON.parse(JSON.stringify(articles))} />;
}


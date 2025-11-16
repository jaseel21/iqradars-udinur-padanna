import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import Content from '@/models/Content';
import Organization from '@/models/Organization';
import Gallery from '@/models/Gallery';
import Banner from '@/models/Banner';
import News from '@/models/News';
import Video from '@/models/Video';
import Committee from '@/models/Committee';
import AdminContentClient from './AdminContentClient';

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export default async function AdminContentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch initial data server-side
  await connectDB();
  const content = await Content.findOne().lean() || {};
  const organizations = await Organization.find({}).lean();
  const gallery = await Gallery.find({}).sort({ uploadedAt: -1 }).lean();
  const banners = await Banner.find({}).sort({ order: 1 }).lean();
  const news = await News.find({}).sort({ publishedAt: -1 }).lean();
  const videos = await Video.find({}).sort({ order: 1, createdAt: -1 }).lean();
  const committees = await Committee.find({}).lean();

  // Ensure all data is properly serialized as plain objects
  const initialData = {
    content: {
      description: content?.description || '',
      mission: content?.mission || '',
      socials: content?.socials ? JSON.parse(JSON.stringify(content.socials)) : [],
      location: content?.location ? {
        address: content.location.address || '',
        mapEmbed: content.location.mapEmbed || '',
        lat: content.location.lat || null,
        lng: content.location.lng || null,
      } : { address: '', mapEmbed: '', lat: null, lng: null },
      phone: content?.phone || '',
      email: content?.email || '',
      hours: content?.hours || '',
    },
    organizations: organizations ? JSON.parse(JSON.stringify(organizations)) : [],
    gallery: gallery ? JSON.parse(JSON.stringify(gallery)) : [],
    banners: banners ? JSON.parse(JSON.stringify(banners)) : [],
    news: news ? JSON.parse(JSON.stringify(news)) : [],
    videos: videos ? JSON.parse(JSON.stringify(videos)) : [],
    committees: committees ? JSON.parse(JSON.stringify(committees)) : [],
  };

  return <AdminContentClient initialData={initialData} user={user} />;
}

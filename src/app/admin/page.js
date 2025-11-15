import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import AdminDashboardClient from '@/components/AdminDashboardClient'; // New client component below

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    redirect('/admin/login'); // Server redirect if invalid
  }

  return <AdminDashboardClient user={user} />; // Pass user to client for UI
}
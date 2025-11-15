'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboardClient({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-green-800">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user.email}!</p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/upload" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600">
          Upload Gallery Images
        </Link>
        <Link href="/admin/content" className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600">
          Edit Site Content
        </Link>
      </div>

      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </motion.div>
  );
}
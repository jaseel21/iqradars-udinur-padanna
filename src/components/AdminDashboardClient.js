'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, FileText, LogOut, Settings, Shield, Image as ImageIcon, Users, Building2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardClient({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/admin/login');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const dashboardCards = [
    {
      title: 'Upload Gallery Images',
      description: 'Upload and manage gallery images',
      href: '/admin/upload',
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Edit Site Content',
      description: 'Manage content, board members, organizations, and more',
      href: '/admin/content',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Manage Articles & Poems',
      description: 'Publish multilingual articles and poetry with ease',
      href: '/admin/articles',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
                  <Shield size={40} />
                  <span>Admin Dashboard</span>
                </h1>
                <p className="text-green-100 text-lg">
                  Welcome back, <span className="font-semibold">{user?.email || 'Admin'}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link href={card.href}>
                  <div className={`bg-gradient-to-br ${card.color} ${card.hoverColor} text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col`}>
                    <div className="mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Icon size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                      <p className="text-white/90 text-sm">{card.description}</p>
                    </div>
                    <div className="mt-auto pt-4 flex items-center text-white/80 hover:text-white transition-colors">
                      <span className="font-semibold">Go to {card.title}</span>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ImageIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gallery Images</p>
                  <p className="text-lg font-semibold text-gray-800">--</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Board Members</p>
                  <p className="text-lg font-semibold text-gray-800">--</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building2 className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Organizations</p>
                  <p className="text-lg font-semibold text-gray-800">--</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Settings className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Admin Information</h3>
              <p className="text-gray-600 mb-4">
                Manage your website content efficiently from this dashboard. All changes are saved automatically and will be reflected on the website immediately.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Upload and manage gallery images</li>
                <li>Edit site content, goals, and mission</li>
                <li>Manage board members and organizations</li>
                <li>Update social media links and location</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

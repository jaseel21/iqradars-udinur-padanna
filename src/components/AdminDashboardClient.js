'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, FileText, LogOut, Settings, Shield, Image as ImageIcon, Users, Building2, BookOpen, User, Calendar, TrendingUp } from 'lucide-react';
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
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      bgIcon: 'bg-blue-100/20'
    },
    {
      title: 'Edit Site Content',
      description: 'Manage content, board members, organizations, and more',
      href: '/admin/content',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      bgIcon: 'bg-green-100/20'
    },
    {
      title: 'Manage Articles & Poems',
      description: 'Publish multilingual articles and poetry with ease',
      href: '/admin/articles',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      bgIcon: 'bg-purple-100/20'
    },
  ];

  const statsData = [
    { label: 'Gallery Images', value: 124, icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Board Members', value: 12, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Organizations', value: 8, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white px-8 py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
                  <p className="text-indigo-100 text-sm opacity-90">
                    Welcome back, <span className="font-semibold capitalize">{user?.email?.split('@')[0] || 'Admin'}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
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
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={card.href}>
                  <div className={`relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:border-gray-200/70 transition-all duration-300 h-full flex flex-col overflow-hidden ${card.hoverColor}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgIcon} opacity-20 -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-700 blur-xl`} />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/30 transition-all duration-300">
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">{card.title}</h3>
                      <p className="text-gray-600 mb-auto flex-grow">{card.description}</p>
                      <div className="flex items-center mt-4 pt-4 border-t border-gray-100/50">
                        <span className="font-semibold text-gray-700 mr-auto">Manage</span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"
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
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={stat.color} size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 capitalize">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50"
        >
          <div className="flex items-start space-x-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-4 rounded-2xl flex-shrink-0">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Admin Quick Guide</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your website content efficiently from this centralized dashboard. All changes are saved automatically and will be reflected on the live site immediately.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <Upload size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Gallery Management</h4>
                      <p className="text-sm text-gray-600">Upload high-quality images and organize them into categories.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <Users size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Team & Organizations</h4>
                      <p className="text-sm text-gray-600">Update board members, add bios, and manage partner organizations.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                    <BookOpen size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Content Publishing</h4>
                      <p className="text-sm text-gray-600">Create and edit articles, poems, and site-wide content in multiple languages.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500">
                    <Calendar size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Recent Activity</h4>
                      <p className="text-sm text-gray-600">Track changes and view audit logs for all updates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
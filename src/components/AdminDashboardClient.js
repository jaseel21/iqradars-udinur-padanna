'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, LogOut, Settings, Shield, Image as ImageIcon, 
  Users, Building2, BookOpen, User, Calendar, TrendingUp,
  Activity, Clock, CheckCircle, AlertCircle, ArrowUpRight,
  BarChart3, Bell, Search, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardClient({ user }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      stats: '124 images',
      trend: '+12%'
    },
    {
      title: 'Edit Site Content',
      description: 'Manage content, board members, organizations, and more',
      href: '/admin/content',
      icon: FileText,
      gradient: 'from-emerald-500 via-green-600 to-teal-500',
      stats: '12 members',
      trend: '+5%'
    },
    {
      title: 'Manage Articles & Poems',
      description: 'Publish multilingual articles and poetry with ease',
      href: '/admin/articles',
      icon: BookOpen,
      gradient: 'from-purple-500 via-violet-600 to-indigo-500',
      stats: '45 articles',
      trend: '+18%'
    }
  ];

  const quickStats = [
    { 
      label: 'Gallery Images', 
      value: '124', 
      change: '+12.5%', 
      icon: ImageIcon, 
      color: 'blue',
      trend: 'up'
    },
    { 
      label: 'Board Members', 
      value: '12', 
      change: '+8.2%', 
      icon: Users, 
      color: 'emerald',
      trend: 'up'
    },
    { 
      label: 'Organizations', 
      value: '8', 
      change: '+3.1%', 
      icon: Building2, 
      color: 'purple',
      trend: 'up'
    },
    { 
      label: 'Articles', 
      value: '45', 
      change: '-0.3%', 
      icon: BookOpen, 
      color: 'orange',
      trend: 'down'
    }
  ];

  const recentActivity = [
    { action: 'New image uploaded to gallery', time: '2 minutes ago', type: 'upload' },
    { action: 'Site content updated', time: '15 minutes ago', type: 'edit' },
    { action: 'New article published', time: '1 hour ago', type: 'article' },
    { action: 'Board member added', time: '3 hours ago', type: 'member' }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'upload': return Upload;
      case 'edit': return FileText;
      case 'article': return BookOpen;
      case 'member': return Users;
      default: return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-indigo-500/10 to-pink-500/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-xs text-slate-400">{formatTime(currentTime)}</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Settings size={20} />
                </motion.button>

                <div className="w-px h-6 bg-white/10 mx-2" />

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white capitalize">
                      {user?.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 border border-red-500/20 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
              >
                <div className="px-4 py-4 space-y-3">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl text-white">
                    <Bell size={20} />
                    <span>Notifications</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl text-white">
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 rounded-xl text-red-400"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wIDRoLTJ2LTJoMnYyem0wIDRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            <div className="relative z-10">
              <h2 className="text-2xl font- text-white mb-2">
                Iqradars Admin Dashboard
              </h2>
              <p className="text-blue-100 text-lg">
                Here's what's happening with your platform today
              </p>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
         

          {/* Main Dashboard Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <Link href={card.href}>
                    <div className="relative h-full">
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                      
                      {/* Card Content */}
                      <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-blue-200 group-hover:to-purple-200 transition-all duration-300">
                          {card.title}
                        </h3>
                        <p className="text-slate-400 mb-6 flex-grow">
                          {card.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">

                          <div className="flex items-center space-x-1 text-emerald-400 text-sm font-medium">
                            <TrendingUp size={14} />
                            <span>{card.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity */}
         

          {/* Analytics Chart Placeholder */}
         
        </main>

        {/* Footer */}
        
      </div>
    </div>
  );
}
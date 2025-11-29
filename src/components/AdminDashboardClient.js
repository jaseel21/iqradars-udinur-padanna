'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, LogOut, Settings, Shield, Image as ImageIcon,
  Users, Building2, BookOpen, TrendingUp, ArrowUpRight,
  Bell, Search, Menu, X, ChevronRight, LayoutDashboard
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
      title: 'Gallery Management',
      description: 'Upload and organize gallery images',
      href: '/admin/upload',
      icon: ImageIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: '124 images',
      trend: '+12%'
    },
    {
      title: 'Content Management',
      description: 'Edit site content and personnel',
      href: '/admin/content',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      stats: '12 members',
      trend: '+5%'
    },
    {
      title: 'Articles & Poems',
      description: 'Publish and manage articles',
      href: '/admin/articles',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: '45 articles',
      trend: '+18%'
    }
  ];

  const quickStats = [
    {
      label: 'Total Images',
      value: '124',
      change: '+12.5%',
      icon: ImageIcon,
      trend: 'up'
    },
    {
      label: 'Board Members',
      value: '12',
      change: '+8.2%',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Organizations',
      value: '8',
      change: '+3.1%',
      icon: Building2,
      trend: 'up'
    },
    {
      label: 'Published Articles',
      value: '45',
      change: '-0.3%',
      icon: BookOpen,
      trend: 'down'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">Admin Portal</span>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-600">System Online</span>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium"
                >
                  <LogOut size={20} />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>

        {/* Quick Stats */}
       

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="group">
                <div className="h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="p-2 rounded-full hover:bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-colors">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {card.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
                    <LayoutDashboard size={14} />
                    <span>{card.stats}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
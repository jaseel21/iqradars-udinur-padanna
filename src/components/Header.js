'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Building2, Images, Mail, MapPin, Shield, Sun, Moon, LogOut, LayoutDashboard, ChevronDown, Upload, FileText, BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';

// Admin Navbar Component
function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

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

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Edit Content', icon: FileText },
    { href: '/admin/articles', label: 'Articles & Poems', icon: BookOpen },
    { href: '/admin/upload', label: 'Upload Gallery', icon: Upload },
  ];

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Shield className="text-gray-600" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
                <span className="text-xs text-gray-500">Management System</span>
              </div>
            </Link>

            {/* Desktop Admin Controls */}
            <div className="hidden lg:flex items-center space-x-6">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Theme Toggle */}
              <div className="w-px h-5 bg-gray-200"></div>
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-gray-600" />
                )}
              </motion.button>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-all font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </div>

            {/* Mobile Admin Controls */}
            <div className="lg:hidden flex items-center space-x-3">
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-gray-600" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle admin menu"
              >
                {isOpen ? (
                  <X size={20} className="text-gray-600" />
                ) : (
                  <Menu size={20} className="text-gray-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Admin Sidebar Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />

              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-base font-medium text-gray-900">Admin Menu</p>
                    <p className="text-sm text-gray-500">Quick links & actions</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                  {adminMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-4 px-4 py-3 rounded-lg font-medium transition-all text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon size={18} className="text-gray-600" />
                        </div>
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 px-6 py-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname() || '/';
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isAdminPage = pathname?.startsWith('/admin') && !pathname?.includes('/login');

  // If on admin page, render admin navbar
  if (isAdminPage) {
    return <AdminNavbar />;
  }

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/articles', label: 'Articles', icon: BookOpen },
    { href: '/organizations', label: 'Organizations', icon: Building2 },
    { href: '/gallery', label: 'Gallery', icon: Images },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/location', label: 'Location', icon: MapPin },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' 
          : 'bg-white border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Enhanced Design */}
            <motion.a
              href="/"
              className="flex items-center space-x-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                  Iqra Dars Udinur
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">Islamic Education Center</span>
              </div>
            </motion.a>

            {/* Desktop Menu - Enhanced */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 group ${
                      isActive
                        ? 'text-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-emerald-50 rounded-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon size={16} className={`relative z-10 ${isActive ? 'text-emerald-600' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="relative z-10">{item.label}</span>
                    {!isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></div>
                    )}
                  </motion.a>
                );
              })}
              
              {/* Theme Toggle - Enhanced */}
              <div className="ml-4 flex items-center space-x-2">
                <div className="w-px h-5 bg-gray-200"></div>
                <motion.button
                  onClick={toggleTheme}
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle theme"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    {theme === 'dark' ? (
                      <Sun size={18} className="text-amber-500" />
                    ) : (
                      <Moon size={18} className="text-gray-600" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-3">
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-gray-600" />}
              </motion.button>
              
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} className="text-gray-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} className="text-gray-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-40"
                onClick={() => setIsOpen(false)}
              />

              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-base font-medium text-gray-900">Navigation</p>
                    <p className="text-sm text-gray-500">Explore key sections</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center space-x-4 px-4 py-3 rounded-lg font-medium transition-all ${
                          isActive
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-600'} />
                        </div>
                        <span className="flex-1">{item.label}</span>
                      </motion.a>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Theme</p>
                    <p className="text-xs text-gray-500">Light / Dark</p>
                  </div>
                  <motion.button
                    onClick={toggleTheme}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun size={18} className="text-amber-500" />
                    ) : (
                      <Moon size={18} className="text-gray-600" />
                    )}
                  </motion.button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16"></div>
    </>
  );
}
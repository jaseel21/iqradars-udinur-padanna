'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent
} from 'framer-motion';
import {
  Menu, X, Shield, LayoutDashboard,
  Upload, FileText, BookOpen, Phone, Facebook, Twitter, MessageCircleCode, Instagram,
  // WhatsApp,  // <-- Remove or comment this out
  MessageCircle,  // <-- Add this as a placeholder (available in Lucide)
  ChevronRight, MapPin, Mail, LogOut, GraduationCap
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons
import toast from 'react-hot-toast';

// --- PREMIUM CUSTOM FONT CSS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  .premium-shadow {
    box-shadow: 
      0 20px 60px rgba(15, 23, 42, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-shadow-hover {
    box-shadow: 
      0 30px 80px rgba(16, 185, 129, 0.15),
      0 0 0 1px rgba(16, 185, 129, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
`;

// --- 1. PREMIUM TOP UTILITY BAR ---
const TopBar = () => (
  <div className="hidden lg:flex justify-between items-center bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-slate-200 py-3 px-6 lg:px-12 text-[11px] font-semibold tracking-[0.2em] uppercase z-50 relative border-b border-slate-800/60">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
        <Mail size={11} className="text-emerald-400" />
        <span className="text-slate-200 group-hover:text-white transition-colors">iqradars786@gmail.com</span>
      </div>
      <div className="w-px h-4 bg-white/10"></div>
      <div className="flex items-center gap-2 text-emerald-300">
        <Phone size={11} />
        <span className="text-[10px] tracking-[0.3em] text-slate-400">+91 9656480068</span>
      </div>
    </div>
    <div className="flex items-center gap-5">
      <span className="text-[10px] tracking-[0.4em] text-slate-400">Connect</span>
      <div className="flex gap-3">
        <a
          href="https://www.instagram.com/iqra_dars_udinur"
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-110 transition-all duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram size={13} />
        </a>
        <a
          href="https://whatsapp.com/channel/0029Vahzgjj545usYhW1vK37"
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-green-400 hover:bg-green-500/20 hover:scale-110 transition-all duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={13} style={{ color: '#25D366' }} />
        </a>
      </div>
    </div>
  </div>
);

// --- 2. PREMIUM ADMIN NAVBAR ---
function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/articles', label: 'Articles', icon: BookOpen },
    { href: '/admin/upload', label: 'Media', icon: Upload },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative  p-2.5 rounded-lg shadow-lg">
                <img src='/icon.png' className='h-16 w-16'></img>
              </div>
            </div>
            <div>
              <span className="block font-bold text-sm tracking-wide uppercase">Admin Panel</span>
              <span className="block text-[10px] text-emerald-400 font-mono">v2.0 Secure</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="h-5 w-px bg-slate-700 mx-3" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/30"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium uppercase tracking-wide">{item.label}</span>
                </Link>
              ))}
              <div className="h-px bg-slate-800 my-2" />
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-bold uppercase tracking-wide">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- 3. MAIN HEADER (Public) ---
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname() || '/';

  // Detect scroll for glass effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 20;
    if (scrolled !== isScrolled) setIsScrolled(scrolled);
  });

  const isAdminPage = pathname?.startsWith('/admin') && !pathname?.includes('/login');
  if (isAdminPage) return <AdminNavbar />;

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Academy' },
    { href: '/organizations', label: 'Organization' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style jsx global>{customStyles}</style>
      <TopBar />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className={`fixed w-full top-0 lg:top-auto z-40 transition-all duration-500 ease-in-out font-sans ${isScrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-xl shadow-slate-900/5 py-3 lg:py-3 border-b border-slate-200/60'
            : 'bg-white/80 backdrop-blur-md py-5 lg:py-6 border-b border-transparent'
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">

            {/* --- PREMIUM BRAND LOGO --- */}
            <Link href="/" className="flex items-center gap-4 group z-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 shadow-lg group-hover:shadow-xl group-hover:border-emerald-200 group-hover:scale-105 transition-all duration-300 premium-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="Logo" className="w-9 h-9 object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight group-hover:text-emerald-700 transition-colors">
                  Iqra Dars
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="h-0.5 w-5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Udinur & Padanna
                  </span>
                </div>
              </div>
            </Link>

            {/* --- PREMIUM DESKTOP NAV --- */}
            <nav className="hidden lg:flex items-center gap-2  rounded-full bg-slate-50/80 backdrop-blur-sm px-2 py-1.5 border border-slate-200/60 premium-shadow">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-6 py-2.5 group overflow-hidden rounded-full transition-all duration-300"
                  >
                    <span className={`relative z-10 text-[13px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-700'
                      }`}>
                      {item.label}
                    </span>
                    {/* Premium Hover Background Pill */}
                    <span className={`absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full transform origin-center transition-transform duration-300 ease-out ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                      }`} />
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* --- PREMIUM DESKTOP CTA --- */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/location" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  <MapPin size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Locate Us</span>
                </motion.button>
              </Link>
            </div>


            {/* --- PREMIUM MOBILE HAMBURGER --- */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-3 text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <Menu size={24} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE SIDEBAR (Right Drawer) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />

            {/* Premium Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-[380px] bg-gradient-to-b from-white via-white to-slate-50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Premium Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200/50 rounded-xl blur-md opacity-0 group-hover:opacity-100"></div>
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icon.png" alt="Logo" className="w-7 h-7 object-contain" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">Iqra Dars</span>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 bg-white border-2 border-slate-200 rounded-full text-slate-500 hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all shadow-sm"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Premium Sidebar Links */}
              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-3">
                {menuItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center justify-between  p-5 rounded-2xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-2 border-emerald-200 shadow-lg shadow-emerald-100'
                            : 'text-slate-700 hover:bg-white hover:text-slate-900 border-2 border-slate-100 hover:border-slate-200 hover:shadow-md'
                          }`}
                      >
                        <span className=" text-am">{item.label}</span>
                        <div className={`p- rounded-full transition-all ${isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-600'}`}>
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Premium Sidebar Footer */}
              <div className="p-6 border-t-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                <Link href="/location" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/60 border border-gray-200 hover:border-gray-300 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <MapPin size={18} className="relative z-10 text-emerald-600 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Visit Dars</span>
                  </motion.button>
                </Link>

                <div className="mt-8 flex justify-center gap-6">
                  <motion.a
                    href="https://www.instagram.com/iqra_dars_udinur"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-500 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={20} />
                  </motion.a>
                  <motion.a
                    href="https://whatsapp.com/channel/0029Vahzgjj545usYhW1vK37"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-green-500 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={20} style={{ color: '#25D366' }} />
                  </motion.a>
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-semibold">© 2024 Iqra Dars</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Layout Spacer (Prevents content jumping when header becomes fixed) */}
      <div className="h-[110px] lg:h-[130px]" />
    </>
  );
}
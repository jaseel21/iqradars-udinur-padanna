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
  Upload, FileText, BookOpen, Phone, Facebook, Twitter, Instagram, 
  // WhatsApp,  // <-- Remove or comment this out
  MessageCircle,  // <-- Add this as a placeholder (available in Lucide)
  ChevronRight, MapPin, Mail, LogOut, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- CUSTOM FONT CSS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }
`;

// --- 1. TOP UTILITY BAR (The "Eyebrow") ---
const TopBar = () => (
  <div className="hidden lg:flex justify-between items-center bg-[#0F172A] text-slate-300 py-2.5 px-6 lg:px-12 text-[10px] font-bold tracking-[0.15em] uppercase z-50 relative border-b border-slate-800">
    <div className="flex items-center gap-6">
      {/* <div className="flex items-center gap-2 group cursor-pointer">
        <span className="bg-emerald-500/10 p-1 rounded text-emerald-500 group-hover:text-emerald-400 transition-colors">
           <Phone size={10} />
        </span>
        <span className="group-hover:text-white transition-colors">+91 9656480068</span>
      </div> */}
      <div className="w-px h-3 bg-slate-700"></div>
      <div className="flex items-center gap-2 group cursor-pointer">
        <span className="bg-emerald-500/10 p-1 rounded text-emerald-500 group-hover:text-emerald-400 transition-colors">
           <Mail size={10} />
        </span>
        <span className="group-hover:text-white transition-colors">iqradars786@gmail.com</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-slate-500">Follow Us:</span>
     <div className="flex gap-3">
  <a href="https://www.instagram.com/iqra_dars_udinurs" className="hover:text-white hover:scale-110 transition-all duration-300">
    <Instagram size={12} />
  </a>
  <a href="https://wa.me/9656480068" className="hover:text-white hover:scale-110 transition-all duration-300">
    <MessageCircle size={12} />  {/* Placeholder for WhatsApp */}
  </a>
</div>
    </div>
  </div>
);

// --- 2. ADMIN NAVBAR (Distinct & Functional) ---
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
    <nav className="fixed w-full top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-2xl">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/50">
              <Shield className="text-white" size={18} />
            </div>
            <div>
              <span className="block font-bold text-sm tracking-wide uppercase">Admin Panel</span>
              <span className="block text-[10px] text-slate-400 font-mono">v2.0 Secure</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="h-5 w-px bg-slate-700 mx-3" />
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-400 hover:text-white"><Menu size={24} /></button>
        </div>
      </div>
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
        className={`fixed w-full top-0 lg:top-auto z-40 transition-all duration-500 ease-in-out font-sans ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/40 py-3 lg:py-3 border-b border-slate-200/50' 
            : 'bg-white py-5 lg:py-6 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            
            {/* --- BRAND LOGO --- */}
            <Link href="/" className="flex items-center gap-4 group z-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-emerald-100 transition-all duration-300">
                 {/* Using img tag for direct file reference as requested */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-sans font-bold text-slate-900 leading-none tracking-tight group-hover:text-emerald-800 transition-colors">
                  Iqra Dars
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-px w-4 bg-emerald-500"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Udinur & Padanna 
                  </span>
                </div>
              </div>
            </Link>

            {/* --- DESKTOP NAV --- */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="relative px-5 py-2.5 group overflow-hidden rounded-full"
                  >
                    <span className={`relative z-10 text-[13px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-700'
                    }`}>
                      {item.label}
                    </span>
                    {/* Hover Background Pill */}
                    <span className={`absolute inset-0 bg-emerald-50 rounded-full transform origin-center transition-transform duration-300 ease-out ${
                      isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* --- DESKTOP CTA --- */}
            <div className="hidden lg:flex items-center gap-4">
  <Link href="/location" className="focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent">
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        borderColor: "rgba(16,185,129,1)",
        boxShadow: "0 0 0 1px rgba(16,185,129,1), 0 0 0 4px rgba(16,185,129,0.1), 0 8px 32px rgba(16,185,129,0.15)" 
      }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ scale: 1.02 }}
      className="
        flex items-center gap-2.5
        backdrop-blur-sm
        bg-transparent
        text-emerald-800 hover:text-emerald-600
        px-4 py-2
        rounded-xl
        text-sm font-semibold uppercase tracking-wide
        border-1 border-emerald-500/60 hover:border-emerald-400/80
        shadow-md shadow-emerald-500/10
        hover:shadow-lg hover:shadow-emerald-500/20
        transition-all duration-300 ease-out
        group
        relative
        after:absolute after:inset-0 after:rounded-xl after:border after:border-emerald-500/20 after:pointer-events-none
        after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
      "
    >
      <motion.div
        className="flex h-4 w-4 items-center justify-center"
        animate={{ 
          scale: [1, 1.05, 1] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <MapPin 
          size={16} 
          className="text-emerald-800 group-hover:text-emerald-300 transition-colors duration-300 drop-shadow-sm" 
        />
      </motion.div>
      <span className="tracking-[0.05em] leading-none relative z-10">
        Locate Us
      </span>
    </motion.button>
  </Link>
</div>


            {/* --- MOBILE HAMBURGER --- */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu size={26} strokeWidth={2} />
            </button>
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
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-[360px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="/icon.png" alt="Logo" className="w-8 h-8" />
                   <span className="font-serif font-bold text-slate-900">Iqra Dars</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Links (Staggered) */}
              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
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
                        className={`group flex items-center justify-between p-4 rounded-xl transition-all ${
                          isActive 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <span className="font-bold text-lg">{item.label}</span>
                        <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                           <ChevronRight size={16} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <Link href="/location" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 
           
             text-green-700 rounded-xl font-bold uppercase tracking-widest text-sm 
             shadow-lg shadow-emerald-700/30 
             transition-all duration-300"
>
  <MapPin size={18} className="text-emarald-900" />
  <span>VISIT DARS </span>
</motion.button>
                </Link>
                
                <div className="mt-8 flex justify-center gap-8">
                  {[Facebook, Twitter, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="text-slate-400 hover:text-emerald-600 hover:scale-110 transition-all">
                      <Icon size={22} />
                    </a>
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-semibold">© 2024 Iqra Dars</p>
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
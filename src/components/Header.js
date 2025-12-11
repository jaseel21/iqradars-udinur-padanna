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
  Upload, FileText, Phone, Facebook, Twitter, MessageCircleCode, Instagram,
  ChevronRight, MapPin, LogOut, GraduationCap,
  // Imported icons for the new sidebar/bottom bar (matching the image visually)
  Home, BookOpen , Users , Images , Mail
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

// --- PREMIUM CUSTOM FONT CSS --- (Kept for completeness)
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  /* ... other custom styles (premium-shadow, glass-panel) ... */
`;

// --- Navigation Items (Mapped to icons visually matching the image) ---
const navItems = [
    // Original links mapped to visually similar icons
    { href: '/', label: 'Home', icon: Home, activeIconBg: 'bg-amber-800' }, // Home icon
    { href: '/articles', label: 'Writings', icon: BookOpen }, // Trophy icon (or BookOpen)
    { href: '/organizations', label: 'Structure', icon: Users }, // BarChart icon (or LayoutDashboard)
    { href: '/gallery', label: 'Gallery', icon: Images }, // Search icon (or Images/Camera)
    { href: '/contact', label: 'Contact', icon: Mail }, // ShoppingBag icon (or Phone/Mail)
];

// --- 1. PREMIUM TOP UTILITY BAR --- (Kept as is)


// --- 2. PREMIUM ADMIN NAVBAR --- (Kept as is)
function AdminNavbar() {
    // ... AdminNavbar component code ...
}


// --- NEW: FLOATING LEFT SIDEBAR (Desktop) ---
const FloatingSidebar = ({ items }) => {
    const pathname = usePathname();

    return (
        <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <div className="w-16 p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-2xl border border-slate-100/70">
                <div className="space-y-4">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`
                                    w-12 h-12 p-3 flex items-center justify-center 
                                    rounded-lg transition-all duration-300 cursor-pointer
                                    ${isActive
                                        ? `bg-amber-800 shadow-md shadow-amber-800/40 text-white`
                                        : 'text-stone-700 hover:bg-slate-100 hover:text-amber-800'
                                    }
                                `}>
                                    <item.icon size={20} strokeWidth={2.5} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

// --- NEW: FIXED BOTTOM BAR (Mobile) ---
const MobileBottomBar = ({ items }) => {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden py-4 px-8">
            <div className="max-w-xl mx-auto flex justify-around items-center h-16 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-slate-900/10 border border-slate-200/60">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex-1  flex justify-center">
                            <div className={`
                                w-12 h-12 p-2 flex flex-col items-center justify-center 
                                rounded-lg transition-all duration-300 group
                                ${isActive
                                    ? 'bg-amber-600 shadow-md shadow-amber-800/40 text-white'
                                    : 'text-stone-700 hover:bg-slate-100 hover:text-amber-800'
                                }
                            `}>
                                <item.icon size={20} strokeWidth={2.5} />
                                {/* Optional: Add text label for clarity */}
                                {/* <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-white' : 'text-stone-600'}`}>{item.label}</span> */}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};


// --- 3. MAIN HEADER (Public) ---
export default function Header() {
    // Note: Mobile menu state and logic are removed since we now use a bottom bar
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname() || '/';

    // Detect scroll for header shadow/effect
    useMotionValueEvent(scrollY, "change", (latest) => {
        const scrolled = latest > 20;
        if (scrolled !== isScrolled) setIsScrolled(scrolled);
    });

    const isAdminPage = pathname?.startsWith('/admin') && !pathname?.includes('/login');
    if (isAdminPage) return <AdminNavbar />;

    return (
        <>
            <style jsx global>{customStyles}</style>
         

            {/* --- NEW: FLOATING SIDEBAR (Desktop) --- */}
            <FloatingSidebar items={navItems} />

            {/* --- NEW: FIXED BOTTOM BAR (Mobile) --- */}
            <MobileBottomBar items={navItems} />


           

         
        </>
    );
}
'use client';

import Link from 'next/link';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Mail, Phone, MapPin, ArrowRight 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0a09] border-t border-stone-900 pt-16 pb-8 font-sans text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MAIN GRID CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* 1. BRAND COLUMN (Span 4) */}
          <div className="md:col-span-5 flex flex-col items-start gap-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-4">
                {/* Logo Box */}
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center border border-stone-800 group-hover:border-amber-500/50 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="Logo" className='w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity' />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-serif tracking-wide">Iqra Dars</h3>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Udinur & Padanna</p>
                </div>
              </div>
            </Link>
            
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Integrating Islamic heritage with modern academic excellence. Fostering knowledge in Kerala since 2010.
            </p>

            {/* Clean CTA Button */}
            <Link href="/contact">
                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900 text-white border border-stone-800 hover:border-amber-500 hover:text-amber-400 transition-all text-xs font-bold uppercase tracking-wider">
                    Contact Administration <ArrowRight size={14} />
                </button>
            </Link>
          </div>

          {/* 2. NAVIGATION LINKS (Span 3) */}
          <div className="md:col-span-3">
             <h4 className="text-white font-bold mb-6 text-sm font-serif">Explore</h4>
             <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-amber-500 transition-colors">Our History</Link></li>
                <li><Link href="/gallery" className="hover:text-amber-500 transition-colors">Campus Gallery</Link></li>
                <li><Link href="/articles" className="hover:text-amber-500 transition-colors">Scholarly Articles</Link></li>
                <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Admissions</Link></li>
             </ul>
          </div>

          {/* 3. CONTACT CONDENSED (Span 4) */}
          <div className="md:col-span-4">
             <h4 className="text-white font-bold mb-6 text-sm font-serif">Get in Touch</h4>
             <ul className="space-y-4 text-sm">
                {/* Email */}
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-amber-600 mt-1 shrink-0" />
                  <a href="mailto:iqradars786@gmail.com" className="hover:text-white transition-colors">iqradars786@gmail.com</a>
                </li>
                
                {/* Phones (Combined) */}
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-amber-600 mt-1 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+919656480068" className="hover:text-white transition-colors">+91 9656480068 <span className="text-stone-600 text-xs ml-1">(Admissions)</span></a>
                    <a href="tel:+918714403503" className="hover:text-white transition-colors">+91 8714403503 <span className="text-stone-600 text-xs ml-1">(Office)</span></a>
                  </div>
                </li>

                {/* Locations (Simplified) */}
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-amber-600 mt-1 shrink-0" />
                  <span className="leading-relaxed">
                    Campuses located in <span className="text-stone-300">Udinur</span> & <span className="text-stone-300">Padanna</span>,<br /> Kasaragod, Kerala.
                  </span>
                </li>
             </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <div className="text-xs text-stone-600 font-medium text-center md:text-left">
             <p>&copy; {currentYear} Iqra Dars. All Rights Reserved.</p>
             <div className="mt-2 space-x-4">
               <Link href="/privacy" className="hover:text-stone-400">Privacy Policy</Link>
               <Link href="/terms" className="hover:text-stone-400">Terms of Use</Link>
             </div>
          </div>

          {/* Minimal Social Icons */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-stone-600 hover:text-amber-500 transition-colors">
                    <Icon size={18} />
                </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
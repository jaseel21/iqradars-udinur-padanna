'use client';

import { motion } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Mail, MapPin, Phone, ArrowRight, Send, 
  ShieldCheck, Heart, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // Make sure to use this if you have a real logo

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    academics: [
      { href: '/articles', label: 'Library & Articles' },
      { href: '/courses', label: 'Academic Programs' },
      { href: '/gallery', label: 'Student Gallery' },
      { href: '/admissions', label: 'Admission Policy' },
    ],
    institution: [
      { href: '/about', label: 'About Us' },
      { href: '/organizations', label: 'Organizations' },
      { href: '/board', label: 'Advisory Board' },
      { href: '/careers', label: 'Careers' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Use' },
      { href: '/sitemap', label: 'Sitemap' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-12 font-sans relative overflow-hidden text-slate-600">
      
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 mb-16">
          
          {/* 1. BRAND & NEWSLETTER (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Brand Logo */}
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:bg-emerald-700 transition-colors">
                  {/* SVG Logo Placeholder */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-none">Iqra Dars</h3>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Udinur & Padne</span>
                </div>
              </div>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              An institution dedicated to preserving Islamic heritage while fostering academic excellence. Join our community of knowledge seekers.
            </p>

            {/* Newsletter Box */}
            <div className="p-1">
               <h4 className="text-sm font-bold text-slate-900 mb-3">Subscribe to updates</h4>
               <form className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder="Email address" 
                   className="flex-1 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                 />
                 <button className="bg-slate-900 hover:bg-emerald-600 text-white p-2.5 rounded-lg transition-colors shadow-md">
                   <ArrowRight size={18} />
                 </button>
               </form>
               <p className="text-[10px] text-slate-400 mt-2">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>

          {/* 2. LINKS COLUMNS (2 cols each) */}
          <div className="lg:col-span-2 md:col-span-4">
             <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wide">Academics</h4>
             <ul className="space-y-3">
                {footerLinks.academics.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-700 hover:translate-x-1 transition-all inline-flex items-center gap-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          <div className="lg:col-span-2 md:col-span-4">
             <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wide">Institution</h4>
             <ul className="space-y-3">
                {footerLinks.institution.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-700 hover:translate-x-1 transition-all inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* 3. CONTACT INFO (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div>
               <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wide">Contact Us</h4>
               <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5">
                       <MapPin size={16} />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Iqra Dars Campus,<br />
                      Udinur, Kasaragod District,<br />
                      Kerala, India - 671310
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                       <Phone size={16} />
                    </div>
                    <a href="tel:+919876543210" className="text-sm text-slate-600 hover:text-emerald-700 font-medium">+91 987 654 3210</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                       <Mail size={16} />
                    </div>
                    <a href="mailto:info@iqradars.edu" className="text-sm text-slate-600 hover:text-emerald-700 font-medium">info@iqradars.edu</a>
                  </li>
               </ul>
            </div>
            
            <div>
               <h4 className="text-slate-900 font-bold mb-4 text-xs uppercase tracking-wide">Follow Us</h4>
               <div className="flex gap-3">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Separator & Copyright */}
        <div className="border-t border-slate-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
             <p className="text-xs text-slate-400 font-medium text-center md:text-left">
               &copy; {currentYear} Iqra Dars Udinur.
             </p>
             <div className="flex gap-4">
               {footerLinks.legal.map((link, i) => (
                 <Link key={i} href={link.href} className="text-xs text-slate-400 hover:text-emerald-700 transition-colors">
                   {link.label}
                 </Link>
               ))}
             </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
             <ShieldCheck size={12} className="text-emerald-600" />
             <span>Registered Educational Institution</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
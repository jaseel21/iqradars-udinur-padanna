'use client';

import { motion } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Mail, MapPin, Phone, ArrowRight, Send, 
  ShieldCheck, ExternalLink, MessageSquare 
} from 'lucide-react';
import Link from 'next/link';
// Assuming the logo is handled by the `img src="/icon.png"` as in your code

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // --- UPDATED CONTACT INFO with two locations and two phone numbers ---
  const contactInfo = {
    email: 'iqradars786@gmail.com',
    phones: [
        { label: 'Admissions', number: '+91 9656480068' },
        { label: 'Administration', number: '+91 8714403503' },
    ],
    locations: [
        { 
            name: 'Udinur Dars', 
            address: 'Udinur Education Street, Udinur, Kasaragod, Kerala, India',
            mapUrl: "https://www.google.com/maps/place/Udinur+Juma+Masjid/@12.1535692,75.1699812,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba46e2faaaaaaab:0x34c5c716b6b6e9d!8m2!3d12.1535692!4d75.1699812!16s%2Fg%2F11b7h9y1zm?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
        },
        { 
            name: 'Padanna Dars', 
            address: 'Padanna Valiya Juma Masjid Road, Padanna, Kasaragod, Kerala, India',
            mapUrl: "https://www.google.com/maps/place/Padanna+%E2%88%99+Valiya+juma+masjid/@12.1763519,75.1463666,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4712baa5a024f:0xf28f87750da0ae5e!8m2!3d12.1763519!4d75.1463666!16s%2Fg%2F11hdf8t3mj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
        },
    ]
  };
  
  // --- ADDED WHATSAPP ICON ---
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
    // Using the first phone number for the WhatsApp link
    { icon: MessageSquare, href: `https://wa.me/${contactInfo.phones[0].number.replace(/[^0-9]/g, '')}`, label: 'WhatsApp' },
  ];

  const legalLinks = [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Use' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 font-sans relative overflow-hidden text-slate-400">
      
      {/* Subtle Top Border Highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-slate-900 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* TOP SECTION: Grid Layout for Contact/Follow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 xl:gap-16 mb-16 border-b border-slate-800 pb-12">
          
          {/* 1. BRANDING & MISSION (2 cols on large screen) */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                {/* Logo Area */}
                <div className="w-16 h-16  rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/50 group-hover:bg-emerald-700 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="Iqra Dars Logo" className='w-12 h-12 object-contain' />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">Iqra Dars</h3>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em]">Udinur & Padanna </span>
                </div>
              </div>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Dedicated to integrating Islamic heritage with modern academic excellence, fostering a community of enlightened knowledge seekers in Kerala.
            </p>
            
            {/* Admissions CTA (clean and direct) */}
            <div className='pt-4'>
                <Link href="/contact">
                    <button className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white bg-emerald-600 px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/50'>
                        <Send size={16} />
                        Enquire Now
                    </button>
                </Link>
            </div>
          </div>

          {/* 2. CONTACT INFORMATION (Structurally Refined - 1 col) */}
          <div className="lg:col-span-1 space-y-4">
             <h4 className="text-emerald-400 font-bold mb-6 text-sm uppercase tracking-wider">Contact Information</h4>
             
             <ul className="space-y-4">
                {/* Email */}
                <li className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
                     <Mail size={16} />
                  </div>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-slate-400 hover:text-white font-medium transition-colors">{contactInfo.email}</a>
                </li>
             
                {/* Phone Numbers */}
                <h5 className="text-xs font-bold text-slate-500 pt-1 mb-2 uppercase tracking-wider">Contact Numbers</h5>
                {contactInfo.phones.map((p, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500">
                         <Phone size={16} />
                      </div>
                      <div className='flex flex-col'>
                        <a href={`tel:${p.number}`} className="text-sm text-slate-400 hover:text-white font-medium transition-colors">{p.number}</a>
                        <span className='text-[10px] text-slate-500 uppercase tracking-widest'>{p.label}</span>
                      </div>
                    </li>
                ))}
                
                {/* Locations */}
                <h5 className="text-xs font-bold text-slate-500 pt-4 mb-2 uppercase tracking-wider border-t border-slate-800">Our Campuses</h5>
                {contactInfo.locations.map((loc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-emerald-500 mt-0.5">
                         <MapPin size={16} />
                      </div>
                      <span className="text-sm text-slate-400 leading-relaxed hover:text-white transition-colors">
                        <span className='font-medium text-white'>{loc.name}</span><br/>
                        <span className='text-xs text-slate-500'>{loc.address}</span>
                        <Link href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className='block text-xs text-emerald-500 hover:text-emerald-400 mt-1'>
                            View Map <ExternalLink size={10} className='inline ml-1'/>
                        </Link>
                      </span>
                    </li>
                ))}
             </ul>
          </div>

          {/* 3. FOLLOW US (1 col) */}
          <div className="lg:col-span-1">
             <h4 className="text-emerald-400 font-bold mb-6 text-sm uppercase tracking-wider">Connect With Us</h4>
             <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target={social.label === 'WhatsApp' ? '_blank' : '_self'}
                    rel={social.label === 'WhatsApp' ? 'noopener noreferrer' : ''}
                    className={`w-10 h-10 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-lg ${social.label === 'WhatsApp' ? 'hover:bg-green-600 hover:text-white hover:border-green-600' : 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600'}`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Legal */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
             <p className="text-xs text-slate-500 font-medium text-center md:text-left">
               &copy; {currentYear} Iqra Dars Udinur. All Rights Reserved.
             </p>
             <div className="flex gap-4">
               {legalLinks.map((link, i) => (
                 <Link key={i} href={link.href} className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                   {link.label}
                 </Link>
               ))}
             </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full shadow-md">
             <ShieldCheck size={12} className="text-emerald-500" />
             <span>Registered Islamic Educational Institution</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
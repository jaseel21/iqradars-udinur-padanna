'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter,
  Linkedin, ArrowRight, Globe, CheckCircle2, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

// --- CUSTOM FONT CONFIGURATION ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
 
  :root {
    --font-stack: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
 
  .font-stack {
    font-family: var(--font-stack);
  }
 
  /* Subtle grid pattern for background */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
  }
`;

// --- HARDCODED DEFAULT DATA (To be overwritten by fetchContent) ---
const DEFAULT_CONTENT = {
    phones: [
        { label: 'Admissions', number: '+91 9656480068' },
        { label: 'Administration', number: '+91 8714403503' },
    ],
    email: 'info@iqradars.edu',
    locations: [
        {
            name: 'Udinur Dars Campus',
            address: 'Udinur Education Street, Udinur, Kasaragod, Kerala, India',
            mapUrl: "https://www.google.com/maps/place/Udinur+Juma+Masjid/@12.1535692,75.1699812,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba46e2faaaaaaab:0x34c5c716b6b6e9d!8m2!3d12.1535692!4d75.1699812!16s%2Fg%2F11b7h9y1zm?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
        },
        {
            name: 'Padanna Campus',
            address: 'Padanna Valiya Juma Masjid Road, Padanna, Kasaragod, Kerala, India',
            mapUrl: "https://www.google.com/maps/place/Padanna+%E2%88%99+Valiya+juma+masjid/@12.1763519,75.1463666,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4712baa5a024f:0xf28f87750da0ae5e!8m2!3d12.1763519!4d75.1463666!16s%2Fg%2F11hdf8t3mj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
        },
    ],
    socials: [
        { name: 'Facebook', url: '#', icon: Facebook },
        { name: 'Instagram', url: '#', icon: Instagram },
        { name: 'Twitter', url: '#', icon: Twitter },
        { name: 'Linkedin', url: '#', icon: Linkedin },
    ],
};

// ------------------------------------------------------------------
// --- NEW Location Card Component ---
const LocationCard = ({ location }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100/50 overflow-hidden h-full relative"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <MapPin className="text-white" size={20} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{location.name}</h3>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Campus Location</p>
            </div>
        </div>
       
        <p className="text-base text-slate-700 leading-relaxed mb-6 flex-grow relative">
            {location.address}
        </p>
        <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-600/30 transition-all duration-300 relative z-10"
        >
            <Navigation size={18} />
            Get Directions
        </a>
    </motion.div>
);

// ------------------------------------------------------------------
export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [content, setContent] = useState(DEFAULT_CONTENT); // Initialize with default data
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        // Merge fetched data with defaults, prioritizing fetched
        setContent(prev => ({ ...prev, ...data.content }));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
     
      // NOTE: The recipient email (iqradars786@gmail.com) MUST be set
      // in your Next.js API route file at /api/contact/route.js or similar.
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
     
      if (res.ok) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const socials = content.socials || DEFAULT_CONTENT.socials;
  const phones = content.phones || DEFAULT_CONTENT.phones;
  const locations = content.locations || DEFAULT_CONTENT.locations;
  const email = content.email || DEFAULT_CONTENT.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 font-stack text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{customStyles}</style>
     
      {/* 1. HEADER SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-bold uppercase tracking-widest mb-8 shadow-lg"
           >
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Get in Touch
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight"
           >
             Contact Our Admissions Team
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
           >
             We are here to answer your questions about enrollment, academics, and campus life. Reach out today.
           </motion.p>
        </div>
      </section>

      {/* 2. MAIN CONTENT CARD (Contact Info & Form) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100/50 flex flex-col lg:flex-row relative"
        >
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent"></div>
         
          {/* LEFT COLUMN: INFO (Dark / Professional) */}
          <div className="relative lg:w-[35%] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
            <div className="relative">
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-4"
              >
                Reach Us Directly
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-slate-300 text-sm mb-10 leading-relaxed"
              >
                Prefer to speak or email directly? Find our contact details below.
              </motion.p>
              <div className="space-y-8">
                {/* Phones (Multiple) */}
                {phones.map((p, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 group"
                    >
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-300">
                            <Phone className="text-emerald-400" size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">{p.label}</p>
                            <p className="text-lg font-semibold hover:text-emerald-400 transition-colors duration-300 cursor-pointer">{p.number}</p>
                        </div>
                    </motion.div>
                ))}
                {/* Email */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-300">
                    <Mail className="text-emerald-400" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">General Email</p>
                    <a href={`mailto:${email}`} className="text-lg font-semibold hover:text-emerald-400 transition-colors duration-300 block">{email}</a>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Socials */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 lg:mt-0 pt-8 border-t border-slate-800/50"
            >
              <p className="text-sm text-slate-400 font-medium mb-6 uppercase tracking-wide">Connect with us</p>
              <div className="flex gap-3">
                {socials.map((social, i) => {
                  const Icon = social.icon || Globe;
                  return (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/50 backdrop-blur-sm text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg"
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
          {/* RIGHT COLUMN: FORM (Light / Clean) */}
          <div className="relative lg:w-[65%] p-10 lg:p-12 bg-gradient-to-b from-white to-slate-50">
            <motion.h3 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-slate-900 mb-8"
            >
              Send Us a Message
            </motion.h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white/80 text-slate-900 placeholder:text-slate-400 shadow-sm hover:shadow-md"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><CheckCircle2 size={12} className="rotate-180" /> {errors.name.message}</span>}
                </motion.div>
                {/* Email */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    Email Address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white/80 text-slate-900 placeholder:text-slate-400 shadow-sm hover:shadow-md"
                    placeholder="john@company.com"
                  />
                  {errors.email && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><CheckCircle2 size={12} className="rotate-180" /> {errors.email.message}</span>}
                </motion.div>
              </div>
              {/* Subject */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Subject
                </label>
                <input
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white/80 text-slate-900 placeholder:text-slate-400 shadow-sm hover:shadow-md"
                  placeholder="What is this regarding?"
                />
                {errors.subject && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><CheckCircle2 size={12} className="rotate-180" /> {errors.subject.message}</span>}
              </motion.div>
              {/* Message */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Message
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={6}
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white/80 text-slate-900 placeholder:text-slate-400 resize-none shadow-sm hover:shadow-md"
                  placeholder="Please describe your inquiry in detail..."
                />
                {errors.message && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><CheckCircle2 size={12} className="rotate-180" /> {errors.message.message}</span>}
              </motion.div>
              {/* Submit Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-between pt-4"
              >
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-emerald-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${submitting ? 'hidden' : ''}`}></div>
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
               
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
                   <CheckCircle2 size={16} className="text-emerald-600" />
                   <span>Your data is secure and private.</span>
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </section>
     
      {/* 3. LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
             <motion.h2 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               viewport={{ once: true }}
               className="text-4xl font-bold text-slate-900 mb-4"
             >
               Our Campus Locations
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               viewport={{ once: true }}
               className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
             >
                 Discover our state-of-the-art campuses in the heart of Kasaragod, Kerala. Schedule a visit today.
             </motion.p>
        </motion.div>
       
        <div className="grid md:grid-cols-2 gap-8">
            {locations.map((loc, i) => (
                <LocationCard key={i} location={loc} />
            ))}
        </div>
      </section>
    </div>
  );
}
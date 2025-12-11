'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter,
  Linkedin, Globe, Clock, MessageCircle, Sparkles, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

// --- PREMIUM EDITORIAL STYLES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  /* Warm Shadow for Paper Effect */
  .premium-card {
    box-shadow: 
      0 10px 30px rgba(120, 113, 108, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-card-hover {
    box-shadow: 
      0 20px 50px rgba(245, 158, 11, 0.1),
      0 0 0 1px rgba(245, 158, 11, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
`;

// --- DEFAULT DATA ---
const DEFAULT_CONTENT = {
  phones: [
    { label: 'Admissions Office', number: '+91 9656480068' },
    { label: 'Administration', number: '+91 8714403503' },
  ],
  email: 'info@iqradars.edu',
  locations: [
    {
      name: 'Udinur Dars',
      address: 'Udinur Education Street, Udinur, Kasaragod, Kerala, India',
      mapUrl: "/udinur.png",
      googleMapLink: "https://www.google.com/maps/place/Udinur+Juma+Masjid/@12.1535692,75.1699812,17z"
    },
    {
      name: 'Padanna Dars',
      address: 'Padanna Valiya Juma Masjid Road, Padanna, Kasaragod, Kerala, India',
      mapUrl: "/padanna.png",
      googleMapLink: "https://www.google.com/maps/place/Padanna+%E2%88%99+Valiya+juma+masjid/@12.1763519,75.1463666,17z"
    },
  ],
  socials: [
    { name: 'Facebook', url: '#', icon: Facebook },
    { name: 'Instagram', url: '#', icon: Instagram },
    { name: 'Twitter', url: '#', icon: Twitter },
    { name: 'Linkedin', url: '#', icon: Linkedin },
  ],
};

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(prev => ({ ...prev, ...data.content }));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
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
      toast.error(error.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  const socials = content.socials || DEFAULT_CONTENT.socials;
  const phones = content.phones || DEFAULT_CONTENT.phones;
  const locations = content.locations || DEFAULT_CONTENT.locations;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <style jsx global>{customStyles}</style>

      {/* Decorative Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-10   px-6 lg:px-12 bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-amber-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <MessageCircle size={12} className="text-amber-600" />
            <span>Contact Information</span>
          </motion.div>

         
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-stone-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Whether you have questions about admissions, academics, or campus life, our team is ready to assist you.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* LEFT COLUMN: Contact Details (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-stone-900 text-stone-300 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-stone-900/20"
            >
              <div className="relative z-10">
                <h3 className="text-1xl font-serif font-bold text-white mb-8 pb-6 border-b border-stone-800 flex items-center gap-3">
                  <Mail className="text-amber-500" size={24} />
                  <span>Reach Out</span>
                </h3>

                <div className="space-y-8">
                  {/* Phone */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">Call Us</p>
                    <div className="space-y-4">
                      {phones.map((p, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-500 group-hover:text-stone-900 transition-colors">
                            <Phone size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">{p.label}</p>
                            <a href={`tel:${p.number}`} className="text-base  text-white hover:text-amber-500 transition-colors">
                              {p.number}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">Email Us</p>
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-500 group-hover:text-stone-900 transition-colors">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">General Inquiries</p>
                        <a href={`mailto:iqradars786@gmail.com`} className="text-base  text-white hover:text-amber-500 transition-colors">
                          iqradars786@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">Office Hours</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-white ">Mon - Sat: 9:00 AM - 5:00 PM</p>
                        <p className="text-xs text-stone-500 mt-1">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            </motion.div>

            {/* Socials Card */}
            
          </div>

          {/* RIGHT COLUMN: Form (Span 7) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 md:p-12 border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="mb-10">
                  <span className="text-amber-600 font-bold uppercase text-[10px] tracking-widest mb-2 block">Write to Us</span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">Send a Message</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Full Name</label>
                      <input
                        {...register('name', { required: 'Required' })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400 font-medium text-sm"
                        placeholder="John Doe"
                      />
                      {errors.name && <span className="text-xs text-red-500 font-bold">{errors.name.message}</span>}
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Email</label>
                      <input
                        {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid' } })}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400 font-medium text-sm"
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-xs text-red-500 font-bold">{errors.email.message}</span>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Subject</label>
                    <input
                      {...register('subject', { required: 'Required' })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400 font-medium text-sm"
                      placeholder="Admission Inquiry..."
                    />
                    {errors.subject && <span className="text-xs text-red-500 font-bold">{errors.subject.message}</span>}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Message</label>
                    <textarea
                      {...register('message', { required: 'Required' })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-400 resize-y font-medium text-sm"
                      placeholder="How can we assist you?"
                    />
                    {errors.message && <span className="text-xs text-red-500 font-bold">{errors.message.message}</span>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full md:w-auto px-8 py-3 bg-stone-900 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-amber-500 hover:text-stone-900 transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                      {!submitting && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. CAMPUS LOCATIONS */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-4">
              <MapPin size={12} />
              <span>Locations</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              Visit Our <span className="text-amber-600">Campuses</span>
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Experience our learning environment firsthand at one of our branches.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {locations.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-300 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500"
              >
                {/* Map Image */}
                <div className="relative h-64 bg-stone-200 overflow-hidden">
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={loc.mapUrl}
                    alt={`${loc.name} location`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-stone-900 shadow-sm">
                    Branch {i + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">{loc.name}</h3>
                  <p className="text-stone-500 text-sm mb-6 leading-relaxed border-l-2 border-amber-300 pl-4">
                    {loc.address}
                  </p>

                  <a
                    href={loc.googleMapLink || loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-amber-600 transition-colors group/link"
                  >
                    <Globe size={14} />
                    <span>Get Directions</span>
                    <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
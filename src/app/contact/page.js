'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter,
  Linkedin, Globe, CheckCircle2, Clock, MessageCircle, Sparkles, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

// --- PREMIUM STYLES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  .premium-card {
    box-shadow: 
      0 20px 60px rgba(15, 23, 42, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-card-hover {
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

// --- DEFAULT DATA ---
const DEFAULT_CONTENT = {
  phones: [
    { label: 'Admissions', number: '+91 9656480068' },
    { label: 'Administration', number: '+91 8714403503' },
  ],
  email: 'info@iqradars.edu',
  locations: [
    {
      name: 'Udinur Dars',
      address: 'Udinur Education Street, Udinur, Kasaragod, Kerala, India',
      mapUrl: "/udinur.png", // Keeping original map images/urls
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 text-slate-900">
      <style jsx global>{customStyles}</style>

      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }} 
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-emerald-50/10" />

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-10 premium-card"
          >
            <div className="p-1.5 rounded-full bg-emerald-100">
              <MessageCircle size={12} className="text-emerald-600" />
            </div>
            <span>Contact Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.05]"
          >
            Get in{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
                Touch
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Have questions about admissions, academics, or campus life? We're here to help. Reach out to us directly or send a message below.
          </motion.p>
        </div>
      </section>

      {/* 2. PREMIUM MAIN CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

          {/* LEFT COLUMN: Premium Contact Information */}
          <div className="lg:col-span-1 space-y-6">

            {/* Premium Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl premium-card text-white overflow-hidden"
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700/50">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Mail size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
                </div>
                
                <div className="space-y-8">
                  {/* Contact Numbers Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent" />
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                        Call Us
                      </p>
                    </div>
                    {phones.map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <Phone size={20} className="text-emerald-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">{p.label}</p>
                          <a href={`tel:${p.number}`} className="text-lg font-bold text-white hover:text-emerald-400 transition-colors block">
                            {p.number}
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Email Section */}
                  <div className="space-y-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent" />
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                        General Enquiries
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Mail size={20} className="text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Direct Email</p>
                        <a href={`mailto:iqradars786@gmail.com`} className="text-base font-bold text-white hover:text-emerald-400 transition-colors break-all block">
                          iqradars786@gmail.com
                        </a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Office Hours Section */}
                  <div className="space-y-6 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-gradient-to-r from-emerald-400 to-transparent" />
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                        Opening Hours
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-emerald-500/30"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Clock size={20} className="text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Operation Schedule</p>
                        <p className="text-lg font-bold text-white mb-1">
                          Mon - Sat: <span className='text-emerald-400'>9:00 AM - 5:00 PM</span>
                        </p>
                        <p className="text-sm text-slate-400">Sunday: Closed</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Social Media */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl glass-panel premium-card"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" />
                Follow Us
              </h3>
              <div className="flex gap-3">
                {socials.map((social, i) => {
                  const Icon = social.icon || Globe;
                  return (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300 premium-card group"
                      aria-label={social.name}
                    >
                      <Icon size={20} className="relative z-10" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Premium Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative bg-white/90 backdrop-blur-sm rounded-3xl premium-card p-8 md:p-10 lg:p-12 overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                      <Send size={24} className="text-white" />
                    </div>
                    Send us a Message
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Fill out the form below and we will get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium premium-card"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <span>•</span> {errors.name.message}
                        </span>
                      )}
                    </motion.div>
                    
                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                        })}
                        type="email"
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium premium-card"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <span>•</span> {errors.email.message}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  {/* Subject */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium premium-card"
                      placeholder="Inquiry about..."
                    />
                    {errors.subject && (
                      <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                        <span>•</span> {errors.subject.message}
                      </span>
                    )}
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={6}
                      className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 resize-y font-medium premium-card"
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                        <span>•</span> {errors.message.message}
                      </span>
                    )}
                  </motion.div>

                  {/* Premium Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-4"
                  >
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="relative w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                          <span className="relative z-10">Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Send Message</span>
                          <Send size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM LOCATIONS SECTION */}
      <section className="relative py-24 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-6 premium-card">
              <div className="p-1.5 rounded-full bg-emerald-100">
                <MapPin size={12} className="text-emerald-600" />
              </div>
              <span>Our Locations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Campuses</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Visit our campuses to experience our learning environment firsthand.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {locations.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative bg-white rounded-3xl overflow-hidden premium-card hover:premium-card-hover transition-all duration-500"
              >
                {/* Map/Image Area */}
                <div className="relative h-72 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={loc.mapUrl}
                    alt={`${loc.name} location`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 z-20">
                    <div className="px-4 py-2 rounded-full glass-panel text-xs font-bold text-emerald-700 shadow-lg border border-white/50">
                      Campus {i + 1}
                    </div>
                  </div>
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                </div>

                {/* Premium Content */}
                <div className="p-8 lg:p-10">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                        <MapPin size={28} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {loc.address}
                      </p>
                    </div>
                  </div>

                  <motion.a
                    href={loc.googleMapLink || loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-emerald-500/30 gap-2 group/btn"
                  >
                    <Globe size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span>Get Directions</span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.a>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
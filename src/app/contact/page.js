'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, 
  Linkedin, ArrowRight, Globe, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

// --- CUSTOM FONT CONFIGURATION ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :root {
    --font-stack: 'Stack Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
  }
  
  /* Subtle grid pattern for background */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
                      linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
  }
`;

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [content, setContent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
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
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const socials = content?.socials || [
    { name: 'Facebook', url: '#', icon: Facebook },
    { name: 'Instagram', url: '#', icon: Instagram },
    { name: 'Twitter', url: '#', icon: Twitter },
    { name: 'Linkedin', url: '#', icon: Linkedin },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-stack text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{customStyles}</style>
      
      {/* 1. HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6"
           >
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Get in Touch
           </motion.div>
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
             Contact Our Admissions Team
           </h1>
           <p className="text-lg text-slate-500 max-w-2xl mx-auto">
             We are here to answer your questions about enrollment, academics, and campus life.
           </p>
        </div>
      </div>

      {/* 2. MAIN CONTENT CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-200 flex flex-col lg:flex-row"
        >
          
          {/* LEFT COLUMN: INFO (Dark / Professional) */}
          <div className="lg:w-[35%] bg-slate-900 text-white p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Contact Information</h3>
              <p className="text-slate-400 text-sm mb-10">Fill out the form and our team will get back to you within 24 hours.</p>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="text-emerald-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wide">Phone</p>
                    <p className="text-lg font-semibold">{content?.phone || '+91 987 654 3210'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="text-emerald-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wide">Email</p>
                    <p className="text-lg font-semibold">{content?.email || 'info@iqradars.edu'}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-emerald-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wide">Campus</p>
                    <p className="text-base font-medium leading-relaxed text-slate-300">
                      {content?.location?.address || "123 Islamic Education Street, Udinur District, Kerala, India"}
                    </p>
                    <a href="/location" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold mt-3 hover:text-emerald-300">
                      View on Map <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-12 lg:mt-0">
              <div className="flex gap-4">
                {socials.map((social, i) => {
                  const Icon = social.icon || Globe;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM (Light / Clean) */}
          <div className="lg:w-[65%] p-10 lg:p-16 bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-xs text-red-600 font-medium">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="john@company.com"
                  />
                  {errors.email && <span className="text-xs text-red-600 font-medium">{errors.email.message}</span>}
                </div>
              </div>

              {/* Subject (Changed to Input) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="What is this regarding?"
                />
                {errors.subject && <span className="text-xs text-red-600 font-medium">{errors.subject.message}</span>}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 resize-none"
                  placeholder="Please describe your inquiry..."
                />
                {errors.message && <span className="text-xs text-red-600 font-medium">{errors.message.message}</span>}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
                
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                   <CheckCircle2 size={14} className="text-emerald-600" />
                   <span>Your data is secure.</span>
                </div>
              </div>

            </form>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
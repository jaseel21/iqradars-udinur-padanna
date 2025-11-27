'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter,
  Linkedin, Globe, CheckCircle2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions about admissions, academics, or campus life? We're here to help. Reach out to us directly or send a message below.
          </motion.p>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

          {/* LEFT COLUMN: Contact Information */}
          <div className="lg:col-span-1 space-y-10">

            {/* Contact Cards */}
            <div className="p-8 lg:p-10 bg-slate-700 rounded-2xl shadow-2xl text-white space-y-10">
    <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3 border-b border-slate-700/50 pb-4">
        <Mail size={24} className="text-emerald-500"/>
        Get In Touch
    </h3>
    
    <div className="space-y-8">
        {/* Contact Numbers Section */}
        <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l-4 border-emerald-500 pl-3">
                Call Us
            </p>
            {phones.map((p, i) => (
                <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 uppercase tracking-wide mb-1">{p.label}</p>
                        <a href={`tel:${p.number}`} className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                            {p.number}
                        </a>
                    </div>
                </div>
            ))}
        </div>

        {/* Email Section */}
        <div className="space-y-5 pt-4 border-t border-slate-800/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l-4 border-emerald-500 pl-3">
                General Enquiries
            </p>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <Mail size={18} />
                </div>
                <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wide mb-1">Direct Email</p>
                    <a href={`mailto:iqradars786@gmail.com`} className="text-lg font-bold text-white hover:text-emerald-400 transition-colors break-all">
                       iqradars786@gmail.com

                    </a>
                </div>
            </div>
        </div>

        {/* Office Hours Section */}
        <div className="space-y-5 pt-4 border-t border-slate-800/50">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l-4 border-emerald-500 pl-3">
                Opening Hours
            </p>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <Clock size={18} />
                </div>
                <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wide mb-1">Operation Schedule</p>
                    <p className="text-lg font-bold text-white">
                        Mon - Sat: <span className='text-emerald-400'>9:00 AM - 5:00 PM</span>
                    </p>
                    <p className="text-sm text-slate-500">Sunday: Closed</p>
                </div>
            </div>
        </div>
    </div>
</div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {socials.map((social, i) => {
                  const Icon = social.icon || Globe;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-sm"
                      aria-label={social.name}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h3>
              <p className="text-slate-600 mb-8">Fill out the form below and we will get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>}
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Inquiry about..."
                  />
                  {errors.subject && <span className="text-xs text-red-500 font-medium">{errors.subject.message}</span>}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 resize-y"
                    placeholder="How can we help you?"
                  />
                  {errors.message && <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOCATIONS SECTION */}
      <section className="bg-slate-100 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Campuses</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Visit our campuses to experience our learning environment firsthand.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {locations.map((loc, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group">
                {/* Map/Image Area */}
                <div className="relative h-64 bg-slate-200 overflow-hidden">
                  <iframe
                    src={loc.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    title={`${loc.name} Map`}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                    Campus {i + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{loc.name}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{loc.address}</p>
                    </div>
                  </div>

                  <a
                    href={loc.mapUrl} // Or use a real google maps link if available in data
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-sm gap-2"
                  >
                    <Globe size={16} />
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
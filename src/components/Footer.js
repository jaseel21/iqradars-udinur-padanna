'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send, ArrowRight, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { href: '/', label: 'Home' },
      { href: '/articles', label: 'Articles' },
      { href: '/organizations', label: 'Organizations' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/board', label: 'Board' },
    ],
    about: [
      { href: '/contact', label: 'Contact' },
      { href: '/location', label: 'Location' },
      { href: '/about', label: 'About Us' },
      { href: '/events', label: 'Events' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/iqradars', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/iqradars', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Twitter, href: 'https://twitter.com/iqradars', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Youtube, href: 'https://youtube.com/iqradars', label: 'Youtube', color: 'hover:bg-red-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 mt-24">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12"
        >
          {/* Brand Section - Takes more space */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30"></div>
                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-2.5 rounded-xl shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Iqra Dars Udinur
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              Dedicated to spreading Islamic knowledge, faith, and wisdom. Empowering the Muslim community through quality education and spiritual guidance.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group relative bg-gray-100 p-3 rounded-xl text-emerald-600 hover:text-white transition-all ${social.color}`}
                  >
                    <Icon size={18} className="text-current" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-lg font-bold text-gray-900 mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group text-gray-600 hover:text-emerald-600 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <ArrowRight size={14} className="text-emerald-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-lg font-bold text-gray-900 mb-6 relative inline-block">
              About
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group text-gray-600 hover:text-emerald-600 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <ArrowRight size={14} className="text-emerald-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h4 className="text-lg font-bold text-gray-900 mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-600">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <MapPin size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <span className="text-sm leading-relaxed">
                  123 Islamic Education Street<br />
                  Udinur District, City, Country
                </span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Mail size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <a href="mailto:info@iqradars.edu" className="hover:text-emerald-600 transition-colors text-sm">
                  info@iqradars.edu
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-600">
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <Phone size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <a href="tel:+1234567890" className="hover:text-emerald-600 transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm text-center md:text-left">
              <p>
                &copy; {currentYear} <span className="font-semibold text-gray-900">Iqra Dars Udinur</span>. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-emerald-600 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
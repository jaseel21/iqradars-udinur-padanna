import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { href: '/', label: 'Home' },
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
    { icon: Facebook, href: 'https://facebook.com/iqradars', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/iqradars', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/iqradars', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold font-amiri mb-4 text-yellow-300">
              Iqra Dars Udinur
            </h3>
            <p className="text-green-100 mb-4 leading-relaxed">
              Dedicated to spreading Islamic knowledge, faith, and wisdom. Empowering the Muslim community through quality education and spiritual guidance.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all hover:scale-110"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-green-100 hover:text-yellow-300 transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-yellow-300 rounded-full"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-green-100 hover:text-yellow-300 transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-yellow-300 rounded-full"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-green-100">
                <MapPin size={20} className="mt-1 text-yellow-300 flex-shrink-0" />
                <span className="text-sm">
                  123 Islamic Education Street<br />
                  Udinur District, City, Country
                </span>
              </li>
              <li className="flex items-center space-x-3 text-green-100">
                <Mail size={20} className="text-yellow-300 flex-shrink-0" />
                <a href="mailto:info@iqradars.edu" className="hover:text-yellow-300 transition-colors">
                  info@iqradars.edu
                </a>
              </li>
              <li className="flex items-center space-x-3 text-green-100">
                <Phone size={20} className="text-yellow-300 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-yellow-300 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-green-700 pt-8 mt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4 text-yellow-300">Subscribe to Our Newsletter</h4>
            <p className="text-green-100 text-sm mb-4">
              Stay updated with our latest events, classes, and community activities.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-green-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700 bg-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-green-100 text-sm text-center md:text-left">
              <p>
                &copy; {currentYear} Iqra Dars Udinur. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-green-100 hover:text-yellow-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

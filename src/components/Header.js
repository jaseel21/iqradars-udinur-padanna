'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // npm install lucide-react for icons

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('/');

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/organizations', label: 'Organizations' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/board', label: 'Board' },
    { href: '/contact', label: 'Contact' },
    { href: '/location', label: 'Location' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="navbar fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-yellow-300" onClick={() => setActive('/')}>
            Iqra Dars Udinur
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar-link ${active === item.href ? 'active' : ''}`}
                onClick={() => setActive(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-green-900/95 backdrop-blur-sm"
            >
              <div className="px-4 py-2 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => {
                      setActive(item.href);
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
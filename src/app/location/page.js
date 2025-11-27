'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function Location() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  const location = content?.location || {
    address: '123 Islamic Education Street, Udinur District, City, Country',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184133978015!2d-73.98811768459378!3d40.75889597932662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-amiri">
            Our Location
          </h1>
          <p className="text-xl text-gray-600">
            Visit us for classes, events, and community gatherings
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Location Information */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-full flex-shrink-0">
                  <MapPin className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 pt-2">
                  Address
                </h2>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                {location.address}
              </p>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Phone className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">
                    {content?.phone || '+1 (555) 123-4567'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">
                    {content?.email || 'iqradars786@gmail.com'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">
                    {content?.hours || 'Monday - Friday: 9:00 AM - 6:00 PM'}
                  </span>
                </div>
              </div>

              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Navigation size={20} />
                <span>Get Directions</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-amiri">
                Visiting Hours
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="font-semibold text-green-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="font-medium">Saturday</span>
                  <span className="font-semibold text-green-600">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sunday</span>
                  <span className="font-semibold text-red-600">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
            >
              <div className="relative w-full h-[600px]">
                <iframe
                  src={location.mapEmbed}
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-amiri">
                Parking & Accessibility
              </h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                We have ample parking available for visitors. The facility is wheelchair accessible with ramps and elevators. 
                If you need any special accommodations, please contact us in advance and we'll be happy to assist you.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

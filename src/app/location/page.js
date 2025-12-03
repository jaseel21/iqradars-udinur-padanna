'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Navigation, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const locations = [
  {
    id: 1,
    title: "Padanna Dars",
    address: "Valiya Juma Masjid, Padanna",
    description: "A center for Islamic learning and spiritual growth in the heart of Padanna.",
    mapLink: "https://www.google.com/maps/place/Padanna+%E2%88%99+Valiya+juma+masjid/@12.1763519,75.1463666,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba4712baa5a024f:0xf28f87750da0ae5e!8m2!3d12.1763519!4d75.1463666!16s%2Fg%2F11hdf8t3mj?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.676766687644!2d75.1463666!3d12.1763519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4712baa5a024f%3A0xf28f87750da0ae5e!2sPadanna%20%E2%88%99%20Valiya%20juma%20masjid!5e0!3m2!1sen!2sin!4v1709664000000!5m2!1sen!2sin"
  },
  {
    id: 2,
    title: "Udinur Dars",
    address: "Udinur Juma Masjid, Udinur",
    description: "Dedicated to preserving Islamic heritage and providing quality education.",
    mapLink: "https://www.google.com/maps/place/Udinur+Juma+Masjid/@12.1535692,75.1699812,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba46e2faaaaaaab:0x34c5c716b6b6e9d!8m2!3d12.1535692!4d75.1699812!16s%2Fg%2F11b7h9y1zm?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.987654321!2d75.1699812!3d12.1535692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba46e2faaaaaaab%3A0x34c5c716b6b6e9d!2sUdinur%20Juma%20Masjid!5e0!3m2!1sen!2sin!4v1709664000000!5m2!1sen!2sin"
  }
];

const contactInfo = {
  phone: "9656480068",
  email: "iqradars786@gmail.com",
  hours: "Daily: 5:00 AM - 9:00 PM"
};

export default function Location() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Find Us</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 font-amiri">
            Our Locations
          </h1>
         
        </motion.div>

        

        {/* Locations Grid */}
        <div className="space-y-20">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-start`}
            >
              {/* Info Side */}
              <div className="flex-1 space-y-6 w-full">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 text-white p-2 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 font-amiri">{location.title}</h2>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {location.description}
                </p>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-green-600" />
                    Address
                  </h3>
                  <p className="text-gray-600 mb-6">{location.address}</p>

                  <Link
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Map Side */}
              <div className="flex-1 w-full h-[400px] lg:h-[450px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative">
                <iframe
                  src={location.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

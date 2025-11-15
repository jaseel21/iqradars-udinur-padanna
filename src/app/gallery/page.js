'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import GalleryGrid from '@/components/GalleryGrid';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'; // Icons for filters/lightbox

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  // Demo fallback images (professional Islamic-themed placeholders)
  const demoImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop', category: 'architecture', alt: 'Majestic mosque at sunset' },
    { id: 2, url: 'https://images.unsplash.com/photo-1573552109488-0a0f2a4b9a0b?w=800&h=600&fit=crop', category: 'events', alt: 'Community prayer gathering' },
    { id: 3, url: 'https://images.unsplash.com/photo-1589890787815-1f0e2a78b6b7?w=800&h=600&fit=crop', category: 'architecture', alt: 'Islamic calligraphy art' },
    { id: 4, url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=600&fit=crop', category: 'events', alt: 'Educational seminar' },
    { id: 5, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', category: 'architecture', alt: 'Dome of historic masjid' },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Fetching gallery images...');
        const res = await fetch('/api/gallery');
        console.log('Gallery API response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Gallery API data:', data);
          console.log('Number of images fetched:', data?.length || 0);
          
          if (data && Array.isArray(data) && data.length > 0) {
            const fetchedImages = data.map((img, index) => ({
              id: img._id || img.id || `img-${index}`,
              url: img.url,
              category: img.category || 'events',
              alt: img.alt || `Gallery image ${img._id || index + 1}`
            }));
            console.log('Processed images:', fetchedImages);
            setImages(fetchedImages);
            toast.success(`Loaded ${fetchedImages.length} image(s)`);
          } else {
            console.warn('No images in database, using demo images');
            setImages(demoImages);
            toast.info('Using demo images - no images found in database');
          }
        } else {
          const errorText = await res.text();
          console.warn('Gallery API error:', res.status, errorText);
          setImages(demoImages);
          toast.info('Using demo images - API error');
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError('Failed to load gallery. Using demo images.');
        toast.error('Gallery load issue—check connection');
        setImages(demoImages);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = images.filter(img => filter === 'all' || img.category === filter);

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  const closeModal = () => setModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 text-green-800 font-amiri">Our Gallery</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A visual journey through our cherished moments, events, and architectural beauty at Iqra Dars Udinur.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex justify-center mb-8 space-x-4 flex-wrap">
        {['all', 'events', 'architecture'].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === cat
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Error Notice */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-yellow-600 text-center mb-4 italic"
        >
          {error}
        </motion.p>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-4 mb-4 text-sm text-gray-500">
          <p>Total images: {images.length}</p>
          <p>Filtered images: {filteredImages.length}</p>
          <p>Current filter: {filter}</p>
          {images.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer">View image URLs</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(images.slice(0, 3).map(img => ({ id: img.id, url: img.url })), null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredImages.length > 0 ? (
          <GalleryGrid images={filteredImages} onImageClick={openModal} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No images found for the selected filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-green-600 hover:text-green-700 underline"
            >
              Show all images
            </button>
          </div>
        )}
      </div>

      {/* Load More Button (Placeholder for Infinite Scroll) */}
      <div className="text-center mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700"
          onClick={() => toast.info('More images coming soon!')}
        >
          Load More
        </motion.button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2 hover:bg-white/30"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div className="max-w-4xl max-h-full flex items-center justify-center">
              <Image
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.alt}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain cursor-zoom-in"
              />
            </div>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2 hover:bg-white/30"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}   
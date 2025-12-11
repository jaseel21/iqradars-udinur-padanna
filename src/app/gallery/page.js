'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, ZoomIn, Camera, ChevronLeft, ChevronRight, 
  ImageOff, Share2, Loader2, Filter, Download
} from 'lucide-react';

// --- CUSTOM CSS FOR MASONRY & FONTS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  /* Masonry Grid Logic */
  .masonry-grid {
    column-count: 1;
    column-gap: 2rem;
  }
  @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
  @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
  
  .masonry-item {
    break-inside: avoid;
    margin-bottom: 2rem;
  }
`;

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Lightbox State
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          const imageList = Array.isArray(data) ? data : (data.images || data.gallery || []);
          setImages(imageList);
        } else {
          setImages([]); 
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // --- FILTER LOGIC ---
  const categories = ['all', ...new Set(images.map(img => img.category || 'uncategorized'))];
  
  const filteredImages = images.filter(img => 
    filter === 'all' || (img.category || 'uncategorized') === filter
  );

  // --- LIGHTBOX HANDLERS ---
  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal, nextImage, prevImage]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-32 font-sans selection:bg-amber-100 selection:text-amber-900">
      <style jsx global>{customStyles}</style>

      {/* Decorative Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />

      {/* 1. HEADER SECTION */}
      <div className="relative pt-12 pb-8 px-6 lg:px-12 bg-stone-50">
         <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-amber-700 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
               <Camera size={12} />
               <span>Visual Archive</span>
            </motion.div>

           

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-xs text-stone-500 max-w-2xl mx-auto font-medium leading-relaxed"
            >
               A curated collection of memories capturing the essence of life, learning, and heritage at Iqra Dars.
            </motion.p>
         </div>
      </div>

      {/* 2. FILTER BAR */}
      {!loading && images.length > 0 && (
        <div className="sticky top-10 z-30 mb-6 pointer-events-none">
           <div className="max-w-7xl mx-auto px-6 text-center">
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex bg-white/90 backdrop-blur-md border border-stone-200/60 p-1.5 rounded-2xl shadow-xl shadow-stone-200/30 pointer-events-auto flex-wrap justify-center gap-1"
              >
                 {categories.map((cat) => (
                    <button
                       key={cat}
                       onClick={() => setFilter(cat)}
                       className={`px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          filter === cat
                             ? 'bg-stone-900 text-white shadow-md'
                             : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                       }`}
                    >
                       {cat}
                    </button>
                 ))}
              </motion.div>
           </div>
        </div>
      )}

      {/* 3. MASONRY GALLERY GRID */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 min-h-[400px]">
         
         {/* Loading State */}
         {loading && (
            <div className="flex flex-col items-center justify-center py-32">
               <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
               <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Loading Collection...</p>
            </div>
         )}

         {/* Gallery Grid */}
         {!loading && filteredImages.length > 0 && (
            <div className="masonry-grid">
               <AnimatePresence mode="popLayout">
                  {filteredImages.map((img, index) => (
                     <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        key={img._id || index}
                        onClick={() => openModal(index)}
                        className="masonry-item group relative cursor-zoom-in"
                     >
                        {/* Image Card */}
                        <div className="relative overflow-hidden rounded-xl bg-stone-200 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-stone-900/10 border border-stone-100">
                            <Image
                                src={img.url || img.src || '/placeholder.jpg'} 
                                alt={img.alt || 'Gallery Image'}
                                width={800}
                                height={1000}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Center Zoom Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                                    <ZoomIn size={20} />
                                </div>
                            </div>

                            {/* Bottom Info Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-stone-100 shadow-lg">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-1 block">
                                        {img.category || 'Archive'}
                                    </span>
                                    <h3 className="text-stone-900 font-serif text-sm font-bold line-clamp-1">
                                        {img.alt || 'Untitled Image'}
                                    </h3>
                                </div>
                            </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}

         {/* Empty State */}
         {!loading && filteredImages.length === 0 && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-stone-200 border-dashed max-w-2xl mx-auto"
            >
               <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6 text-stone-300">
                  <ImageOff size={32} />
               </div>
               <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No Images Found</h3>
               <p className="text-stone-500 text-sm mb-6 max-w-xs mx-auto">
                  {filter === 'all' 
                     ? "The archive is currently empty." 
                     : `No images found in the "${filter}" collection.`}
               </p>
               {filter !== 'all' && (
                  <button 
                     onClick={() => setFilter('all')} 
                     className="px-6 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                     Clear Filter
                  </button>
               )}
            </motion.div>
         )}
      </div>

      {/* 4. CINEMATIC LIGHTBOX */}
      <AnimatePresence>
        {modalOpen && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeModal}
          >
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 lg:p-8 flex justify-between items-start z-50 pointer-events-none">
               <div className="pointer-events-auto">
                   <h2 className="text-white font-serif text-xl lg:text-2xl mb-1">
                      {filteredImages[currentIndex]?.alt || 'Gallery View'}
                   </h2>
                   <div className="flex items-center gap-3 text-stone-400 text-xs font-mono">
                      <span>{currentIndex + 1} / {filteredImages.length}</span>
                      <span className="w-1 h-1 bg-stone-600 rounded-full"></span>
                      <span className="uppercase tracking-widest text-amber-500 font-bold">
                        {filteredImages[currentIndex]?.category || 'Archive'}
                      </span>
                   </div>
               </div>

               <div className="flex gap-4 pointer-events-auto">
                  <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-stone-900 hover:border-amber-500 text-white transition-all duration-300 group">
                     <Share2 size={18} />
                  </button>
                  <button onClick={closeModal} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white transition-all duration-300">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Main Image */}
            <motion.div 
              className="relative w-full h-full flex items-center justify-center p-4 lg:p-20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative max-w-full max-h-full shadow-2xl shadow-black/50">
                <Image
                  src={filteredImages[currentIndex]?.url || filteredImages[currentIndex]?.src || '/placeholder.jpg'}
                  alt={filteredImages[currentIndex]?.alt || 'Detail view'}
                  width={1920}
                  height={1200}
                  className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-sm"
                  priority
                />
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full text-stone-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all hidden md:flex"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full text-stone-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all hidden md:flex"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
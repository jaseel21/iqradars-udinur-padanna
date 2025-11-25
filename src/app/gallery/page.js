'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, ZoomIn, Camera, ChevronLeft, ChevronRight, 
  ImageOff, Share2, Loader2 
} from 'lucide-react';

// --- CUSTOM FONT CSS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
  
  :root {
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Playfair Display', serif;
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
          // Handle different API structures (array vs object)
          const imageList = Array.isArray(data) ? data : (data.images || data.gallery || []);
          setImages(imageList);
        } else {
          console.error("Failed to fetch gallery");
          setImages([]); // Ensure empty state triggers
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
  // Extract unique categories dynamically from data, plus 'all'
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
    <div className="min-h-screen bg-white text-slate-900 pb-24 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{customStyles}</style>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* 1. HEADER SECTION */}
      <div className="relative pt-32 pb-16 px-6 lg:px-12 bg-white">
         <div className="max-w-7xl mx-auto text-center space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em]"
            >
               <Camera size={14} />
               <span>Visual Archive</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1]"
            >
               Moments in <span className="italic text-emerald-600">Time</span>
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed"
            >
               A curated glimpse into the architectural heritage, vibrant events, and daily life at Iqra Dars Udinur.
            </motion.p>
         </div>
      </div>

      {/* 2. STICKY FILTER BAR (Only show if there are images) */}
      {!loading && images.length > 0 && (
        <div className="sticky top-20 z-30 mb-12 pointer-events-none">
           <div className="max-w-7xl mx-auto px-6">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex bg-white/80 backdrop-blur-xl border border-slate-200/60 p-1.5 rounded-2xl shadow-xl shadow-slate-200/20 pointer-events-auto mx-auto left-0 right-0 flex-wrap justify-center"
              >
                 {categories.map((cat) => (
                    <button
                       key={cat}
                       onClick={() => setFilter(cat)}
                       className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          filter === cat
                             ? 'bg-slate-900 text-white shadow-md transform scale-105'
                             : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                       }`}
                    >
                       {cat}
                    </button>
                 ))}
              </motion.div>
           </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 min-h-[400px]">
         
         {/* Loading State */}
         {loading && (
            <div className="flex flex-col items-center justify-center h-64 w-full">
               <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
               <p className="text-slate-400 text-sm uppercase tracking-widest">Loading Gallery...</p>
            </div>
         )}

         {/* Gallery Grid */}
         {!loading && filteredImages.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
               <AnimatePresence mode="popLayout">
                  {filteredImages.map((img, index) => (
                     <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        key={img._id || index}
                        onClick={() => openModal(index)}
                        className="group relative rounded-2xl overflow-hidden bg-slate-100 cursor-zoom-in break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                     >
                        <Image
                           src={img.url || img.src || '/placeholder.jpg'} // Fallback if url is missing
                           alt={img.alt || 'Gallery Image'}
                           width={800}
                           height={1000}
                           className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                           loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                           <div className="flex justify-between items-end">
                              <div>
                                 <span className="inline-block px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded mb-2">
                                    {img.category || 'Gallery'}
                                 </span>
                                 <h3 className="text-white font-serif text-lg font-medium leading-tight">
                                    {img.alt || 'View Image'}
                                 </h3>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                 <ZoomIn size={18} />
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}

         {/* Empty State (When no images exist or match filter) */}
         {!loading && filteredImages.length === 0 && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
            >
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                  <ImageOff size={32} />
               </div>
               <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No Images Found</h3>
               <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  {filter === 'all' 
                     ? "The gallery is currently empty. Please check back later as we update our collection." 
                     : `No images found in the "${filter}" category.`}
               </p>
               {filter !== 'all' && (
                  <button 
                     onClick={() => setFilter('all')} 
                     className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
                  >
                     View All Photos
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeModal}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
               <div className="text-white/80 font-mono text-xs tracking-widest pointer-events-auto">
                  {currentIndex + 1} / {filteredImages.length}
               </div>
               <div className="flex gap-4 pointer-events-auto">
                  <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                     <Share2 size={18} />
                  </button>
                  <button onClick={closeModal} className="p-3 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Main Image Container */}
            <motion.div 
              className="relative w-full h-full flex items-center justify-center p-4 lg:p-12"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative max-w-[90vw] max-h-[85vh] shadow-2xl">
                <Image
                  src={filteredImages[currentIndex]?.url || filteredImages[currentIndex]?.src || '/placeholder.jpg'}
                  alt={filteredImages[currentIndex]?.alt || 'Detail view'}
                  width={1600}
                  height={1200}
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg"
                  priority
                />
                
                {/* Caption Bar */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-lg text-left"
                >
                   <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                      {filteredImages[currentIndex]?.category || 'Gallery'}
                   </span>
                   <h2 className="text-white font-serif text-2xl">
                      {filteredImages[currentIndex]?.alt || 'View Image'}
                   </h2>
                </motion.div>
              </div>
            </motion.div>

            {/* Nav Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
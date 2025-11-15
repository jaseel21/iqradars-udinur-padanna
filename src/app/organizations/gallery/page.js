'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GalleryGrid from '@/components/GalleryGrid';

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div className="py-16 px-4">
      <motion.h1 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-center mb-8 text-green-800"
      >
        Gallery
      </motion.h1>
      <GalleryGrid images={images} />
    </div>
  );
}
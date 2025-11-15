'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function GalleryGrid({ images, onImageClick }) {
  const [imageErrors, setImageErrors] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageError = (imgId, url) => {
    console.error('Image failed to load:', url);
    setImageErrors((prev) => ({ ...prev, [imgId]: true }));
  };

  const handleImageLoad = (imgId, url) => {
    console.log('Image loaded successfully:', url);
    setLoadedImages((prev) => ({ ...prev, [imgId]: true }));
  };

  // Check if URL is from Supabase
  const isSupabaseUrl = (url) => {
    return url && url.includes('supabase.co');
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No images to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((img, index) => {
        const hasError = imageErrors[img.id];
        const isLoaded = loadedImages[img.id];
        const useSupabase = isSupabaseUrl(img.url);
        
        if (!img.url) {
          console.warn('Image missing URL:', img);
          return null;
        }
        
        return (
          <motion.div
            key={img.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer bg-gray-100"
            onClick={() => {
              const foundIndex = images.findIndex(i => i.id === img.id);
              if (foundIndex !== -1) {
                onImageClick(foundIndex);
              }
            }}
          >
            {hasError ? (
              <div className="w-full h-64 bg-gray-200 flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm mb-2">Image failed to load</p>
                <p className="text-gray-400 text-xs truncate max-w-full px-2">{img.url}</p>
              </div>
            ) : useSupabase ? (
              // Use regular img tag for Supabase URLs
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${index + 1}`}
                className="w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
                onError={() => handleImageError(img.id, img.url)}
                onLoad={() => handleImageLoad(img.id, img.url)}
                style={{ minHeight: '256px' }}
              />
            ) : (
              // Use Next.js Image for other URLs
              <Image
                src={img.url}
                alt={img.alt || `Gallery image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
                onError={() => handleImageError(img.id, img.url)}
                onLoad={() => handleImageLoad(img.id, img.url)}
              />
            )}
            {!hasError && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-semibold truncate">{img.alt || `Image ${index + 1}`}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
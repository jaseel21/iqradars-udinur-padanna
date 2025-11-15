'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Check if link already exists
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"][href*="Amiri"]');
    if (existingLink) return;

    // Create and add font link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return null;
}


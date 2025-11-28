'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Components ---

const NewsSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-8"></div>
    <div className="space-y-4 max-w-2xl mx-auto text-center mb-12">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
      <div className="h-10 w-3/4 bg-gray-200 rounded mx-auto"></div>
      <div className="h-10 w-1/2 bg-gray-200 rounded mx-auto"></div>
    </div>
    <div className="h-64 md:h-[500px] w-full bg-gray-200 rounded-2xl mb-12"></div>
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="h-6 w-full bg-gray-200 rounded"></div>
      <div className="h-6 w-full bg-gray-200 rounded"></div>
      <div className="h-6 w-5/6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function NewsDetail() {
  const params = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareStatus, setShareStatus] = useState(null); // 'copied' or null

  useEffect(() => {
    if (params.slug) {
      fetchNews();
    }
  }, [params.slug]);

  const fetchNews = async () => {
    try {
      const res = await fetch(`/api/news?slug=${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      // Small artificial delay to prevent layout thrashing if api is too fast
      setTimeout(() => setLoading(false), 300);
    }
  };

  // Function to copy URL as a fallback for sharing
  const fallbackCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2000);
    } catch (err) {
      console.error('Could not copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShareStatus('copied');
        setTimeout(() => setShareStatus(null), 2000);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Function to handle sharing logic (Web Share API or Copy)
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: news.title,
          url: url,
        });
      } catch (error) {
        // User cancelled or another error, fall back to copy
        if (error.name !== 'AbortError') {
            await fallbackCopy(url);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      await fallbackCopy(url);
    }
  };


  // Calculate read time based on word count
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    // Strip HTML tags for accurate word count
    const plainText = content.replace(/<[^>]*>?/gm, ''); 
    const words = plainText.split(/\s/g).filter(Boolean).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) return <NewsSkeleton />;

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Article not found</h1>
          <p className="text-gray-500">The news article you are looking for does not exist.</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readTime = calculateReadTime(news.content);

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center mr-3 transition-colors">
              <ArrowLeft size={16} className="text-gray-400 group-hover:text-emerald-600" />
            </div>
            Back to News
          </Link>
          
          {/* Share Button with Feedback */}
          <div className="relative">
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Share article"
            >
              <Share2 size={20} />
            </button>
            {/* Link Copied Feedback Pop-up */}
            {shareStatus === 'copied' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50"
              >
                Link Copied!
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pb-24"
      >
        {/* Header Section */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6 font-medium">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-emerald-600" />
              {publishedDate}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1.5 text-emerald-600" />
              {readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-snug mb-6">
            {news.title}
          </h1>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-xl shadow-gray-300">
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Article Content - **IMPROVED READABILITY HERE** */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
  className="
    relative z-10
    text-black !text-black
    prose prose-xl max-w-none

    prose-headings:text-black 
    prose-p:text-black 
    prose-li:text-black 
    prose-strong:text-black 
    prose-a:text-black

    prose-headings:font-extrabold prose-headings:tracking-tight
    prose-p:leading-relaxed
    prose-a:no-underline hover:prose-a:underline
    prose-img:rounded-2xl prose-img:shadow-2xl
    prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 
    prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-6 
    prose-blockquote:not-italic prose-blockquote:text-emerald-800 
    prose-blockquote:rounded-r-lg
  "
  dangerouslySetInnerHTML={{ __html: news.content }}
/>


          {/* Footer / Tags (Placeholder) */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 italic">
              Published in News • {publishedDate}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
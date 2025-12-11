'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {  BookOpenText } from 'lucide-react'; 
import { Audiowide } from 'next/font/google';

import {
  ArrowRight, BookOpen, Users, Target, Newspaper,
   Share2,
  Play, Heart, Eye, Calendar, Quote, ExternalLink, 
  Film, Award, Globe
} from 'lucide-react';

// Font loader must be called at module scope
const audiowide = Audiowide({
  weight: '400', // Audiowide only supports the 400 weight
  subsets: ['latin'],
  // This creates a CSS variable that Tailwind will use: --font-audiowide
  variable: '--font-audiowide', 
});

export default function Home() {
  // State Management
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [contentData, setContentData] = useState(null);
  const [advisoryMembers, setAdvisoryMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [likedArticleIds, setLikedArticleIds] = useState([]);
  const [viewedArticleIds, setViewedArticleIds] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  
  const handleShare = async (article) => {
    // 1. Check for essential data
    if (!article || !article._id) {
        // Use a placeholder toast if the real one isn't available
        typeof toast !== 'undefined' && toast.error("Cannot share: Article data is missing.");
        return;
    }

    // 2. Determine the full, sharable URL
    // This assumes the Next.js app is running and window.location.origin is correct.
    const articleUrl = `${window.location.origin}/articles/${article._id}`;

    // 3. Use the native Web Share API (best for mobile devices)
    if (navigator.share) {
        try {
            await navigator.share({
                title: article.title,
                text: article.subtitle || 'Check out this latest insight!',
                url: articleUrl,
            });
            // Native share sheet handles feedback
        } catch (error) {
            if (error.name !== 'AbortError') { // Ignore user cancellation
                console.error('Error sharing:', error);
                typeof toast !== 'undefined' && toast.error('Sharing failed.');
            }
        }
    } else {
        // 4. Fallback for desktop/unsupported browsers: Copy link to clipboard
        try {
            await navigator.clipboard.writeText(articleUrl);
            typeof toast !== 'undefined' && toast.success('Article link copied to clipboard!');
        } catch (err) {
            console.error('Could not copy to clipboard:', err);
            typeof toast !== 'undefined' && toast.error('Failed to copy link.');
        }
    }
};

  // Effects
  useEffect(() => {
    fetchAllData();
    if (typeof window !== 'undefined') {
      setLikedArticleIds(JSON.parse(localStorage.getItem('likedArticles') || '[]'));
      setViewedArticleIds(JSON.parse(localStorage.getItem('viewedArticles') || '[]'));
    }
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Data Fetching
  const fetchAllData = async () => {
    try {
      const [contentRes, bannerRes, newsRes, videoRes, articleRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/banner'),
        fetch('/api/news'),
        fetch('/api/video'),
        fetch('/api/articles?limit=6'),
      ]);

      if (contentRes.ok) {
        const data = await contentRes.json();
        setContentData(data.content || null);
        setAdvisoryMembers(data.advisory || []);
      }
      if (bannerRes.ok) {
        const data = await bannerRes.json();
        setBanners(data.banners || []);
      }
      if (newsRes.ok) {
        const data = await newsRes.json();
        setNews(data.news || []);
      }
      if (videoRes.ok) {
        const data = await videoRes.json();
        const videoList = data.videos || [];
        setVideos(videoList);
        if (videoList.length > 0) setActiveVideo(videoList[0]);
      }
      if (articleRes.ok) {
        const data = await articleRes.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const formatCount = (value = 0) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return new Intl.NumberFormat('en-US', { notation: "compact" }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Interactions
  const handleArticleLike = async (article) => {
    if (!article?._id || likedArticleIds.includes(article._id)) {
      if (likedArticleIds.includes(article._id)) toast.success("Already liked!");
      return;
    }
    const newLiked = [...likedArticleIds, article._id];
    setLikedArticleIds(newLiked);
    localStorage.setItem('likedArticles', JSON.stringify(newLiked));
    setArticles(prev => prev.map(a => a._id === article._id ? { ...a, likes: (a.likes || 0) + 1 } : a));
    toast.success('Thank you for your appreciation');

    try {
      await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article._id, action: 'like' }),
      });
    } catch (e) { console.error(e); }
  };

  const handleArticleView = (article) => {
    if (!article?._id || viewedArticleIds.includes(article._id)) return;
    const newViewed = [...viewedArticleIds, article._id];
    setViewedArticleIds(newViewed);
    localStorage.setItem('viewedArticles', JSON.stringify(newViewed));
    fetch('/api/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article._id, action: 'view' }),
    }).catch(console.error);
  };

  const isRTL = (language = '') =>
    /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());
  // Article logic
  const featuredArticle = articles[0];
  const supportingArticles = articles.slice(1, 4);

  // News logic
  const latestNews = news.length > 0 ? news[0] : null;
  const recentNews = news.slice(1, 4);

  // Video playlist
  const videoPlaylist = videos.filter(v => v._id !== activeVideo?._id).slice(0, 3);

  // Stats data
  
  const colors = {
    background: 'bg-stone-50', // Light cream background
    primaryText: 'text-amber-950',
    secondaryText: 'text-stone-700',
    ctaPrimary: 'bg-amber-500', // Gold/Orange for CTA
    ctaHover: 'bg-amber-600',
    accent: 'text-amber-400',
    accent2: 'text-amber-500',
    waterWave: 'bg-teal-700', // Deep teal for the bottom wave visual
  };

   const spinnerSize = 'w-12 h-12';
  const innerSpinnerSize = 'w-10 h-10'; // Slightly smaller inner ring

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50"> 
        {/* Spinner Container */}
        <div className="relative">
          {/* Outer Ring: Slow spin, main amber color, thick border */}
          <div 
            className={`${spinnerSize} border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin`}
            style={{ animationDuration: '1.5s' }}
          ></div>
          
          {/* Inner Ring: Faster spin, secondary color (darker amber/brown), thinner border, offset */}
          <div 
            className={`absolute inset-0 m-1 border-3 border-transparent border-r-amber-700 rounded-full animate-spin`}
            // Inline styles for precise control on size and border-width (since Tailwind utility for border-3 is not default)
            style={{ 
              animationDirection: 'reverse', 
              animationDuration: '1.0s',
              top: '2px', left: '2px', right: '2px', bottom: '2px',
              borderWidth: '3px',
              width: innerSpinnerSize,
              height: innerSpinnerSize
            }}
          ></div>
        </div>
        
        {/* Loading Text - Use dark brown text for contrast */}
        <p className="text-amber-900 text-xs font-semibold uppercase tracking-widest mt-4">
          Loading Excellence...
        </p>
        
        {/* Subtle Progress Bar (Optional: adds a nice modern touch) */}
        <div className="mt-4 w-32 h-1 bg-amber-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full animate-pulse" 
            style={{ width: '40%' }} // You can simulate a changing width here if needed
          ></div>
        </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION */}
     <section className={`relative h-screen min-h-[600px] overflow-hidden ${colors.background}`}>
      {/* 
      <div className={`absolute bottom-0 left-0 right-0 h-40 ${colors.waterWave} z-20`}>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-[50%] blur-sm" />
      </div>
      */}
      {/* Wave/Base Visual (Inspired by the bottom of the image) - HAS BEEN REMOVED */}


      {/* Background Ornaments (Inspired by the starbursts in the image) */}
      <div className={`hidden lg:block absolute top-10 right-10 ${colors.accent} opacity-50`}>
         {/* Simple starburst representation (could be a custom SVG) */}
         <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-45" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform -rotate-45" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-0" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-90" />
         </div>
      </div>
      <div className={`hidden lg:block absolute bottom-40 left-10 ${colors.accent} opacity-50`}>
        <div className="w-12 h-12 relative transform rotate-12">
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-45" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform -rotate-45" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-0" />
            <div className="absolute inset-0 border-r-2 border-amber-400 transform rotate-90" />
         </div>
      </div>


      {/* Hero Content - Centered */}
      <div className="relative z-30 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        {/* Adjusted pb-40 to pb-0 since the bottom wave is gone, centering content better */}
        <div className="max-w-4xl mx-auto pb-0 sm:pb-0"> 
          
          {/* Logo/Icon (Placeholder for the ship icon in the image) */}
          <div className="mb-6 mx-auto text-7xl text-amber-900">
            {/* Replace with your actual logo (e.g., the ship SVG) */}
            <BookOpenText size={72} className="mx-auto text-amber-900" /> 
          </div>

          {/* Subtitle/Tag - Similar to "Showcasing Islamic Art & Culture" in the image */}
          <p className={`text-base sm:text-lg font-medium tracking-widest uppercase mb-2 ${colors.secondaryText}`}>
            Excellence in Education
          </p>

          {/* Main Title - Centered and large */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl ${audiowide.className} ${colors.primaryText} leading-none mb-4 font-bold tracking-tight`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1), -1px -1px 0px rgba(255,255,255,0.5)' }}>
            Iqra Dars
            <br className="sm:hidden" />
            <span className={`text-4xl sm:text-5xl md:text-6xl font-bold block mt-1 text-amber-700`}>
               Udinur & Padanna
            </span>
          </h1>

          {/* Description - Shorter, centered, max-width constrained */}
          <p className={`text-base sm:text-lg ${colors.secondaryText} mb-10 leading-relaxed max-w-2xl mx-auto font-normal`}>
            {contentData?.description || "Dedicated to spreading knowledge, faith, and wisdom through comprehensive Islamic education and modern academic excellence."}
          </p>

          {/* Single Call to Action - Styled like the "Click to Dive In" button */}
          <Link href="/contact" className="inline-block">
            <button 
                className={`
                    group 
                    px-10 py-3 sm:px-12 sm:py-4         /* Adjust padding for a wider, taller button */
                    bg-amber-500                       /* Gold/Yellow background color */
                    text-amber-900                     /* Dark/Black text color */
                    font-bold                          /* Bold text */
                    rounded-xl                       /* Very rounded/pill shape */
                    
                    /* Custom Shadow: A combination of a standard shadow and a glowing bottom shadow */
                    shadow-lg 
                    shadow-amber-500/50 
                    
                    /* Optional: Add a subtle glow for the red/pink hint in the image */
                    relative
                    
                    /* Optional: Subtle hover effect for better UX */
                    hover:bg-amber-500 
                    hover:shadow-xl 
                    transition-all duration-200
                `}
            >
                {/* Remove the icon and change the text */}
                Click to Dive In
            </button>
        </Link>
          
          {/* The second button from your original code is removed for a simpler, focused professional look */}

        </div>
      </div>
      
      {/* Removed Banner Indicators as the design is static like the image */}
    </section>

     

      {/* MISSION SECTION */}
      <section className={`py-16 sm:py-24 ${colors.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* --- Content Column --- */}
            <div>
              {/* Tag/Badge - Amber Themed */}
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${colors.tagBackground} ${colors.accent2} text-sm font-bold uppercase tracking-widest mb-6 border border-amber-200`}>
                <Target size={16} />
                Our Mission
              </div>
              
              {/* Main Heading - Dark Brown/Black with Amber Accent */}
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${colors.primaryText} mb-6 leading-tight font-serif`}>
                Guiding Towards <span className={colors.accent}>Excellence</span>
              </h2>
              
              {/* Main Description - Made smaller (text-base) and standardized */}
              <p className={`${colors.secondaryText} text-base leading-relaxed mb-6 border-l-4 border-amber-300 pl-4`}>
                {contentData?.mission || "To illuminate hearts and minds with the light of Islamic knowledge, guiding individuals on the path of righteousness."}
              </p>
              
              {/* Secondary Detail - Made smaller (text-sm) and standardized */}
              <p className={`${colors.secondaryText} leading-relaxed text-sm mb-10`}>
                We nurture highly qualified Islamic scholars through comprehensive structured education, preserving cultural heritage while guiding students toward bilingual proficiency.
              </p>

              {/* REMOVED: Learn More About Our Vision link/section */}
            </div>
            
            {/* --- Image Column --- */}
            <div className="relative h-72 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/10 transform hover:scale-[1.01] transition-transform duration-500 ease-out">
              <Image 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800" 
                alt="Mission - Books and Knowledge" 
                fill
                className="object-cover"
              />
              {/* Darker, Earthy Overlay for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-amber-900/10" />
              {/* Optional: Add a subtle overlay text or element for visual interest */}
              <div className="absolute bottom-6 left-6 p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-bold text-sm uppercase tracking-widest">
                Knowledge & Wisdom
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
     <section className={`py-16 sm:py-24 ${colors.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ... Header Section (No RTL change needed here) ... */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${colors.tagBackground} ${colors.accent} text-sm font-bold uppercase tracking-widest mb-4 border border-amber-200`}>
                <BookOpen size={16} />
                Insights
              </div>
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${colors.primaryText} leading-tight font-serif`}>
                Latest <span className={colors.accent}>Writings</span>
              </h2>
            </div>
            <Link href="/articles">
              <button className={`flex items-center gap-2 px-6 py-3 rounded-full ${colors.ctaPrimary} text-amber-950 hover:${colors.ctaHover} transition-all text-sm font-bold shadow-md shadow-amber-500/30`}>
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* --- Articles Grid --- */}
          {articles.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Featured Article */}
              {featuredArticle && (
                // This entire block replaces the Featured Article section within your grid

// This entire block replaces the Featured Article section within your grid

<div className="lg:row-span-2">
  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-amber-900/10 border border-stone-200 h-full flex flex-col">
    <Link
      href={`/articles/${featuredArticle._id}`}
      onClick={() => handleArticleView(featuredArticle)}
      // Make the entire card block interactive to compensate for removing the footer link
      className="group block relative flex-grow aspect-[4/5] sm:aspect-[1/1] lg:aspect-auto rounded-b-none overflow-hidden hover:opacity-95 transition-opacity duration-300"
      // *** RTL FIX: dir attribute on the Link for text flow/alignment ***
      dir={isRTL(featuredArticle.language) ? 'rtl' : 'ltr'}
    >
      {/* --- 1. Image Area (The main visual) --- */}
      <div className="relative w-full h-full min-h-[400px]"> {/* Re-adding a min-height for structure */}
        <Image 
          src={featuredArticle.bannerUrl || '/placeholder.jpg'} 
          alt={featuredArticle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Subtle Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-transparent to-transparent" />

        {/* --- Title & Tag Overlay --- */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 pt-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            {featuredArticle.type || 'Featured Insight'}
          </span>
          {/* FIX 2: Apply text-right for the title alignment */}
          <h3 className={`text-3xl sm:text-4xl font-extrabold text-white leading-tight ${isRTL(featuredArticle.language) ? 'text-right' : 'text-left'}`}>
            {featuredArticle.title}
          </h3>
        </div>
      </div>
    </Link>

    {/* --- 2. Professional Social Action Bar --- */}
    <div className={`p-5 flex flex-col gap-4 border-t border-stone-100`}>
      
      {/* Author and Date (Top of the 'caption' area) */}
      <div className={`flex items-center gap-3 ${isRTL(featuredArticle.language) ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
        <div className={`flex items-center gap-3 ${isRTL(featuredArticle.language) ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shadow-sm">
                {featuredArticle.author?.[0] || 'A'}
            </div>
            <div>
                <p className="font-bold text-amber-900 leading-none">{featuredArticle.author || "Editorial Team"}</p>
                <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{featuredArticle.language || 'English'}</p>
            </div>
        </div>
        <span className="text-xs text-stone-500 whitespace-nowrap">{featuredArticle.createdAt ? formatDate(featuredArticle.createdAt) : 'N/A'}</span>
      </div>

      {/* Social Bar (Likes, Views, Share) */}
      <div className="flex justify-between items-center pt-3 border-t border-stone-100">
        
        <div className="flex items-center gap-6 text-stone-500">
          {/* Likes Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleArticleLike(featuredArticle);
            }}
            className={`flex items-center gap-2 text-sm font-semibold hover:text-red-500 transition-colors ${likedArticleIds.includes(featuredArticle._id) ? 'text-red-500' : 'text-stone-700'}`}
          >
            <Heart size={20} className={likedArticleIds.includes(featuredArticle._id) ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
            {formatCount(featuredArticle.likes)}
          </button>
          
          {/* Views Display */}
          <span className="flex items-center gap-2 text-sm font-semibold text-stone-700">
            <Eye size={20} className="text-stone-400" />
            {formatCount(featuredArticle.views)}
          </span>
        </div>
        
        {/* Share Button (ACTION IMPLEMENTED HERE) */}
        <button
            onClick={(e) => {
                e.preventDefault();
                // Call the handleShare function, passing the featuredArticle data
                handleShare(featuredArticle);
            }}
            className="p-1.5 rounded-full text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            aria-label="Share Article"
        >
            <Share2 size={20} />
        </button>
      </div>
    </div>
  </div>
</div>
              )}

              {/* Supporting Articles */}
              {supportingArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article._id}`}
                  onClick={() => handleArticleView(article)}
                  // *** FIX 3: Apply dir="rtl" to the supporting article container ***
                  dir={isRTL(article.language) ? 'rtl' : 'ltr'}
                  className="group flex gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-stone-100 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300"
                >
                  {/* Image: Flex order is handled by dir="rtl" on parent (Image will move to the right) */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200">
                    <Image 
                      src={article.bannerUrl || '/placeholder.jpg'} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content Area - Apply text alignment for inner content */}
                  <div className={`flex-1 min-w-0 ${isRTL(article.language) ? 'text-right' : 'text-left'}`}>
                    
                    <span className={`text-xs font-bold ${colors.accent} uppercase mb-1 block tracking-wider`}>
                      {article.language}
                    </span>
                    
                    {/* FIX 4: Ensure title alignment is correct */}
                    <h4 className={`text-lg font-bold ${colors.primaryText} mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors`}>
                      {article.title}
                    </h4>
                    
                    {/* Footer Details - Use justify-end when RTL to push LTR icons to the right */}
                    <div className={`flex items-center gap-3 text-xs text-stone-500 ${isRTL(article.language) ? 'justify-end' : ''}`}>
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {formatCount(article.views)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleArticleLike(article);
                        }}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart size={14} className={likedArticleIds.includes(article._id) ? 'fill-red-500 text-red-500' : ''} />
                        {formatCount(article.likes)}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner">
              <BookOpen size={48} className="mx-auto text-amber-300 mb-4" />
              <p className="text-stone-500 font-semibold">No writings available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ADVISORY BOARD */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Users size={14} />
              Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Advisory <span className="text-emerald-600">Board</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              Guided by esteemed scholars and community leaders
            </p>
          </div>

          {advisoryMembers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {advisoryMembers.map((member, idx) => (
                <div key={idx} className="group text-center">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image 
                        src={member.image || 'https://via.placeholder.com/150'} 
                        alt={member.name} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{member.name}</h3>
                  <span className="text-xs sm:text-sm text-emerald-600 font-semibold uppercase tracking-wide">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-semibold">Advisory board members coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* MEDIA GALLERY */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Film size={14} />
                Multimedia
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                Campus <span className="text-emerald-600">Gallery</span>
              </h2>
            </div>
            <Link href="/gallery">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-sm font-semibold">
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Video Section */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Film className="text-white" size={20} />
                </div>
                Video Spotlight
              </h3>
              
              {activeVideo ? (
                <>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}`}
                      className="w-full h-full"
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{activeVideo.title}</h4>
                    <p className="text-slate-600">Watch our latest events and campus highlights</p>
                  </div>

                  {videoPlaylist.length > 0 && (
                    <div className="space-y-3">
                      {videoPlaylist.map((video) => (
                        <button
                          key={video._id}
                          onClick={() => setActiveVideo(video)}
                          className="w-full flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                        >
                          <div className="relative w-24 sm:w-32 h-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                            {getYouTubeId(video.youtubeUrl) && (
                              <Image 
                                src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play size={24} className="text-white fill-white" />
                            </div>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h5 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-600 line-clamp-2 transition-colors">
                              {video.title}
                            </h5>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                  <Film size={48} className="text-slate-300 mb-4" />
                  <p className="text-slate-500 font-semibold">No videos available.</p>
                </div>
              )}
            </div>

            {/* News Section */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Newspaper className="text-white" size={20} />
                </div>
                Latest Updates
              </h3>

              {latestNews ? (
                <>
                  <Link href={`/news/${latestNews.slug}`} className="group block relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-2xl">
                    <Image 
                      src={latestNews.thumbnail} 
                      alt={latestNews.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase mb-3">
                        Featured News
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {latestNews.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar size={14} />
                        <span>{formatDate(latestNews.createdAt)}</span>
                      </div>
                    </div>
                  </Link>

                  {recentNews.length > 0 && (
                    <div className="space-y-4">
                      {recentNews.map((newsItem) => (
                        <Link
                          key={newsItem._id}
                          href={`/news/${newsItem.slug}`}
                          className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                        >
                          <div className="relative w-24 sm:w-28 h-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image 
                              src={newsItem.thumbnail || '/placeholder.jpg'} 
                              alt={newsItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                              <Calendar size={12} />
                              <span>{formatDate(newsItem.createdAt)}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors mb-2">
                              {newsItem.title}
                            </h4>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              Read More <ExternalLink size={10} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-10 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <div>
                    <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-semibold">No news available.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-teal-900/10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Users size={14} />
            Join Us
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Community</span>
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            Embark on a path of knowledge, wisdom, and spiritual growth. The doors to excellence are open.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <button className="w-full sm:w-auto group px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white transition-all shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50">
                Contact Admissions
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white/50 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {  BookOpenText } from 'lucide-react'; 
import { Audiowide } from 'next/font/google';

import {
  ArrowRight, BookOpen, Users, Target, Newspaper,
   Share2,ShieldCheck, Linkedin ,
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
          <div className=" mx-auto text-7xl text-amber-900">
            {/* Replace with your actual logo (e.g., the ship SVG) */}
            <img className="mx-auto text-amber-900 h-50 w-50" src='/icon.png'/>
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
          <p className={`text-base sm:text-lg ${colors.secondaryText} mb-9 leading-relaxed max-w-2xl mx-auto font-normal`}>
            {contentData?.description || "Dedicated to spreading knowledge, faith, and wisdom through comprehensive Islamic education and modern academic excellence."}
          </p>

          {/* Single Call to Action - Styled like the "Click to Dive In" button */}
    
          
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

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${colors.tagBackground} ${colors.accent} text-xs font-bold uppercase tracking-widest mb-4 border border-amber-200/50`}>
                    <BookOpen size={14} />
                    <span>Insights</span>
                </div>
                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${colors.primaryText} leading-[1.1] font-serif`}>
                    Latest <span className={colors.accent}>Writings</span>
                </h2>
            </div>
            
            <Link href="/articles" className="shrink-0">
                <button className={`group flex items-center gap-2 px-6 py-3 rounded-full ${colors.ctaPrimary} text-amber-950 hover:${colors.ctaHover} transition-all duration-300 text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5`}>
                    <span>View All</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
            </Link>
        </div>

        {/* --- Main Content Grid --- */}
        {articles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                
                {/* === LEFT COLUMN: Featured Article === */}
                {featuredArticle && (
                    <div className="w-full h-full flex flex-col">
                        <div 
                            className="relative flex-1 bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col group transition-all hover:shadow-2xl hover:shadow-amber-900/10"
                            dir={isRTL(featuredArticle.language) ? 'rtl' : 'ltr'}
                        >
                            <Link
                                href={`/articles/${featuredArticle._id}`}
                                onClick={() => handleArticleView(featuredArticle)}
                                className="flex-1 flex flex-col relative"
                            >
                                {/* Image Container - Takes available height but keeps min-height */}
                                <div className="relative w-full min-h-[300px] flex-grow overflow-hidden">
                                    <Image
                                        src={featuredArticle.bannerUrl || '/placeholder.jpg'}
                                        alt={featuredArticle.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Gradient for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    
                                    {/* Overlay Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                        <span className="inline-block px-3 py-1 mb-3 rounded-md bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider">
                                            {featuredArticle.type || 'Featured'}
                                        </span>
                                        <h3 className="text-1xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">
                                            {featuredArticle.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>

                            {/* Meta Data Footer (Outside image for cleaner look) */}
                            <div className="p-5 sm:p-6 bg-white border-t border-stone-100">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-3">
                                       
                                        <div className="flex flex-col">
                                            <span className="text-sm  text-stone-800 leading-none">
                                                {featuredArticle.author || "Editorial"}
                                            </span>
                                            <span className="text-xs text-stone-400 mt-1 font-medium">
                                                {featuredArticle.createdAt ? formatDate(featuredArticle.createdAt) : 'Recently'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Interaction Actions */}
                                    <div className="flex items-center gap-4 text-stone-400">
                                         {/* Like */}
                                         <button
                                            onClick={(e) => { e.preventDefault(); handleArticleLike(featuredArticle); }}
                                            className={`flex items-center gap-1.5 text-sm transition-colors ${likedArticleIds.includes(featuredArticle._id) ? 'text-red-500 font-normal' : 'hover:text-amber-600'}`}
                                        >
                                            <Heart size={18} className={likedArticleIds.includes(featuredArticle._id) ? 'fill-current' : ''} />
                                            <span>{formatCount(featuredArticle.likes)}</span>
                                        </button>
                                        
                                        {/* Share */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleShare(featuredArticle); }}
                                            className="p-2 rounded-full hover:bg-stone-50 hover:text-amber-600 transition-colors"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === RIGHT COLUMN: Supporting Articles List === */}
                <div className="flex flex-col gap-5 h-full">
                    {supportingArticles.map((article) => (
                        <Link
                            key={article._id}
                            href={`/articles/${article._id}`}
                            onClick={() => handleArticleView(article)}
                            dir={isRTL(article.language) ? 'rtl' : 'ltr'}
                            className="group relative flex flex-row items-stretch bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-32 sm:w-40 shrink-0 overflow-hidden">
                                <Image
                                    src={article.bannerUrl || '/placeholder.jpg'}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-bold ${colors.accent2} uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-sm`}>
                                            {article.language || 'Article'}
                                        </span>
                                        {/* Views - subtle */}
                                        <span className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                                            <Eye size={12} /> {formatCount(article.views)}
                                        </span>
                                    </div>
                                    
                                    <h4 className={`text-sm  ${colors.primaryText} leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors`}>
                                        {article.title}
                                    </h4>
                                </div>

                                {/* Footer (Date & Like) */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-50">
                                    <span className="text-xs text-stone-400 font-medium">
                                        {article.createdAt ? formatDate(article.createdAt) : ''}
                                    </span>
                                    
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleArticleLike(article); }}
                                        className={`flex items-center gap-1 text-xs  transition-colors ${likedArticleIds.includes(article._id) ? 'text-red-500' : 'text-stone-400 hover:text-amber-600'}`}
                                    >
                                        <Heart size={14} className={likedArticleIds.includes(article._id) ? 'fill-current' : ''} />
                                        {formatCount(article.likes)}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Empty slot filler if needed (Optional: helps visual balance if list is short) */}
                    {supportingArticles.length < 3 && (
                        <div className="flex-1 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 flex items-center justify-center text-stone-400 text-sm font-medium min-h-[100px]">
                            More coming soon...
                        </div>
                    )}
                </div>

            </div>
        ) : (
            /* --- Empty State --- */
            <div className="flex flex-col items-center justify-center py-24 bg-stone-50 rounded-3xl border border-stone-200 border-dashed">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <BookOpen size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800">No writings found</h3>
                <p className="text-stone-500 mt-2">Check back later for new insights.</p>
            </div>
        )}
    </div>
</section>

      {/* ADVISORY BOARD */}
     <section className="py-16 sm:py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header (Kept consistent with your flow) --- */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={12} />
            <span>Leadership</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 mb-4 font-serif leading-tight">
            Advisory <span className="text-amber-500">Board</span>
          </h2>
          
          <p className="text-sm sm:text-base text-stone-500 font-medium">
            Guided by esteemed scholars and industry veterans.
          </p>
        </div>

        {/* --- Members Grid --- */}
        {advisoryMembers.length > 0 ? (
          /* 
             grid-cols-2 : Shows 2 items per row on mobile (small devices) 
             gap-3       : Smaller gap on mobile to fit 2 columns comfortably
          */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {advisoryMembers.map((member, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-100 shadow-sm hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 hover:-translate-y-1"
              >
                
                {/* Decorative background gradient (Subtle) */}
                <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-amber-50/40 to-transparent rounded-t-2xl sm:rounded-t-3xl opacity-50" />

                {/* Profile Image - Smaller on mobile */}
                <div className="relative mx-auto mb-3 sm:mb-5 w-20 h-20 sm:w-28 sm:h-28">
                   {/* Hover Ring Effect */}
                  <div className="absolute -inset-1.5 rounded-full border border-dashed border-amber-300 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
                  
                  <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-sm group-hover:shadow-md transition-all">
                    <Image 
                      src={member.image || 'https://via.placeholder.com/150'} 
                      alt={member.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                </div>

                {/* Text Content - Refined & Smaller */}
                <div className="text-center relative z-10">
                  {/* Name: Removed bold, used font-medium, smaller text */}
                  <h3 className="text-sm sm:text-base font-medium text-stone-900 mb-1 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {member.name}
                  </h3>
                  
                  {/* Decorative Dash: Smaller */}
                  <div className="h-0.5 w-4 bg-amber-200 mx-auto my-2 rounded-full group-hover:w-8 transition-all duration-300" />
                  
                  {/* Role: Smaller, lighter weight */}
                  <span className="block text-[10px] sm:text-xs text-amber-600 font-medium uppercase tracking-wide line-clamp-2 min-h-[1.5em]">
                    {member.role}
                  </span>
                </div>

                {/* Optional: Social Icon (Hidden on mobile usually to save space, or keeps tiny) */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-1.5 bg-white rounded-full text-blue-600 shadow-sm border border-stone-100">
                        <Linkedin size={12} />
                    </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-stone-200 border-dashed shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
              <Users size={24} className="text-stone-300" />
            </div>
            <p className="text-sm font-medium text-stone-500">Board members coming soon.</p>
          </div>
        )}
      </div>
    </section>

      {/* MEDIA GALLERY */}
       <section className="py-16 sm:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- Section Header --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold uppercase tracking-widest mb-4">
                <Film size={14} />
                <span>Multimedia & News</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.1] font-serif">
                Campus <span className="text-amber-500">Highlights</span>
              </h2>
            </div>
            
            <Link href="/gallery" className="shrink-0">
                <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white hover:bg-amber-500 hover:text-black transition-all duration-300 text-sm font-bold shadow-lg shadow-stone-300 hover:shadow-amber-500/30 hover:-translate-y-0.5">
                    <span>View Gallery</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* === COLUMN 1: Video Spotlight === */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                 <div className="w-2 h-8 bg-amber-400 rounded-full" />
                 <h3 className="text-2xl font-bold text-stone-800 font-serif">Video Spotlight</h3>
              </div>
              
              {activeVideo ? (
                <>
                  {/* Main Video Player */}
                  <div className="group relative bg-white p-2 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50">
                    <div className="aspect-video relative rounded-2xl overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}`}
                        className="w-full h-full"
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                        <h4 className="text-lg sm:text-xl  text-stone-900 leading-tight mb-2">
                            {activeVideo.title}
                        </h4>
                        <p className="text-stone-500 text-sm">Featured Campus Event</p>
                    </div>
                  </div>

                  {/* Playlist */}
                  {videoPlaylist.length > 0 && (
                    <div className="space-y-4">
                      {videoPlaylist.map((video) => (
                        <button
                          key={video._id}
                          onClick={() => setActiveVideo(video)}
                          className={`w-full flex gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 group text-left
                            ${activeVideo._id === video._id 
                                ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200' 
                                : 'bg-white border-stone-100 hover:border-amber-300 hover:shadow-md'
                            }`}
                        >
                          <div className="relative w-24 sm:w-32 h-16 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-200">
                            {getYouTubeId(video.youtubeUrl) && (
                              <Image 
                                src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                alt={video.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-sm">
                                <Play size={14} className="text-amber-600 fill-amber-600" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1 py-1">
                            <h5 className={`text-sm font-bold line-clamp-2 mb-1 ${activeVideo._id === video._id ? 'text-amber-800' : 'text-stone-800 group-hover:text-amber-700'}`}>
                              {video.title}
                            </h5>
                            <span className="text-xs text-stone-400 font-medium">Watch Now</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Empty State Video */
                <div className="aspect-video bg-white rounded-3xl flex flex-col items-center justify-center border border-dashed border-stone-200 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                     <Film size={24} className="text-stone-300" />
                  </div>
                  <p className="text-stone-500 font-medium">No videos available currently.</p>
                </div>
              )}
            </div>

            {/* === COLUMN 2: Latest Updates (News) === */}
            <div className="space-y-8">
               <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                 <div className="w-2 h-8 bg-stone-800 rounded-full" />
                 <h3 className="text-2xl font-bold text-stone-800 font-serif">Latest Updates</h3>
              </div>

              {latestNews ? (
                <>
                  {/* Featured News Card */}
                  <Link href={`/news/${latestNews.slug}`} className="group block relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100">
                    <Image 
                      src={latestNews.thumbnail || '/placeholder.jpg'} 
                      alt={latestNews.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <span className="inline-block px-3 py-1 rounded-md bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider mb-3 shadow-sm">
                        Featured News
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight group-hover:underline decoration-amber-400 decoration-2 underline-offset-4">
                        {latestNews.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-stone-300 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-amber-400" />
                            {formatDate(latestNews.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Recent News List */}
                  {recentNews.length > 0 && (
                    <div className="space-y-4">
                      {recentNews.map((newsItem) => (
                        <Link
                          key={newsItem._id}
                          href={`/news/${newsItem.slug}`}
                          className="flex gap-4 p-4 bg-white rounded-2xl border border-stone-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 group"
                        >
                          <div className="relative w-24 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                            <Image 
                              src={newsItem.thumbnail || '/placeholder.jpg'} 
                              alt={newsItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1.5">
                              <Calendar size={12} />
                              <span>{formatDate(newsItem.createdAt)}</span>
                            </div>
                            
                            <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">
                              {newsItem.title}
                            </h4>
                            
                            <span className="text-xs text-amber-600 font-bold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              Read News <ArrowRight size={10} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Empty State News */
                <div className="h-full min-h-[300px] flex items-center justify-center p-10 text-center bg-white rounded-3xl border border-dashed border-stone-200">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-4">
                        <Newspaper size={24} className="text-stone-300" />
                    </div>
                    <p className="text-stone-500 font-medium">No updates available at the moment.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      
    </div>
  );
}
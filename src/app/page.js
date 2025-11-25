'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  ArrowRight, BookOpen, Users, Target, Newspaper, 
  Play, ChevronLeft, ChevronRight, Feather, Heart, 
  Eye, Calendar, Quote, ExternalLink, Film 
} from 'lucide-react';

// --- CSS FOR CUSTOM FONT & UTILITIES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :root {
    --font-stack: 'Stack Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
`;


export default function Home() {
  // --- State Management ---
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
  
  // NEW: State for the Active Video Player
  const [activeVideo, setActiveVideo] = useState(null);

  // --- Effects ---
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
      }, 7000); 
      return () => clearInterval(interval);
    }
  }, [banners]);

  // --- Data Fetching ---
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
        // Set the first video as active initially
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

  // --- Helpers ---
  const nextBanner = () => setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  const formatCount = (value = 0) => new Intl.NumberFormat('en-US', { notation: "compact" }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // --- Interactions ---
  const handleArticleLike = async (article) => {
    if (!article?._id || likedArticleIds.includes(article._id)) {
        if(likedArticleIds.includes(article._id)) toast.success("Already liked!");
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

  // --- Logic for Media Gallery ---
  const featuredArticle = articles[0];
  const supportingArticles = articles.slice(1, 4);
  
  // News Logic
  const latestNews = news.length > 0 ? news[0] : null;
  const recentNews = news.slice(1, 4);

  // Video Playlist Logic: Filter out the one currently playing
  const videoPlaylist = videos.filter(v => v._id !== activeVideo?._id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-[3px] border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-stack selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{customStyles}</style>

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          {banners.length > 0 ? (
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={banners[currentBannerIndex].imageUrl}
                alt="Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-slate-900/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-slate-950" />
          )}
        </AnimatePresence>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
          <div className="max-w-4xl pt-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 text-xs font-bold tracking-[0.25em] uppercase text-shadow-sm">
                  Excellence in Education
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.0] tracking-tight mb-8">
                Iqra Dars <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-200 drop-shadow-sm">
                  Udinur & Padne
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-light mb-12 opacity-90 border-l-4 border-emerald-500 pl-6">
                {contentData?.description || "Dedicated to spreading knowledge, faith, and wisdom through comprehensive Islamic education and modern academic excellence."}
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contact" className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <button className="relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <span>Begin Journey</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <Link href="/organizations">
                  <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center tracking-wide">
                    View Structure
                  </button>
                </Link>
              </div>

            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-12 right-6 md:right-12 z-20 flex gap-3 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
           {banners.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentBannerIndex(idx)}
               className={`h-2 rounded-full transition-all duration-500 ease-out shadow-sm ${idx === currentBannerIndex ? 'w-10 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'}`}
             />
           ))}
        </div>
      </section>

      {/* 2. MISSION BENTO */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto relative z-20 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 transform group-hover:scale-110">
               <Target size={240} className="text-emerald-900" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <Target size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Our Core Mission</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl text-balance">
                {contentData?.mission || "To illuminate hearts and minds with the light of Islamic knowledge, guiding individuals on the path of righteousness."}
              </p>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-[#052e16] rounded-3xl p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-xl"
          >
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
             <div>
               <Users size={32} className="text-emerald-400 mb-6" strokeWidth={2} />
               <h3 className="text-2xl font-bold mb-2">UDSA Partner</h3>
               <p className="text-emerald-100/70 text-sm leading-relaxed">Strategic collaboration for community welfare and development.</p>
             </div>
             <div className="mt-8">
               <Link href="/organizations" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-white transition-colors uppercase tracking-wider">
                 View Organization <ExternalLink size={14} />
               </Link>
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="md:col-span-3 bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-10"
          >
             <div className="flex-shrink-0">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 border border-slate-100">
                 <BookOpen size={32} strokeWidth={1.5} />
               </div>
             </div>
             <div className="max-w-4xl">
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Academic Excellence</h3>
               <p className="text-slate-500 leading-relaxed text-balance">
                 We nurture highly qualified Islamic scholars (ʿUlamāʾ) through comprehensive structured education. Preserving cultural heritage while guiding students toward bilingual proficiency.
               </p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 3. EDITORIAL SECTION */}
      <section className="py-24 bg-white border-t border-slate-100">
  <div className="max-w-[1400px] mx-auto px-6 md:px-12">
    
    {/* Header */}
    <div className="flex items-end justify-between mb-16">
      <div>
        <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2 block">
          Insights
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          Articles & News
        </h2>
      </div>
      <Link 
        href="/articles" 
        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm font-bold"
      >
        View All Posts <ArrowRight size={16} />
      </Link>
    </div>

    <div className="grid lg:grid-cols-12 gap-12">
      
      {/* FEATURED ARTICLE (Big Card) */}
      {featuredArticle && (
        <div className="lg:col-span-7 h-full">
          <Link 
            href="/articles"
            className="group relative block h-full min-h-[500px] w-full rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-900/5"
          >
            {/* Background Image - Fixed fitting */}
            <Image 
              src={featuredArticle.bannerUrl || '/placeholder.jpg'} 
              alt={featuredArticle.title} 
              fill 
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105" 
              priority
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col justify-end h-full">
               <div className="mt-auto">
                  {/* Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
                      {featuredArticle.type || 'Featured'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:underline decoration-2 underline-offset-8 decoration-emerald-400">
                    {featuredArticle.title}
                  </h3>

                  {/* Metadata & Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                    
                    {/* Author & Date */}
                    <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shadow-lg">
                            {featuredArticle.author?.[0] || 'A'}
                         </div>
                         <span className="text-sm">{featuredArticle.author || "Editorial Team"}</span>
                      </div>
                      <span className="w-1 h-1 bg-white/50 rounded-full hidden sm:block"></span>
                      <span className="text-xs text-slate-300">{formatDate(featuredArticle.createdAt)}</span>
                    </div>

                    {/* View/Like Counts */}
                    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                       <span className="flex items-center gap-1.5 text-xs text-slate-200">
                          <Eye size={14} className="text-emerald-400"/> 
                          {formatCount(featuredArticle.views)}
                       </span>
                       <div className="w-px h-3 bg-white/20"></div>
                       <span className="flex items-center gap-1.5 text-xs text-slate-200">
                          <Heart size={14} className="text-red-400"/> 
                          {formatCount(featuredArticle.likes)}
                       </span>
                    </div>
                  </div>
               </div>
            </div>
          </Link>
        </div>
      )}

      {/* SIDEBAR LIST */}
      <div className="lg:col-span-5 flex flex-col gap-6">
         {supportingArticles.map((article) => (
           <Link 
             href="/articles"
             key={article._id} 
             className="group flex gap-5 items-start p-4 -mx-4 rounded-2xl hover:bg-slate-50 transition-all duration-300"
           >
              {/* Thumbnail */}
              <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                 <Image 
                   src={article.bannerUrl || '/placeholder.jpg'} 
                   alt={article.title} 
                   fill 
                   className="object-cover group-hover:scale-110 transition-transform duration-500" 
                 />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase mb-2 tracking-wider">
                    <Feather size={10} /> {article.language}
                 </div>
                 <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">
                    {article.title}
                 </h4>
                 <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                       <Eye size={12}/> {formatCount(article.views)}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-red-400 transition-colors">
                       <Heart size={12}/> {formatCount(article.likes)}
                    </span>
                 </div>
              </div>
           </Link>
         ))}
      </div>

    </div>
  </div>
</section>

      {/* 4. ADVISORY BOARD */}
       <section className="py-24 bg-slate-50 font-stack text-slate-900">

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Quote size={14} className="text-emerald-600" />
            <span>Leadership & Wisdom</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Scholarly Guidance
          </h2>
          
          <p className="text-slate-500 text-lg leading-relaxed font-normal">
            Our institution is steered by the strategic vision and spiritual oversight of esteemed scholars and community leaders.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advisoryMembers.length > 0 ? advisoryMembers.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-100 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Container with "Double Ring" effect */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {/* Outer Ring (animates color on hover) */}
                  <div className="absolute -inset-2 rounded-full border-[1.5px] border-slate-100 group-hover:border-emerald-200 transition-colors duration-500"></div>
                  
                  {/* The Image (Full Color) */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 shadow-inner">
                      <Image 
                        src={member.image || 'https://via.placeholder.com/150'} 
                        alt={member.name} 
                        fill 
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-110" 
                      />
                  </div>
                </div>

                {/* Text Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  <div className="flex justify-center">
                    <span className="inline-block px-3 py-1 rounded-md bg-slate-50 group-hover:bg-emerald-50 text-slate-500 group-hover:text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-slate-100 group-hover:border-emerald-100 transition-all duration-300">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Interactive Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-emerald-500 rounded-t-full transition-all duration-500 group-hover:w-16 opacity-0 group-hover:opacity-100"></div>
              </motion.div>
          )) : (
            <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <p className="font-medium">Advisory board members are being updated.</p>
            </div>
          )}
        </div>
      </div>
    </section>

      {/* 5. ADVANCED MEDIA GALLERY (Video + News) */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

         <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
            {/* Gallery Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-slate-100 pb-8">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                   <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase">Multimedia</span>
                 </div>
                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Campus Gallery</h2>
               </div>
               <Link href="/gallery" className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                  View All Media 
                  <div className="bg-slate-100 p-1.5 rounded-full group-hover:bg-emerald-100 transition-colors">
                    <ArrowRight size={14} />
                  </div>
               </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
               
               {/* LEFT: Video Player */}
               <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                     <Film className="text-emerald-500" size={20} />
                     <h3>Video Spotlight</h3>
                  </div>

                  {activeVideo ? (
                    <div className="space-y-6">
                       {/* Main Player */}
                       <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 group">
                          <iframe 
                             src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}?autoplay=0&rel=0`}
                             className="absolute inset-0 w-full h-full"
                             title={activeVideo.title}
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                          />
                       </div>
                       
                       {/* Details */}
                       <div>
                          <h4 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{activeVideo.title}</h4>
                          <p className="text-slate-500 text-sm line-clamp-2">Watch our latest events, lectures, and campus highlights.</p>
                       </div>

                       {/* Up Next List */}
                       {videoPlaylist.length > 0 && (
                         <div className="pt-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Up Next</p>
                            <div className="space-y-3">
                               {videoPlaylist.map((video) => (
                                  <div 
                                    key={video._id}
                                    onClick={() => setActiveVideo(video)}
                                    className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all duration-300 border border-transparent hover:border-slate-100"
                                  >
                                     <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 shadow-sm">
                                        {getYouTubeId(video.youtubeUrl) && (
                                          <Image 
                                            src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                            alt={video.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                          />
                                        )}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                           <div className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                              <Play size={12} fill="white" className="text-white ml-0.5" />
                                           </div>
                                        </div>
                                     </div>
                                     <div className="flex flex-col justify-center">
                                        <h5 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                          {video.title}
                                        </h5>
                                        <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                                          Play Now <ChevronRight size={10} />
                                        </span>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-50 rounded-3xl flex flex-col items-center justify-center text-slate-400 border border-slate-200 border-dashed">
                       <Film size={48} className="mb-4 opacity-20" />
                       <p>No videos available.</p>
                    </div>
                  )}
               </div>

               {/* RIGHT: News Feed */}
               <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                     <Newspaper className="text-emerald-500" size={20} />
                     <h3>Latest Updates</h3>
                  </div>

                  <div className="flex flex-col h-full gap-6">
                     {/* Featured News */}
                     {latestNews && (
                        <Link href={`/news/${latestNews.slug}`} className="group relative w-full h-72 rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50">
                           <Image 
                             src={latestNews.thumbnail} 
                             alt={latestNews.title} 
                             fill 
                             className="object-cover transition-transform duration-700 group-hover:scale-105" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
                           <div className="absolute bottom-0 left-0 p-8 w-full">
                              <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-full mb-3 shadow-md border border-emerald-500/50">
                                 Featured Story
                              </span>
                              <h3 className="text-2xl font-bold text-white leading-tight mb-2 group-hover:text-emerald-200 transition-colors">
                                 {latestNews.title}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                                 <Calendar size={14} />
                                 <span>{formatDate(latestNews.createdAt)}</span>
                              </div>
                           </div>
                        </Link>
                     )}

                     {/* Recent News List */}
                     <div className="flex-1 space-y-4">
                        {recentNews.length > 0 ? recentNews.map((item) => (
                           <Link 
                             key={item._id} 
                             href={`/news/${item.slug}`} 
                             className="flex gap-5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group items-center"
                           >
                              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-inner border border-slate-100">
                                 <Image 
                                   src={item.thumbnail || '/placeholder.jpg'} 
                                   alt={item.title} 
                                   fill 
                                   className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                 />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1.5">
                                    <Calendar size={12} className="text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                      {formatDate(item.createdAt)}
                                    </span>
                                 </div>
                                 <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                                    {item.title}
                                 </h4>
                                 <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                                    Read Full Story <ExternalLink size={12} className="ml-1" />
                                 </div>
                              </div>
                           </Link>
                        )) : (
                           <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                              No other recent updates found.
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. FOOTER CTA */}
      <section className="relative py-28 bg-[#111] text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-black to-black"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Join Our Community</h2>
           <p className="text-slate-400 text-lg mb-10 leading-relaxed">
             Embark on a path of knowledge, wisdom, and spiritual growth. The doors to excellence are open.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-emerald-400 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all duration-300">
                 Contact Admissions
              </Link>
              <Link href="/about" className="px-10 py-4 border border-zinc-700 text-white font-bold rounded-full hover:bg-zinc-800 transition-colors">
                 Learn More
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
}
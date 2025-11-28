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

// --- PREMIUM CSS FOR CUSTOM FONT & UTILITIES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-stack: 'Stack Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-serif: 'Playfair Display', serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
  }

  .premium-card {
    box-shadow: 
      0 20px 60px rgba(15, 23, 42, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-card-hover {
    box-shadow: 
      0 30px 80px rgba(16, 185, 129, 0.15),
      0 0 0 1px rgba(16, 185, 129, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 font-stack">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mt-6"
        >
          Loading Excellence...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 text-slate-900 font-stack selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{customStyles}</style>

      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }} 
      />

      {/* 1. PREMIUM HERO SECTION */}
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

        <div className="relative z-10 max-sm:pb-[100px] h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
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
                Iqra Dars <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-200 drop-shadow-sm">
                  Udinur & Padanna 
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-light mb-12 opacity-90 border-l-4 border-emerald-500 pl-6">
                {contentData?.description || "Dedicated to spreading knowledge, faith, and wisdom through comprehensive Islamic education and modern academic excellence."}
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contact" className="group relative">
                  <div className="absolute -inset-0.5 max-sm:-inset-0.5 max-sm:inset-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <button className="relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl">
                    <span>Begin Journey</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <Link href="/organizations">
                  <button className="px-8  py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center tracking-wide">
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

      {/* 2. PREMIUM MISSION BENTO */}
      <section className="py-32 px-4 md:px-12 lg:px-16 max-w-[1600px] mx-auto relative z-20 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl p-12 premium-card hover:premium-card-hover transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110">
              <Target size={280} className="text-emerald-900" />
            </div>
            <div className="relative px-  z-10">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-emerald-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Target size={28} strokeWidth={2.5} className="text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Our Core Mission</h2>
              <p className="text-slate-600 text-md leading-relaxed max-w-2xl text-balance font-light">
                {contentData?.mission || "To illuminate hearts and minds with the light of Islamic knowledge, guiding individuals on the path of righteousness."}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl premium-card"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-lg" />
                <Users size={36} className="relative text-emerald-400" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-3">UDSA Partner</h3>
              <p className="text-emerald-100/80 text-base leading-relaxed">Strategic collaboration for community welfare and development.</p>
            </div>
            <div className="mt-8 relative z-10">
              <Link href="/organizations" className="group/link inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-white transition-colors uppercase tracking-wider">
                View Organization <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 bg-white/90 backdrop-blur-sm rounded-3xl p-12 premium-card flex flex-col md:flex-row items-center gap-12 group hover:premium-card-hover transition-all duration-500"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center text-slate-700 border-2 border-slate-200 shadow-lg">
                <BookOpen size={40} strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex-1 max-w-4xl">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Academic Excellence</h3>
              <p className="text-slate-600 leading-relaxed text-balance text-lg font-light">
                We nurture highly qualified Islamic scholars (ʿUlamāʾ) through comprehensive structured education. Preserving cultural heritage while guiding students toward bilingual proficiency.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. PREMIUM EDITORIAL SECTION */}
      <section className="py-32 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">

          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-20"
          >
            <div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-6 premium-card">
                <div className="p-1.5 rounded-full bg-emerald-100">
                  <Feather size={12} className="text-emerald-600" />
                </div>
                <span>Insights</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                Articles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">News</span>
              </h2>
            </div>
            <Link
              href="/articles"
              className="hidden md:flex items-center gap-2 px-6 py-3.5 rounded-full glass-panel text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm font-bold premium-card group"
            >
              View All Posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/* PREMIUM FEATURED ARTICLE */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 h-full"
              >
                <Link
                  href={`/articles/${featuredArticle._id}`}
                  className="group relative block h-full min-h-[550px] w-full rounded-3xl overflow-hidden premium-card hover:premium-card-hover transition-all duration-500"
                >
                  {/* Background Image */}
                  <Image
                    src={featuredArticle.bannerUrl || '/placeholder.jpg'}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    priority
                  />

                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-10 lg:p-12 flex flex-col justify-end h-full">
                    <div className="mt-auto">
                      {/* Premium Badge */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="glass-panel border border-white/20 px-4 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                          {featuredArticle.type || 'Featured'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight group-hover:text-emerald-200 transition-colors">
                        {featuredArticle.title}
                      </h3>

                      {/* Premium Metadata & Stats */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">

                        {/* Author & Date */}
                        <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-emerald-500/50">
                              {featuredArticle.author?.[0] || 'A'}
                            </div>
                            <span className="text-base font-semibold">{featuredArticle.author || "Editorial Team"}</span>
                          </div>
                          <span className="w-1.5 h-1.5 bg-white/50 rounded-full hidden sm:block"></span>
                          <span className="text-sm text-slate-300">{formatDate(featuredArticle.createdAt)}</span>
                        </div>

                        {/* Premium View/Like Counts */}
                        <div className="flex items-center gap-4  border border-white/20 px-5 py-2 rounded-full shadow-lg">
                          <span className="flex items-center gap-2 text-sm text-white font-semibold">
                            <Eye size={16} className="text-emerald-400" />
                            {formatCount(featuredArticle.views)}
                          </span>
                          <div className="w-px h-4 bg-white/30"></div>
                          <span className="flex items-center gap-2 text-sm text-white font-semibold">
                            <Heart size={16} className="text-red-400" />
                            {formatCount(featuredArticle.likes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* PREMIUM SIDEBAR LIST */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {supportingArticles.map((article, idx) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/articles/${article._id}`}
                    className="group flex gap-5 items-start p-5 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white premium-card hover:premium-card-hover transition-all duration-300 border border-slate-100"
                  >
                    {/* Premium Thumbnail */}
                    <div className="relative w-36 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-lg border border-slate-200 group-hover:shadow-xl transition-all">
                      <Image
                        src={article.bannerUrl || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase mb-3 tracking-wider">
                        <div className="p-1 rounded bg-emerald-50">
                          <Feather size={10} className="text-emerald-600" />
                        </div>
                        {article.language}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors mb-3 line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Eye size={14} className="text-emerald-500" /> {formatCount(article.views)}
                        </span>
                        <span className="flex items-center gap-1.5 group-hover:text-red-500 transition-colors">
                          <Heart size={14} className="text-red-400" /> {formatCount(article.likes)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. PREMIUM ADVISORY BOARD */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 font-stack text-slate-900 relative overflow-hidden">

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }} 
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">

          {/* Premium Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-24"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-8 premium-card">
              <div className="p-1.5 rounded-full bg-emerald-100">
                <Quote size={12} className="text-emerald-600" />
              </div>
              <span>Leadership & Wisdom</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.05]">
              Scholarly <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Guidance</span>
            </h2>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto">
              Our institution is steered by the strategic vision and spiritual oversight of esteemed scholars and community leaders.
            </p>
          </motion.div>

          {/* Premium Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {advisoryMembers.length > 0 ? advisoryMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center premium-card hover:premium-card-hover transition-all duration-500"
              >
                {/* Premium Image Container */}
                <div className="relative w-36 h-36 mx-auto mb-8">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-emerald-200/50 to-teal-200/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Border Ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-slate-200 group-hover:border-emerald-300 transition-all duration-500" />

                  {/* The Image */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner border-2 border-white">
                    <Image
                      src={member.image || 'https://via.placeholder.com/150'}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Premium Text Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {member.name}
                  </h3>

                  <div className="flex justify-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-emerald-50 group-hover:to-teal-50 text-slate-600 group-hover:text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-slate-200 group-hover:border-emerald-200 transition-all duration-300 shadow-sm">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Premium Bottom Accent Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-full transition-all duration-500 group-hover:w-20 opacity-0 group-hover:opacity-100"></div>
              </motion.div>
            )) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-24 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 premium-card"
              >
                <p className="font-semibold text-lg">Advisory board members are being updated.</p>
                <p className="text-sm text-slate-400 mt-2">Check back soon for updates</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 5. PREMIUM MEDIA GALLERY (Video + News) */}
      <section className="py-32 bg-gradient-to-b from-white via-slate-50/30 to-white border-t border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          {/* Premium Gallery Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-200 pb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-6 premium-card">
                <div className="p-1.5 rounded-full bg-emerald-100">
                  <Film size={12} className="text-emerald-600" />
                </div>
                <span>Multimedia</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Gallery</span>
              </h2>
            </div>
            <Link href="/gallery" className="group flex items-center gap-2 px-6 py-3 rounded-full glass-panel text-slate-700 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm font-bold premium-card">
              View All Media
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* LEFT: Premium Video Player */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Film className="text-white" size={22} />
                </div>
                <h3>Video Spotlight</h3>
              </div>

              {activeVideo ? (
                <div className="space-y-6">
                  {/* Premium Main Player */}
                  <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden premium-card shadow-2xl shadow-slate-900/20 border-2 border-slate-200 group">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}?autoplay=0&rel=0`}
                      className="absolute inset-0 w-full h-full"
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>

                  {/* Premium Details */}
                  <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm premium-card">
                    <h4 className="text-2xl font-bold text-slate-900 leading-tight mb-3">{activeVideo.title}</h4>
                    <p className="text-slate-600 text-base leading-relaxed">Watch our latest events, lectures, and campus highlights.</p>
                  </div>

                  {/* Premium Up Next List */}
                  {videoPlaylist.length > 0 && (
                    <div className="pt-6 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <span className="w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400"></span>
                        Up Next
                      </p>
                      <div className="space-y-3">
                        {videoPlaylist.map((video) => (
                          <motion.div
                            key={video._id}
                            onClick={() => setActiveVideo(video)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="flex gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white premium-card hover:premium-card-hover cursor-pointer group transition-all duration-300 border border-slate-100"
                          >
                            <div className="relative w-36 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 shadow-lg border border-slate-200">
                              {getYouTubeId(video.youtubeUrl) && (
                                <Image
                                  src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                  alt={video.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border border-white/50">
                                  <Play size={14} fill="white" className="text-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-center flex-1 min-w-0">
                              <h5 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                                {video.title}
                              </h5>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                                Play Now <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-50 to-white rounded-3xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 premium-card">
                  <Film size={56} className="mb-4 opacity-30" />
                  <p className="font-semibold">No videos available.</p>
                </div>
              )}
            </div>

            {/* RIGHT: Premium News Feed */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Newspaper className="text-white" size={22} />
                </div>
                <h3>Latest Updates</h3>
              </div>

              <div className="flex flex-col h-full gap-6">
                {/* Premium Featured News */}
                {latestNews && (
                  <Link href={`/news/${latestNews.slug}`} className="group relative w-full h-80 rounded-3xl overflow-hidden premium-card hover:premium-card-hover transition-all duration-500">
                    <Image
                      src={latestNews.thumbnail}
                      alt={latestNews.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-8 lg:p-10 w-full">
                      <span className="inline-block px-4 py-1.5  border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                        Featured News
                      </span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-emerald-200 transition-colors">
                        {latestNews.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                        <Calendar size={16} className="text-emerald-400" />
                        <span>{formatDate(latestNews.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Premium Recent News List */}
                <div className="flex-1 space-y-4">
                  {recentNews.length > 0 ? recentNews.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={`/news/${item.slug}`}
                        className="flex gap-5 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-emerald-200 premium-card hover:premium-card-hover transition-all duration-300 group items-center"
                      >
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-lg border border-slate-200">
                          <Image
                            src={item.thumbnail || '/placeholder.jpg'}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={14} className="text-emerald-500" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-3">
                            {item.title}
                          </h4>
                          <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                            Read Full Story <ExternalLink size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )) : (
                    <div className="h-full flex items-center justify-center p-10 text-center text-slate-400 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 premium-card">
                      <div>
                        <p className="font-semibold text-lg mb-2">No other recent updates found.</p>
                        <p className="text-sm text-slate-400">Check back soon for new updates</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREMIUM FOOTER CTA */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-800/20 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-teal-900/10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel border border-white/20 text-emerald-300 text-[11px] font-bold uppercase tracking-[0.25em] mb-8"
          >
            <div className="p-1.5 rounded-full bg-emerald-500/20">
              <Users size={12} className="text-emerald-400" />
            </div>
            <span>Join Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Community</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Embark on a path of knowledge, wisdom, and spiritual growth. The doors to excellence are open.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-5"
          >
            <Link href="/contact" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-10 py-4.5 bg-white text-slate-900 font-bold rounded-full hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 shadow-2xl shadow-white/10 text-lg"
              >
                Contact Admissions
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4.5  border border-white/30 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-lg"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
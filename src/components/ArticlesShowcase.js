'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
   Languages, Search, Filter, X, Feather,
   BookOpen, Heart, Eye, User, Clock, ArrowRight, Sparkles
} from 'lucide-react';

// --- PREMIUM STYLES ---
const customStyles = `
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

// --- HELPERS ---
const formatDate = (date) =>
   new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });

const isRTL = (language = '') =>
   /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());

const formatCount = (value = 0) =>
   new Intl.NumberFormat('en-US', { notation: "compact" }).format(value || 0);

const calculateReadTime = (text) => {
   const words = text?.split(/\s+/).length || 0;
   return Math.ceil(words / 200) + ' min read';
};

// --- MAIN COMPONENT ---
export default function ArticlesShowcase({ articles = [] }) {
   const [entries, setEntries] = useState(articles);
   const [languageFilter, setLanguageFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [search, setSearch] = useState('');

   // Interaction State
   const [likedIds, setLikedIds] = useState(new Set());
   const [viewedIds, setViewedIds] = useState(new Set());

   // --- Effects ---
   useEffect(() => { setEntries(articles); }, [articles]);

   useEffect(() => {
      if (typeof window === 'undefined') return;
      const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
      const viewed = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
      setLikedIds(new Set(liked));
      setViewedIds(new Set(viewed));
   }, []);

   // --- Filtering ---
   const languages = useMemo(() => {
      const set = new Set(entries.map((a) => a.language || 'English'));
      return Array.from(set);
   }, [entries]);

   const filtered = useMemo(() => {
      return entries.filter((article) => {
         const matchesLanguage = languageFilter === 'all' || article.language === languageFilter;
         const matchesType = typeFilter === 'all' || article.type === typeFilter;
         const matchesSearch = !search ||
            article.title?.toLowerCase().includes(search.toLowerCase()) ||
            article.author?.toLowerCase().includes(search.toLowerCase());
         return matchesLanguage && matchesType && matchesSearch;
      });
   }, [entries, languageFilter, typeFilter, search]);

   const highlight = !search && languageFilter === 'all' && typeFilter === 'all' ? filtered[0] : null;
   const rest = highlight ? filtered.filter((article) => article._id !== highlight._id) : filtered;

   // --- Handlers ---
   const handleLike = async (e, article) => {
      e.preventDefault(); // Prevent link click
      e.stopPropagation();
      
      if (!article?._id) return;
      if (likedIds.has(article._id)) {
         toast('You already liked this article');
         return;
      }
      try {
         const next = new Set(likedIds);
         next.add(article._id);
         setLikedIds(next);
         setEntries((prev) =>
            prev.map((item) =>
               item._id === article._id ? { ...item, likes: (item.likes || 0) + 1 } : item
            )
         );
         localStorage.setItem('likedArticles', JSON.stringify([...next]));
         toast.success('Added to favorites');
         // Simulate API call
         // await fetch('/api/articles', { ... }); 
      } catch (error) {
         toast.error('Connection error');
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 font-sans text-slate-900 pb-24 selection:bg-emerald-100 selection:text-emerald-900">
         <style jsx global>{customStyles}</style>

         {/* Premium Background Pattern */}
         <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }} 
         />
         
         {/* 1. PREMIUM HERO HEADER */}
         <div className="bg-gradient-to-b from-white via-white to-slate-50/50 border-b border-slate-200/60 pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Premium Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] premium-card"
               >
                  <div className="p-1.5 rounded-full bg-emerald-100">
                     <BookOpen size={12} className="text-emerald-600" />
                  </div>
                  <span>The Archive</span>
               </motion.div>

               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.05]"
               >
                  Perspectives &{' '}
                  <span className="relative inline-block">
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 italic">
                        Prose
                     </span>
                     <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                     />
                  </span>
               </motion.h1>

               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light"
               >
                  A digital sanctuary for scholarly articles, poetry, and community stories.
               </motion.p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 -mt-10 relative z-20">
            
            {/* 2. PREMIUM FILTER BAR */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white/90 backdrop-blur-sm rounded-2xl premium-card p-3 flex flex-col md:flex-row gap-3 border border-slate-200/60 mb-16"
            >
               <div className="flex-1 flex items-center bg-gradient-to-br from-slate-50 to-white rounded-xl px-5 py-3.5 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-300 border-2 border-slate-200 transition-all">
                  <Search size={18} className="text-emerald-600 mr-3" />
                  <input
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search titles, authors..."
                     className="bg-transparent w-full outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                  />
                  {search && (
                     <motion.button 
                        onClick={() => setSearch('')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                     >
                        <X size={16} className="text-slate-400 hover:text-slate-600" />
                     </motion.button>
                  )}
               </div>

               <div className="flex gap-3">
                  {/* Premium Language Dropdown */}
                  <div className="relative group min-w-[160px]">
                     <div className="flex items-center justify-between bg-gradient-to-br from-slate-50 to-white rounded-xl px-4 py-3.5 h-full cursor-pointer hover:bg-slate-100 border-2 border-slate-200 hover:border-emerald-300 transition-all shadow-sm">
                        <div className="flex items-center gap-2.5">
                           <div className="p-1.5 rounded-lg bg-emerald-100">
                              <Languages size={14} className="text-emerald-600" />
                           </div>
                           <span className="text-sm font-bold text-slate-700 capitalize">
                              {languageFilter === 'all' ? 'All Languages' : languageFilter}
                           </span>
                        </div>
                     </div>
                     <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     >
                        <option value="all">All Languages</option>
                        {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                     </select>
                  </div>

                  {/* Premium Type Toggles */}
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-1.5 rounded-xl flex border border-slate-200 shadow-sm">
                     {['all', 'article', 'poem'].map((t) => (
                        <button
                           key={t}
                           onClick={() => setTypeFilter(t)}
                           className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                              typeFilter === t 
                                 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                                 : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                           }`}
                        >
                           {t === 'all' ? 'All' : t}
                        </button>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* 3. PREMIUM FEATURED HIGHLIGHT */}
            {highlight && (
   <Link href={`/articles/${highlight._id}`} className="block mb-20">
      <motion.div
         layoutId={`card-${highlight._id}`}
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden premium-card hover:premium-card-hover transition-all duration-500 grid lg:grid-cols-12 border-2 border-slate-200/60"
      >
         {/* Premium Image Side */}
         <div className="lg:col-span-8 relative h-64 lg:h-[520px] overflow-hidden">
            {highlight.bannerUrl ? (
               <Image
                  src={highlight.bannerUrl}
                  alt={highlight.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
               />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <BookOpen className="text-slate-300" size={64} />
               </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Floating Badge */}
            <div className="absolute top-6 left-6 glass-panel border border-white/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xl">
               <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-emerald-600" />
                  <span>Featured {highlight.type}</span>
               </div>
            </div>
         </div>

         {/* Premium Content Side */}
         <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50/50 relative">
            <div className="flex items-center gap-3 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
               <div className="p-1.5 rounded-lg bg-emerald-100">
                  <Languages size={12} className="text-emerald-600" />
               </div>
               <span>{highlight.language}</span>
               <span className="text-slate-300">•</span>
               <span className="text-slate-500">{formatDate(highlight.createdAt)}</span>
            </div>

            <h2 className="text-2xl lg:text-4xl font-serif font-bold text-slate-900 mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
               {highlight.title}
            </h2>

            <p className="text-slate-600 leading-relaxed line-clamp-4 mb-10 text-base font-light">
               {highlight.subtitle || highlight.content?.replace(/<[^>]*>/g, '').slice(0, 180)}...
            </p>

            {/* Premium Footer With Stats */}
            <div className="mt-auto pt-8 border-t-2 border-slate-200 flex items-center justify-between">
               {/* Premium Author Info */}
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-lg">
                        {highlight.author?.[0]}
                     </div>
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-800 leading-none">{highlight.author}</p>
                     <p className="text-[11px] text-slate-500 mt-1.5 font-semibold flex items-center gap-1">
                        <Clock size={10} />
                        {calculateReadTime(highlight.content)}
                     </p>
                  </div>
               </div>

               {/* Premium Stats */}
               <div className="flex items-center gap-3">
                  {/* View Count */}
                  <div 
                     className="flex items-center gap-2 text-slate-500 glass-panel border border-slate-200/60 px-3 py-2 rounded-full shadow-sm"
                     title={`${highlight.views} views`}
                  >
                     <Eye size={16} className="text-emerald-500" />
                     <span className="text-xs font-bold">{formatCount(highlight.views)}</span>
                  </div>

                  {/* Premium Like Button */}
                  <motion.button
                     onClick={(e) => handleLike(e, highlight)}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                        likedIds.has(highlight._id) 
                           ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-500 ring-2 ring-red-100 shadow-lg' 
                           : 'glass-panel border border-slate-200/60 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                     }`}
                  >
                     <Heart 
                        size={16} 
                        className={likedIds.has(highlight._id) ? "fill-current" : ""} 
                     />
                     <span className="text-xs font-bold">{formatCount(highlight.likes)}</span>
                  </motion.button>
               </div>
            </div>
         </div>
      </motion.div>
   </Link>
)}

            {/* 4. PREMIUM GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
               <AnimatePresence>
                  {rest.map((article, idx) => (
                     <Link key={article._id || idx} href={`/articles/${article._id}`} className="block h-full">
                        <motion.div
                           layoutId={`card-${article._id}`}
                           initial={{ opacity: 0, y: 30 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           whileHover={{ y: -8 }}
                           className="group bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-slate-200/60 premium-card hover:premium-card-hover transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
                        >
                           {/* Premium Image Section */}
                           <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                              {article.bannerUrl ? (
                                 <Image
                                    src={article.bannerUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                              ) : (
                                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                    <Feather className="text-slate-300" size={48} />
                                 </div>
                              )}
                              
                              {/* Premium Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Premium Date Badge */}
                              <div className="absolute top-4 right-4 glass-panel border border-white/30 px-3 py-1.5 rounded-full shadow-lg">
                                 <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                    {formatDate(article.createdAt)}
                                 </span>
                              </div>
                           </div>

                           {/* Premium Content Section */}
                           <div className="p-6 lg:p-7 flex flex-col flex-1">
                              {/* Premium Meta Header */}
                              <div className="flex justify-between items-center mb-5">
                                 <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100">
                                       {article.type === 'poem' ? <Feather size={14} /> : <BookOpen size={14} />}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                       {article.language}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                    <Clock size={12} className="text-emerald-500" />
                                    {calculateReadTime(article.content)}
                                 </div>
                              </div>

                              {/* Title & Excerpt */}
                              <div
                                 className={`flex-1 mb-6 ${isRTL(article.language) ? 'text-right' : 'text-left'}`}
                                 dir={isRTL(article.language) ? 'rtl' : 'ltr'}
                              >
                                 <h3 className="text-xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {article.title}
                                 </h3>
                                 <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-light">
                                    {article.subtitle ||
                                       article.content?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                                 </p>
                              </div>

                              {/* Premium Footer Stats */}
                              <div className="pt-5 border-t-2 border-slate-100 flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                       <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                                          {article.author?.[0]}
                                       </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{article.author}</span>
                                 </div>
                                 
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-emerald-600 transition-colors font-semibold">
                                       <Eye size={14} className="text-emerald-500" /> 
                                       <span>{formatCount(article.views)}</span>
                                    </div>
                                    <motion.button
                                       onClick={(e) => handleLike(e, article)}
                                       whileHover={{ scale: 1.1 }}
                                       whileTap={{ scale: 0.9 }}
                                       className={`flex items-center gap-1.5 text-xs transition-colors font-semibold ${
                                          likedIds.has(article._id) ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                                       }`}
                                    >
                                       <Heart size={14} fill={likedIds.has(article._id) ? "currentColor" : "none"} />
                                       <span>{formatCount(article.likes)}</span>
                                    </motion.button>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     </Link>
                  ))}
               </AnimatePresence>
            </div>

            {/* Premium Empty State */}
            {rest.length === 0 && !highlight && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-32"
               >
                  <div className="relative inline-block mb-6">
                     <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-2xl"></div>
                     <div className="relative p-6 rounded-full bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 premium-card">
                        <Search className="text-slate-400" size={40} />
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
                  <p className="text-slate-600 text-base font-light">Try adjusting your filters or search terms.</p>
               </motion.div>
            )}
         </div>
      </div>
   );
}
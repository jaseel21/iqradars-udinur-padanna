'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image
import toast from 'react-hot-toast';
import {
   Languages, Search, Filter, X, Feather,
   BookOpen, Heart, Eye, User, Clock, ArrowRight
} from 'lucide-react';

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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24 selection:bg-emerald-100 selection:text-emerald-900">
         
         {/* 1. HERO HEADER */}
         <div className="bg-white border-b border-slate-200 pt-28 pb-16 px-6 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
             
            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest border border-emerald-100"
               >
                  <BookOpen size={12} />
                  <span>The Archive</span>
               </motion.div>

               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.1]"
               >
                  Perspectives & <span className="text-emerald-600 italic">Prose</span>
               </motion.h1>

               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light"
               >
                  A digital sanctuary for scholarly articles, poetry, and community stories.
               </motion.p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            
            {/* 2. FILTER BAR */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-2 flex flex-col md:flex-row gap-2 border border-slate-100 mb-12"
            >
               <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <Search size={18} className="text-slate-400 mr-3" />
                  <input
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search titles, authors..."
                     className="bg-transparent w-full outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                  />
                  {search && (
                     <button onClick={() => setSearch('')}>
                        <X size={16} className="text-slate-400 hover:text-slate-600" />
                     </button>
                  )}
               </div>

               <div className="flex gap-2">
                  {/* Language Dropdown */}
                  <div className="relative group min-w-[150px]">
                     <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 h-full cursor-pointer hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-2">
                           <Languages size={16} className="text-emerald-600" />
                           <span className="text-sm font-semibold text-slate-700 capitalize">
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

                  {/* Type Toggles */}
                  <div className="bg-slate-100 p-1 rounded-lg flex">
                     {['all', 'article', 'poem'].map((t) => (
                        <button
                           key={t}
                           onClick={() => setTypeFilter(t)}
                           className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${typeFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                        >
                           {t === 'all' ? 'All' : t}
                        </button>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* 3. FEATURED HIGHLIGHT */}
            {highlight && (
   <Link href={`/articles/${highlight._id}`} className="block mb-16">
      <motion.div
         layoutId={`card-${highlight._id}`}
         className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 grid lg:grid-cols-12"
      >
         {/* Image Side */}
         <div className="lg:col-span-8 relative h-64 lg:h-[480px] overflow-hidden">
            {highlight.bannerUrl ? (
               <Image
                  src={highlight.bannerUrl}
                  alt={highlight.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
               />
            ) : (
               <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <BookOpen className="text-slate-300" size={64} />
               </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
            
            {/* Floating Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm">
               Featured {highlight.type}
            </div>
         </div>

         {/* Content Side */}
         <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center bg-white relative">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
               <Languages size={14} />
               <span>{highlight.language}</span>
               <span className="text-slate-300">•</span>
               <span>{formatDate(highlight.createdAt)}</span>
            </div>

            <h2 className="text-2xl lg:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
               {highlight.title}
            </h2>

            <p className="text-slate-500 leading-relaxed line-clamp-3 mb-8">
               {highlight.subtitle || highlight.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
            </p>

            {/* --- UPDATED FOOTER WITH STATS --- */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
               {/* Author Info */}
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs ring-2 ring-white">
                     {highlight.author?.[0]}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-800 leading-none">{highlight.author}</p>
                     <p className="text-[11px] text-slate-400 mt-1 font-medium">{calculateReadTime(highlight.content)}</p>
                  </div>
               </div>

               {/* Stats (Views & Likes) */}
               <div className="flex items-center gap-3">
                  {/* View Count */}
                  <div 
                     className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-full"
                     title={`${highlight.views} views`}
                  >
                     <Eye size={16} />
                     <span className="text-xs font-bold">{formatCount(highlight.views)}</span>
                  </div>

                  {/* Like Button & Count */}
                  <button
                     onClick={(e) => handleLike(e, highlight)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                        likedIds.has(highlight._id) 
                           ? 'bg-red-50 text-red-500 ring-1 ring-red-100' 
                           : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'
                     }`}
                  >
                     <Heart 
                        size={16} 
                        className={likedIds.has(highlight._id) ? "fill-current" : ""} 
                     />
                     <span className="text-xs font-bold">{formatCount(highlight.likes)}</span>
                  </button>
               </div>
            </div>
         </div>
      </motion.div>
   </Link>
)}

            {/* 4. THE GRID (REDESIGNED) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <AnimatePresence>
                  {rest.map((article, idx) => (
                     <Link key={article._id || idx} href={`/articles/${article._id}`} className="block h-full">
                        <motion.div
                           layoutId={`card-${article._id}`}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           // Removed padding, added overflow hidden
                           className="group bg-white rounded-2xl border border-slate-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                        >
                           {/* --- A. IMAGE SECTION (Edge-to-Edge) --- */}
                           <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                              {article.bannerUrl ? (
                                 <Image
                                    src={article.bannerUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                 />
                              ) : (
                                 // Stylish Fallback
                                 <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                                    <Feather className="text-slate-200" size={40} />
                                 </div>
                              )}
                              
                              {/* Overlay for depth */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Floating Date Badge */}
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/50">
                                 <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                                    {formatDate(article.createdAt)}
                                 </span>
                              </div>
                           </div>

                           {/* --- B. CONTENT SECTION --- */}
                           <div className="p-6 flex flex-col flex-1">
                              {/* Meta Header */}
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-2">
                                    <span className="p-1.5 rounded-full bg-slate-50 text-emerald-600 ring-1 ring-slate-100">
                                       {article.type === 'poem' ? <Feather size={12} /> : <BookOpen size={12} />}
                                    </span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                       {article.language}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Clock size={12} />
                                    {calculateReadTime(article.content)}
                                 </div>
                              </div>

                              {/* Title & Excerpt */}
                              <div
                                 className={`flex-1 mb-6 ${isRTL(article.language) ? 'text-right' : 'text-left'}`}
                                 dir={isRTL(article.language) ? 'rtl' : 'ltr'}
                              >
                                 <h3 className="text-lg font-serif font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {article.title}
                                 </h3>
                                 <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-light">
                                    {article.subtitle ||
                                       article.content?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                                 </p>
                              </div>

                              {/* Footer Stats */}
                              <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-2">
                                     <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                                         {article.author?.[0]}
                                     </div>
                                    <span className="text-xs font-bold text-slate-600">{article.author}</span>
                                 </div>
                                 
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-emerald-600 transition-colors">
                                       <Eye size={14} /> 
                                       <span className="font-medium">{formatCount(article.views)}</span>
                                    </div>
                                    <button
                                       onClick={(e) => handleLike(e, article)}
                                       className={`flex items-center gap-1 text-xs transition-colors ${
                                          likedIds.has(article._id) ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
                                       }`}
                                    >
                                       <Heart size={14} fill={likedIds.has(article._id) ? "currentColor" : "none"} />{' '}
                                       <span className="font-medium">{formatCount(article.likes)}</span>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     </Link>
                  ))}
               </AnimatePresence>
            </div>

            {/* Empty State */}
            {rest.length === 0 && !highlight && (
               <div className="text-center py-20">
                  <div className="inline-block p-4 rounded-full bg-slate-50 mb-4">
                      <Search className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No articles found</h3>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your filters.</p>
               </div>
            )}
         </div>
      </div>
   );
}
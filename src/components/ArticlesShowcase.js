'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
   Languages, Search, X, Feather,
   BookOpen, Heart, Eye, Clock, Sparkles
} from 'lucide-react';

// --- HELPERS ---
const formatDate = (date) =>
   new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   });

const isRTL = (language = '') =>
   /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());

const formatCount = (value = 0) =>
   new Intl.NumberFormat('en-US', { notation: "compact" }).format(value || 0);

const calculateReadTime = (text) => {
   const words = text?.split(/\s+/).length || 0;
   return Math.ceil(words / 200) + ' min';
};

// --- MAIN COMPONENT ---
export default function ArticlesShowcase({ articles = [] }) {
   const [entries, setEntries] = useState(articles);
   const [languageFilter, setLanguageFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [search, setSearch] = useState('');

   // Interaction State
   const [likedIds, setLikedIds] = useState(new Set());
   
   // --- Effects ---
   useEffect(() => { setEntries(articles); }, [articles]);

   useEffect(() => {
      if (typeof window === 'undefined') return;
      const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
      setLikedIds(new Set(liked));
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
      e.preventDefault(); 
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
      } catch (error) {
         toast.error('Connection error');
      }
   };

   return (
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-24 selection:bg-amber-100 selection:text-amber-900">
         
         {/* 1. EDITORIAL HEADER */}
         <div className="pt-32 pb-16 px-6 relative overflow-hidden bg-white border-b border-stone-200">
            <div className="max-w-5xl mx-auto text-center relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-bold uppercase tracking-widest mb-6"
               >
                  <BookOpen size={12} />
                  <span>The Archive</span>
               </motion.div>

               

               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-stone-500 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed"
               >
                  A curated collection of scholarly articles, poetry, and community insights.
               </motion.p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            
            {/* 2. FILTER BAR (Clean & Professional) */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white rounded-2xl p-2 sm:p-3 flex flex-col md:flex-row gap-3 border border-stone-200 shadow-xl shadow-stone-200/50 mb-16"
            >
               {/* Search */}
               <div className="flex-1 flex items-center bg-stone-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white border border-stone-100 transition-all">
                  <Search size={16} className="text-stone-400 mr-3" />
                  <input
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search articles..."
                     className="bg-transparent w-full outline-none text-xs sm:text-sm font-medium text-stone-700 placeholder:text-stone-400"
                  />
                  {search && (
                     <button onClick={() => setSearch('')}>
                        <X size={14} className="text-stone-400 hover:text-stone-600" />
                     </button>
                  )}
               </div>

               <div className="flex gap-2">
                  {/* Language Dropdown */}
                  <div className="relative group min-w-[140px]">
                     <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 h-full cursor-pointer hover:bg-stone-50 border border-stone-200 transition-all">
                        <div className="flex items-center gap-2">
                           <Languages size={14} className="text-amber-600" />
                           <span className="text-xs font-bold text-stone-700 capitalize">
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
                  <div className="bg-stone-100 p-1 rounded-xl flex">
                     {['all', 'article', 'poem'].map((t) => (
                        <button
                           key={t}
                           onClick={() => setTypeFilter(t)}
                           className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                              typeFilter === t 
                                 ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                                 : 'text-stone-500 hover:text-stone-700'
                           }`}
                        >
                           {t === 'all' ? 'All' : t}
                        </button>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* 3. FEATURED HIGHLIGHT (Magazine Style) */}
            {highlight && (
               <Link href={`/articles/${highlight._id}`} className="block mb-16">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg shadow-stone-200/50 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-500 grid lg:grid-cols-12"
                  >
                     {/* Image Side */}
                     <div className="lg:col-span-7 relative h-64 lg:h-[450px] overflow-hidden">
                        {highlight.bannerUrl ? (
                           <Image
                              src={highlight.bannerUrl}
                              alt={highlight.title}
                              fill
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                           />
                        ) : (
                           <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                              <BookOpen className="text-stone-300" size={48} />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent lg:hidden" />
                        
                        {/* Badge */}
                        <div className="absolute top-6 left-6 bg-amber-400 text-stone-900 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                           Featured {highlight.type}
                        </div>
                     </div>

                     {/* Content Side */}
                     <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
                        <div className="flex items-center gap-3 text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-5">
                           <span className="text-amber-600">{highlight.language}</span>
                           <span>•</span>
                           <span>{formatDate(highlight.createdAt)}</span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 mb-4 leading-tight group-hover:underline decoration-amber-400 decoration-2 underline-offset-4 transition-all">
                           {highlight.title}
                        </h2>

                        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed line-clamp-4 mb-8 font-medium">
                           {highlight.subtitle || highlight.content?.replace(/<[^>]*>/g, '').slice(0, 180)}...
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             
                              <div>
                                 <p className="text-xs font-bold text-stone-900 leading-none">{highlight.author}</p>
                                 <p className="text-[10px] text-stone-400 mt-1 font-medium">
                                    {calculateReadTime(highlight.content)}
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-center gap-3">
                              <button
                                 onClick={(e) => handleLike(e, highlight)}
                                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                    likedIds.has(highlight._id) 
                                       ? 'bg-red-50 border-red-100 text-red-500' 
                                       : 'bg-white border-stone-200 text-stone-400 hover:border-red-200 hover:text-red-500'
                                 }`}
                              >
                                 <Heart size={12} fill={likedIds.has(highlight._id) ? "currentColor" : "none"} />
                                 {formatCount(highlight.likes)}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </Link>
            )}

            {/* 4. MAIN GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
               <AnimatePresence>
                  {rest.map((article, idx) => (
                     <Link key={article._id || idx} href={`/articles/${article._id}`} className="block h-full">
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           whileHover={{ y: -4 }}
                           className="group bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 flex flex-col h-full overflow-hidden"
                        >
                           {/* Image */}
                           <div className="relative w-full h-48 overflow-hidden bg-stone-100">
                              {article.bannerUrl ? (
                                 <Image
                                    src={article.bannerUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                 />
                              ) : (
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <Feather className="text-stone-300" size={32} />
                                 </div>
                              )}
                              
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                 <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider">
                                    {formatDate(article.createdAt)}
                                 </span>
                              </div>
                           </div>

                           {/* Content */}
                           <div className="p-5 flex flex-col flex-1">
                              {/* Meta */}
                              <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${article.type === 'poem' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}`}>
                                       {article.type}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                       {article.language}
                                    </span>
                                 </div>
                              </div>

                              {/* Text */}
                              <div className="flex-1 mb-4" dir={isRTL(article.language) ? 'rtl' : 'ltr'}>
                                 <h3 className={`text-lg font-serif font-bold text-stone-900 mb-2 leading-tight group-hover:text-amber-700 transition-colors ${isRTL(article.language) ? 'text-right' : 'text-left'}`}>
                                    {article.title}
                                 </h3>
                                 <p className={`text-stone-500 text-xs leading-relaxed line-clamp-3 font-medium ${isRTL(article.language) ? 'text-right' : 'text-left'}`}>
                                    {article.subtitle || article.content?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                                 </p>
                              </div>

                              {/* Footer Stats */}
                              <div className="pt-4 border-t border-stone-50 flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-2 text-stone-600">
                                    <span className="text-xs font-bold">{article.author}</span>
                                 </div>
                                 
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[10px] text-stone-400 font-bold">
                                       <Eye size={12} /> 
                                       <span>{formatCount(article.views)}</span>
                                    </div>
                                    <button
                                       onClick={(e) => handleLike(e, article)}
                                       className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
                                          likedIds.has(article._id) ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                                       }`}
                                    >
                                       <Heart size={12} fill={likedIds.has(article._id) ? "currentColor" : "none"} />
                                       <span>{formatCount(article.likes)}</span>
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
               <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Search className="text-stone-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">No articles found</h3>
                  <p className="text-xs text-stone-500 mt-1">Try adjusting your filters.</p>
               </div>
            )}
         </div>
      </div>
   );
}
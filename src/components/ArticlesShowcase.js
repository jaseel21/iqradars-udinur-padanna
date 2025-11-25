'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  Languages, Search, Filter, X, Feather, 
  BookOpen, Heart, Eye, ChevronRight, Calendar, User, Share2, Clock
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
  
  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Interaction State
  const [likedIds, setLikedIds] = useState(new Set());
  const [viewedIds, setViewedIds] = useState(new Set());

  // --- Effects (Persistence & Views) ---
  useEffect(() => { setEntries(articles); }, [articles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const viewed = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    setLikedIds(new Set(liked));
    setViewedIds(new Set(viewed));
  }, []);

  // Track View on Open
  useEffect(() => {
    if (!selectedArticle || !selectedArticle._id) return;
    if (viewedIds.has(selectedArticle._id)) return;
    
    const updateView = async () => {
      try {
        // Optimistic update
        const next = new Set(viewedIds);
        next.add(selectedArticle._id);
        setViewedIds(next);
        localStorage.setItem('viewedArticles', JSON.stringify([...next]));
        
        // API Call
        await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedArticle._id, action: 'view' }),
        });
      } catch (error) { console.error(error); }
    };
    updateView();
  }, [selectedArticle, viewedIds]);

  // --- Filtering Logic ---
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
      setEntries(prev => prev.map(item => item._id === article._id ? {...item, likes: (item.likes || 0) + 1} : item));
      localStorage.setItem('likedArticles', JSON.stringify([...next]));
      toast.success('Added to favorites');

      await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article._id, action: 'like' }),
      });
    } catch (error) { toast.error('Connection error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 pb-24 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. HERO HEADER: Scholarly & Clean */}
      <div className="bg-white border-b border-slate-100 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-emerald-700 text-xs font-bold uppercase tracking-widest"
          >
            <BookOpen size={14} />
            <span>The Knowledge Archive</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1]"
          >
            Reflections & <span className="italic text-emerald-600">Insights</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light"
          >
            Explore a curated collection of scholarly articles, spiritual poetry, and community stories designed to illuminate the mind.
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-10 relative z-10">
        
        {/* 2. FLOATING FILTER BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/40 p-2 flex flex-col md:flex-row gap-2 border border-slate-200/60 max-w-5xl mx-auto mb-16"
        >
          {/* Search */}
          <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors focus-within:ring-2 focus-within:ring-emerald-500/20">
            <Search size={18} className="text-slate-400 mr-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library..."
              className="bg-transparent w-full outline-none text-sm placeholder:text-slate-400 font-medium"
            />
            {search && <button onClick={() => setSearch('')}><X size={16} className="text-slate-400 hover:text-slate-600"/></button>}
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
             <div className="relative group min-w-[160px]">
               <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 h-full cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Languages size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700 capitalize">{languageFilter === 'all' ? 'Language' : languageFilter}</span>
                  </div>
                  <Filter size={12} className="text-slate-400" />
               </div>
               <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
             </div>

             <div className="bg-slate-100 p-1 rounded-xl flex">
                {['all', 'article', 'poem'].map((t) => (
                   <button
                     key={t}
                     onClick={() => setTypeFilter(t)}
                     className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${typeFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     {t === 'all' ? 'All' : t + 's'}
                   </button>
                ))}
             </div>
          </div>
        </motion.div>

        {/* 3. FEATURED HIGHLIGHT (Magazine Style) */}
        {highlight && (
          <div className="mb-24">
             <div className="flex items-center gap-2 mb-4 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Featured Story</span>
             </div>
             
             <motion.div 
               layoutId={`card-${highlight._id}`}
               onClick={() => setSelectedArticle(highlight)}
               className="group cursor-pointer grid lg:grid-cols-12 gap-0 bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500"
             >
                {/* Image Side */}
                <div className="lg:col-span-7 relative h-72 lg:h-[500px] overflow-hidden">
                   {highlight.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={highlight.bannerUrl} alt={highlight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                   ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                         <Feather size={64} />
                      </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                   <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full text-slate-900 shadow-sm uppercase tracking-wide">
                        {highlight.type}
                      </span>
                   </div>
                </div>
                
                {/* Content Side */}
                <div className={`lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white relative z-10 ${isRTL(highlight.language) ? 'text-right' : 'text-left'}`} dir={isRTL(highlight.language) ? 'rtl' : 'ltr'}>
                   <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                      <Languages size={14} />
                      <span>{highlight.language}</span>
                      <span className="text-slate-300">•</span>
                      <span>{formatDate(highlight.createdAt)}</span>
                   </div>
                   
                   <h2 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-[1.1] group-hover:text-emerald-800 transition-colors">
                      {highlight.title}
                   </h2>
                   
                   <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 mb-10 font-light">
                      {highlight.subtitle || highlight.content?.replace(/<[^>]*>/g, '').slice(0, 180)}...
                   </p>
                   
                   <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {highlight.author?.[0]}
                         </div>
                         <div className="text-sm">
                            <p className="font-bold text-slate-900 leading-none mb-1">{highlight.author}</p>
                            <p className="text-slate-400 text-xs">{calculateReadTime(highlight.content)}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={(e) => handleLike(e, highlight)}
                            className={`p-3 rounded-full transition-all ${likedIds.has(highlight._id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                         >
                            <Heart size={18} fill={likedIds.has(highlight._id) ? "currentColor" : "none"} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}

        {/* 4. MASONRY GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence>
             {rest.map((article, idx) => (
                <motion.div
                  layoutId={`card-${article._id}`}
                  key={article._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                   {/* Card Header */}
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                         <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600">
                            {article.type === 'poem' ? <Feather size={14}/> : <BookOpen size={14}/>}
                         </span>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{article.language}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-md">{formatDate(article.createdAt)}</span>
                   </div>

                   {/* Card Body */}
                   <div className={`flex-1 mb-6 ${isRTL(article.language) ? 'text-right' : 'text-left'}`} dir={isRTL(article.language) ? 'rtl' : 'ltr'}>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-700 transition-colors font-serif">
                         {article.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                         {article.subtitle || article.content?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                      </p>
                   </div>

                   {/* Card Footer */}
                   <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                         <User size={12} className="text-emerald-500" />
                         <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                         <span className="flex items-center gap-1"><Eye size={12} /> {formatCount(article.views)}</span>
                         <span className={`flex items-center gap-1 ${likedIds.has(article._id) ? 'text-red-500' : 'group-hover:text-red-400 transition-colors'}`}>
                            <Heart size={12} fill={likedIds.has(article._id) ? "currentColor" : "none"} /> {formatCount(article.likes)}
                         </span>
                      </div>
                   </div>
                </motion.div>
             ))}
           </AnimatePresence>
        </div>

        {rest.length === 0 && !highlight && (
           <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                 <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                 We couldn't find any articles matching your search. Try adjusting the filters or keywords.
              </p>
              <button 
                 onClick={() => {setSearch(''); setLanguageFilter('all'); setTypeFilter('all')}}
                 className="mt-6 text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
              >
                 Clear Filters <X size={14} />
              </button>
           </div>
        )}
      </div>

      {/* 5. IMMERSIVE READING MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
               onClick={() => setSelectedArticle(null)} 
            />
            
            <motion.div
              layoutId={`card-${selectedArticle._id}`}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur z-20 sticky top-0">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                       {selectedArticle.author?.[0] || 'A'}
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">{selectedArticle.author}</h4>
                       <p className="text-[10px] text-slate-500 uppercase tracking-wide">{formatDate(selectedArticle.createdAt)} • {calculateReadTime(selectedArticle.content)}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                       <Share2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleLike(e, selectedArticle)}
                      className={`p-2.5 rounded-full hover:bg-slate-100 transition-colors ${likedIds.has(selectedArticle._id) ? 'text-red-500' : 'text-slate-400'}`}
                    >
                       <Heart size={18} fill={likedIds.has(selectedArticle._id) ? "currentColor" : "none"} />
                    </button>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <button onClick={() => setSelectedArticle(null)} className="p-2.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                       <X size={20} />
                    </button>
                 </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto overflow-x-hidden flex-1 p-8 sm:p-12 md:p-16 scroll-smooth bg-[#fafafa]">
                 <div className="max-w-2xl mx-auto bg-white p-10 md:p-16 rounded-xl shadow-sm border border-slate-100 min-h-full">
                    
                    {/* Article Tags */}
                    <div className="flex justify-center gap-2 mb-8">
                       <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedArticle.type}</span>
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedArticle.language}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <h1 className={`text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight text-center ${isRTL(selectedArticle.language) ? 'font-noto-nastaliq' : ''}`}>
                       {selectedArticle.title}
                    </h1>
                    
                    {selectedArticle.subtitle && (
                       <p className={`text-lg md:text-xl text-slate-500 font-light italic mb-10 text-center ${isRTL(selectedArticle.language) ? 'font-noto-nastaliq' : ''}`}>
                          {selectedArticle.subtitle}
                       </p>
                    )}

                    {/* Banner */}
                    {selectedArticle.bannerUrl && (
                       <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12 shadow-inner">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={selectedArticle.bannerUrl} alt="" className="w-full h-full object-cover" />
                       </div>
                    )}

                    {/* Main Text */}
                    <div 
                      className={`prose prose-slate prose-lg max-w-none text-slate-800 leading-8 ${isRTL(selectedArticle.language) ? 'text-right' : 'text-left'}`}
                      dir={isRTL(selectedArticle.language) ? 'rtl' : 'ltr'}
                      style={{ fontFamily: selectedArticle.language === 'Urdu' ? '"Noto Nastaliq Urdu", serif' : 'inherit' }}
                    >
                       {/* Drop Cap for English Articles */}
                       {(!isRTL(selectedArticle.language) && selectedArticle.content) && (
                          <span className="float-left text-6xl font-bold text-emerald-900 mr-3 mt-[-10px] font-serif">
                             {selectedArticle.content.charAt(0)}
                          </span>
                       )}
                       
                       {selectedArticle.content?.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-6 first-letter:float-none">{
                             // If drop cap is used, slice first char from first paragraph
                             (!isRTL(selectedArticle.language) && i === 0) ? paragraph.slice(1) : paragraph
                          }</p>
                       ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center">
                       <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                             <Feather size={24} />
                          </div>
                          <p className="text-sm font-bold text-slate-900">End of Article</p>
                          <p className="text-xs text-slate-400 mt-1">Written by {selectedArticle.author}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
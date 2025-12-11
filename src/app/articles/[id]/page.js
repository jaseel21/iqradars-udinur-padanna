'use client';
import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    ArrowLeft, Share2,PenTool, Heart, Calendar, Clock, Feather, Eye, BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- HELPERS ---
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

const isRTL = (language = '') =>
    /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());

const calculateReadTime = (text) => {
    const words = text?.split(/\s+/).length || 0;
    return Math.ceil(words / 200) + ' min read';
};

const formatCount = (value = 0) =>
    new Intl.NumberFormat('en-US', { notation: "compact" }).format(value || 0);

export default function ArticlePage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likedIds, setLikedIds] = useState(new Set());
    const [viewedIds, setViewedIds] = useState(new Set());

    // --- Persistence & Fetching ---
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        const viewed = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
        setLikedIds(new Set(liked));
        setViewedIds(new Set(viewed));
    }, []);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles/${id}`);
                if (!res.ok) throw new Error('Failed to fetch article');
                const data = await res.json();
                setArticle(data.article);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id]);

    // Track View
    useEffect(() => {
        if (!article || !article._id) return;
        if (viewedIds.has(article._id)) return;

        const updateView = async () => {
            try {
                const next = new Set(viewedIds);
                next.add(article._id);
                setViewedIds(next);
                localStorage.setItem('viewedArticles', JSON.stringify([...next]));
                
                setArticle(prev => ({ ...prev, views: (prev.views || 0) + 1 }));

                await fetch('/api/articles', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: article._id, action: 'view' }),
                });
            } catch (error) { console.error(error); }
        };
        updateView();
    }, [article, viewedIds]);

    // Handle Like
    const handleLike = async () => {
        if (!article?._id) return;

        if (likedIds.has(article._id)) {
            toast('You already liked this article');
            return;
        }

        try {
            const next = new Set(likedIds);
            next.add(article._id);
            setLikedIds(next);
            setArticle(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
            localStorage.setItem('likedArticles', JSON.stringify([...next]));
            toast.success('Added to favorites');

            await fetch('/api/articles', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: article._id, action: 'like' }),
            });
        } catch (error) { toast.error('Connection error'); }
    };

    // Handle Share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.subtitle || 'Read this article',
                    url: window.location.href,
                });
            } catch (error) { console.log('Error sharing:', error); }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    // --- Loading State (Stone Theme) ---
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Loading Content...</p>
                </div>
            </div>
        );
    }

    // --- Error State ---
    if (!article) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-3xl border border-stone-200 shadow-sm">
                    <BookOpen size={48} className="mx-auto text-stone-300 mb-4" />
                    <h1 className="text-xl font-bold text-stone-900 mb-2">Article not found</h1>
                    <button onClick={() => router.back()} className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider">
                        Return to Archives
                    </button>
                </div>
            </div>
        );
    }

    const isRtlLang = isRTL(article.language);

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-24 selection:bg-amber-100 selection:text-amber-900">
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pt-20"
            >
                {/* 1. Header Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors"
                        aria-label="Go Back"
                    >
                        <div className="p-2 bg-white rounded-full border border-stone-200 group-hover:border-amber-200 shadow-sm transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Back</span>
                    </button>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${article.type === 'poem' ? 'bg-purple-400' : 'bg-amber-400'}`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                            {article.type}
                        </span>
                    </div>
                </div>

                {/* 2. Article Header Info */}
                <div className={`mb-10 ${isRtlLang ? 'text-right' : 'text-left'}`}>
                    {/* Language & Date Row */}
                    <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 ${isRtlLang ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-amber-600">{article.language}</span>
                        <span>•</span>
                        <span>{formatDate(article.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {calculateReadTime(article.content)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-4 leading-[1.1] ${isRtlLang ? 'font-noto-nastaliq' : ''}`}>
                        {article.title}
                    </h1>

                    {/* Subtitle */}
                    {article.subtitle && (
                        <p className={`text-lg md:text-xl text-stone-500 font-serif italic mb-8 leading-relaxed ${isRtlLang ? 'font-noto-nastaliq' : ''}`}>
                            {article.subtitle}
                        </p>
                    )}

                    {/* Author Block */}
                    <div className={`flex items-center gap-3 py-4 border-y border-stone-200/60 ${isRtlLang ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm border border-stone-200">
                            <PenTool  size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">{article.author}</p>
                            <p className="text-[10px] text-stone-400 font-medium">Editorial Contributor</p>
                        </div>
                    </div>
                </div>

                {/* 3. Hero Image with Floating Action Dock */}
                {article.bannerUrl && (
                    <>
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl shadow-stone-200/50 border border-stone-100 group">
                            {/* Share (small) - top-right of image */}
                            <button
                                onClick={handleShare}
                                title="Share this article"
                                aria-label="Share article"
                                className="absolute top-3 right-3 z-20 p-2 bg-white/90 rounded-md shadow-sm text-stone-700 hover:bg-amber-50 transition"
                            >
                                <Share2 size={14} />
                            </button>

                            {/* Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={article.bannerUrl}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Gradient for Text Readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                        </div>

                        {/* Instagram-Style Engagement Bar - Right Under Image (stats aligned right) */}
                        <div className="mb-12 px-4   rounded-lg flex items-center justify-end gap-4">
                            {/* Right-aligned Stats */}
                            <div className="flex items-center gap-5 text-stone-600">
                                {/* Views */}
                                <div className="flex items-center gap-2 select-none">
                                    <Eye size={16} />
                                    <span className="text-xs font-normal text-stone-600">{formatCount(article.views)}</span>
                                </div>

                                {/* Likes (clickable to like) */}
                                <button onClick={handleLike} className="flex items-center gap-2 hover:opacity-90 transition" title="Like this article">
                                    <Heart size={16} className={likedIds.has(article._id) ? 'text-red-500' : 'text-stone-500'} fill={likedIds.has(article._id) ? 'currentColor' : 'none'} />
                                    <span className="text-xs font-normal text-stone-600">{formatCount(article.likes)}</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
                
                {/* 4. Article Content Body */}
                <div
                    className={`prose prose-stone max-w-none text-stone-800 
                        ${isRtlLang 
                            ? 'text-right font-noto-nastaliq prose-xl leading-[2.2]' 
                            : 'text-left prose-lg leading-loose'
                        }
                        prose-headings:font-serif prose-headings:text-stone-900
                        prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                        prose-strong:text-stone-900 prose-strong:font-bold
                    `}
                    dir={isRtlLang ? 'rtl' : 'ltr'}
                    style={{ fontFamily: isRtlLang ? '"Noto Nastaliq Urdu", serif' : 'inherit' }}
                >
                    {/* Editorial Drop Cap (Only for LTR) */}
                    {(!isRtlLang && article.content) && (
                        <span className="float-left text-6xl font-bold text-amber-600 mr-3 mt-[-8px] font-serif leading-none">
                            {article.content.charAt(0)}
                        </span>
                    )}

                    {article.content?.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-6 first-letter:float-none text-base sm:text-lg">
                            {(!isRtlLang && i === 0) ? paragraph.slice(1) : paragraph}
                        </p>
                    ))}
                </div>

                {/* 5. Footer / End Marker */}
                <div className="mt-20 pt-12 border-t border-stone-200 flex flex-col items-center text-center">
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-amber-100 rounded-full blur-xl opacity-50"></div>
                        <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                            <Feather size={20} />
                        </div>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">End of Article</h3>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-widest mb-8">Thank you for reading</p>
                    
                    <button
                        onClick={() => router.push('/articles')}
                        className="px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-amber-500 hover:text-stone-900 transition-all shadow-lg hover:shadow-amber-500/20"
                    >
                        Read More Articles
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
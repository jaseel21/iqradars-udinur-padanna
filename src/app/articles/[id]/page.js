'use client';
import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    ArrowLeft, Share2, Heart, Calendar, User, Clock, Feather, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- HELPERS ---
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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
    const [viewedIds, setViewedIds] = new useState(new Set());

    // --- Effects (Persistence & Views) ---
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
                // Optimistic update
                const next = new Set(viewedIds);
                next.add(article._id);
                setViewedIds(next);
                localStorage.setItem('viewedArticles', JSON.stringify([...next]));
                
                // Optimistically update article state views
                setArticle(prev => ({ ...prev, views: (prev.views || 0) + 1 }));

                // API Call
                await fetch('/api/articles', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: article._id, action: 'view' }),
                });
            } catch (error) { console.error(error); }
        };
        updateView();
    }, [article, viewedIds]);

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
            // Increment likes count on state
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.subtitle || 'Check out this article!',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
                    <Link href="/articles" className="text-emerald-600 hover:underline">Return to articles</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 pb-24 selection:bg-emerald-100 selection:text-emerald-900">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-6 py-12 pt-12"
            >
                {/* Simple Back Button */}
                <button
                    onClick={() => router.back()}
                    className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 mb-8"
                    aria-label="Go Back"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to articles</span>
                </button>

                {/* Article Meta (Simplified for views, as views are also on the banner) */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold uppercase tracking-wider rounded-full text-xs">
                        {article.type}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider rounded-full text-xs">
                        {article.language}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        <span>{calculateReadTime(article.content)}</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className={`text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1] ${isRTL(article.language) ? 'font-noto-nastaliq text-right' : ''}`}>
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className={`text-xl md:text-2xl text-slate-500 font-light italic mb-12 leading-relaxed ${isRTL(article.language) ? 'font-noto-nastaliq text-right' : ''}`}>
                        {article.subtitle}
                    </p>
                )}

                {/* Author */}
                <div className="flex items-center gap-4 mb-12 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-lg shadow-sm">
                        {article.author?.[0] || 'A'}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{article.author}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Author</p>
                    </div>
                </div>

                {/* Banner with professional Action Overlay */}
                {article.bannerUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
                        {/* Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.bannerUrl} alt={article.title} className="w-full h-full object-cover" />

                        {/* Action Overlay (Bottom Right) */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-3">
                            
                            {/* View Count Display (Non-interactive) */}
                            <div
                                className="flex items-center gap-2 p-3 rounded-full backdrop-blur-sm bg-white/70 text-slate-700 border border-slate-200 shadow-lg"
                            >
                                <Eye size={20} />
                                <span className="font-semibold text-sm mr-1">
                                    {formatCount(article.views)}
                                </span>
                            </div>

                            {/* Like Button with Count */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 p-3 rounded-full transition-all backdrop-blur-sm bg-white/70 shadow-lg border ${likedIds.has(article._id) ? 'text-red-600 border-red-200 hover:bg-red-50/80' : 'text-slate-700 border-slate-200 hover:bg-slate-100/80'}`}
                                aria-label={likedIds.has(article._id) ? 'Liked' : 'Like Article'}
                            >
                                <Heart size={20} fill={likedIds.has(article._id) ? "currentColor" : "none"} />
                                <span className="font-semibold text-sm mr-1">
                                    {formatCount(article.likes)}
                                </span>
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="p-3 rounded-full backdrop-blur-sm bg-white/70 text-slate-700 border border-slate-200 hover:bg-slate-100/80 transition-colors shadow-lg"
                                aria-label="Share Article"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Content */}
                <div
                    className={`prose prose-slate max-w-none text-slate-800 ${isRTL(article.language)
                            ? 'text-right font-noto-nastaliq prose-2xl leading-[2.5]'
                            : 'text-left prose-lg md:prose-xl leading-loose'
                        }`}
                    dir={isRTL(article.language) ? 'rtl' : 'ltr'}
                    style={{ fontFamily: article.language === 'Urdu' ? '"Noto Nastaliq Urdu", serif' : 'inherit' }}
                >
                    {/* Drop Cap for English Articles */}
                    {(!isRTL(article.language) && article.content) && (
                        <span className="float-left text-7xl font-bold text-emerald-900 mr-4 mt-[-10px] font-serif">
                            {article.content.charAt(0)}
                        </span>
                    )}

                    {article.content?.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-8 first-letter:float-none">{
                            // If drop cap is used, slice first char from first paragraph
                            (!isRTL(article.language) && i === 0) ? paragraph.slice(1) : paragraph
                        }</p>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                        <Feather size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">End of Article</h3>
                    <p className="text-slate-500 mb-8">Thank you for reading</p>
                </div>

            </motion.div>
        </div>
    );
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Languages, Search, Filter, X, Feather, BookOpen, Heart, Eye } from 'lucide-react';

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const isRTL = (language = '') =>
  /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());
const formatCount = (value = 0) => new Intl.NumberFormat().format(value || 0);

export default function ArticlesShowcase({ articles = [] }) {
  const [entries, setEntries] = useState(articles);
  const [languageFilter, setLanguageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    setEntries(articles);
  }, [articles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const viewed = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    setLikedIds(new Set(liked));
    setViewedIds(new Set(viewed));
  }, []);

  useEffect(() => {
    if (!selectedArticle || !selectedArticle._id || selectedArticle.isPlaceholder) return;
    if (viewedIds.has(selectedArticle._id)) return;
    (async () => {
      try {
        const res = await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedArticle._id, action: 'view' }),
        });
        if (res.ok) {
          const data = await res.json();
          setEntries((prev) =>
            prev.map((entry) =>
              entry._id === selectedArticle._id ? { ...entry, views: data.views } : entry
            )
          );
          const next = new Set(viewedIds);
          next.add(selectedArticle._id);
          setViewedIds(next);
          if (typeof window !== 'undefined') {
            localStorage.setItem('viewedArticles', JSON.stringify([...next]));
          }
        }
      } catch (error) {
        console.error('Failed to record view', error);
      }
    })();
  }, [selectedArticle, viewedIds]);

  const languages = useMemo(() => {
    const set = new Set(entries.map((a) => a.language || 'English'));
    return Array.from(set);
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((article) => {
      const matchesLanguage = languageFilter === 'all' || article.language === languageFilter;
      const matchesType = typeFilter === 'all' || article.type === typeFilter;
      const matchesSearch =
        !search ||
        article.title?.toLowerCase().includes(search.toLowerCase()) ||
        article.author?.toLowerCase().includes(search.toLowerCase());
      return matchesLanguage && matchesType && matchesSearch;
    });
  }, [entries, languageFilter, typeFilter, search]);

  const highlight = filtered[0] || entries[0];
  const rest = highlight ? filtered.filter((article) => article._id !== highlight._id) : filtered;

  const persistLiked = (nextSet) => {
    setLikedIds(new Set(nextSet));
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedArticles', JSON.stringify([...nextSet]));
    }
  };

  const handleLike = async (article) => {
    if (!article?._id || article.isPlaceholder) return;
    if (likedIds.has(article._id)) {
      toast('You already liked this article');
      return;
    }
    try {
      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article._id, action: 'like' }),
      });
      if (!res.ok) throw new Error('Failed to like article');
      const data = await res.json();
      setEntries((prev) =>
        prev.map((entry) => (entry._id === article._id ? { ...entry, likes: data.likes } : entry))
      );
      const next = new Set(likedIds);
      next.add(article._id);
      persistLiked(next);
      toast.success('Thanks for appreciating this piece!');
    } catch (error) {
      console.error('Like error', error);
      toast.error('Unable to like article right now');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Articles & Poetry</p>
          <h1 className="text-4xl font-bold text-gray-900">
            Sacred insights & soulful verses
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore curated articles and heartfelt poems across multiple languages. Experience
            knowledge, reflection, and devotion through beautifully formatted narratives.
          </p>
        </div>

        {/* Highlighted article */}
        {highlight && (
          <motion.div
            layout
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row"
          >
            {highlight.bannerUrl && (
              <div className="md:w-1/2 h-72 md:h-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={highlight.bannerUrl}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div
              className={`flex-1 p-8 space-y-5 ${
                isRTL(highlight.language) ? 'text-right' : 'text-left'
              }`}
              dir={isRTL(highlight.language) ? 'rtl' : 'ltr'}
            >
              <div className="flex flex-wrap gap-3 text-sm text-emerald-600 font-semibold">
                <span className="px-3 py-1 bg-emerald-50 rounded-full">{highlight.type}</span>
                <span className="px-3 py-1 bg-emerald-50 rounded-full flex items-center space-x-1">
                  <Languages size={14} />
                  <span>{highlight.language}</span>
                </span>
                <span className="px-3 py-1 bg-emerald-50 rounded-full">{formatDate(highlight.createdAt)}</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Featured</p>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{highlight.title}</h2>
                {highlight.subtitle && (
                  <p className="text-gray-600 mt-3">{highlight.subtitle}</p>
                )}
              </div>
              <p className="text-gray-700 line-clamp-4">
                {highlight.content?.slice(0, 400)}...
              </p>
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 gap-3">
                <span>By {highlight.author || 'Editorial Team'}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleLike(highlight)}
                    disabled={!highlight._id || highlight.isPlaceholder || likedIds.has(highlight._id)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${
                      likedIds.has(highlight._id)
                        ? 'bg-emerald-50 text-emerald-700 border-transparent'
                        : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={highlight._id && likedIds.has(highlight._id) ? 'currentColor' : 'none'}
                    />
                    <span>{formatCount(highlight.likes)}</span>
                  </button>
                  <span className="inline-flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{formatCount(highlight.views)}</span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedArticle(highlight)}
                  className="inline-flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  <span>Read spotlight</span>
                  <BookOpen size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-3 border rounded-xl px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or writer"
              className="flex-1 outline-none text-sm"
            />
          </div>
          <div className="flex items-center space-x-3 border rounded-xl px-4 py-3">
            <Languages size={18} className="text-gray-400" />
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
            >
              <option value="all">All languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 border rounded-xl px-4 py-3">
            <Filter size={18} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent"
            >
              <option value="all">Articles & Poems</option>
              <option value="article">Articles</option>
              <option value="poem">Poems</option>
            </select>
          </div>
        </div>

        {/* Remaining articles */}
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((article) => (
            <motion.article
              layout
              key={article._id}
              className={`bg-white rounded-2xl border border-emerald-50 p-6 shadow-sm hover:shadow-lg transition flex flex-col ${
                isRTL(article.language) ? 'text-right' : 'text-left'
              }`}
              dir={isRTL(article.language) ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="uppercase tracking-[0.3em] text-gray-400">{article.type}</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
              {article.subtitle && (
                <p className="text-gray-500 text-sm mb-3">{article.subtitle}</p>
              )}
              <p className="text-gray-600 text-sm line-clamp-4 flex-1">
                {article.content?.slice(0, 300)}...
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500 flex-wrap gap-3">
                <span>By {article.author || 'Editorial Team'}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(article)}
                    disabled={!article._id || article.isPlaceholder || likedIds.has(article._id)}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border ${
                      likedIds.has(article._id)
                        ? 'bg-emerald-50 text-emerald-700 border-transparent'
                        : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Heart
                      size={14}
                      fill={article._id && likedIds.has(article._id) ? 'currentColor' : 'none'}
                    />
                    <span>{formatCount(article.likes)}</span>
                  </button>
                  <span className="inline-flex items-center space-x-1 text-gray-500">
                    <Eye size={14} />
                    <span>{formatCount(article.views)}</span>
                  </span>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center space-x-2"
                  >
                    <span>Read</span>
                    <Feather size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {rest.length === 0 && (!highlight || filtered.length <= 1) && (
          <p className="text-center text-gray-500 py-12">No additional entries match your filters.</p>
        )}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {selectedArticle.bannerUrl && (
                <div className="h-56 w-full overflow-hidden rounded-t-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedArticle.bannerUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div
                className={`p-8 space-y-4 ${
                  isRTL(selectedArticle.language) ? 'text-right' : 'text-left'
                }`}
                dir={isRTL(selectedArticle.language) ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{selectedArticle.language}</span>
                  <span>{formatDate(selectedArticle.createdAt)}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">
                    {selectedArticle.type}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedArticle.title}</h2>
                  {selectedArticle.subtitle && (
                    <p className="text-gray-500 mt-2">{selectedArticle.subtitle}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">By {selectedArticle.author || 'Editorial Team'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => handleLike(selectedArticle)}
                    disabled={
                      !selectedArticle._id ||
                      selectedArticle.isPlaceholder ||
                      likedIds.has(selectedArticle._id)
                    }
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${
                      likedIds.has(selectedArticle._id)
                        ? 'bg-emerald-50 text-emerald-700 border-transparent'
                        : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={
                        selectedArticle._id && likedIds.has(selectedArticle._id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                    <span>{formatCount(selectedArticle.likes)}</span>
                  </button>
                  <span className="inline-flex items-center space-x-2">
                    <Eye size={16} />
                    <span>{formatCount(selectedArticle.views)}</span>
                  </span>
                </div>
                <div
                  className="text-lg text-gray-800 whitespace-pre-line leading-relaxed"
                  style={{
                    fontFamily: selectedArticle.fontFamily,
                    direction: isRTL(selectedArticle.language) ? 'rtl' : 'ltr',
                    textAlign: isRTL(selectedArticle.language) ? 'right' : 'left',
                  }}
                >
                  {selectedArticle.content}
                </div>
                {selectedArticle.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-50 text-emerald-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link
                    href="/contact"
                    className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
                  >
                    Request printed copy
                  </Link>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="ml-auto flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


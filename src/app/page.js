'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowRight, BookOpen, Users, Target, Newspaper,
  Play, Heart, Eye, Calendar, Quote, ExternalLink, 
  Film, Award, Globe
} from 'lucide-react';

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

  // Article logic
  const featuredArticle = articles[0];
  const supportingArticles = articles.slice(1, 4);

  // News logic
  const latestNews = news.length > 0 ? news[0] : null;
  const recentNews = news.slice(1, 4);

  // Video playlist
  const videoPlaylist = videos.filter(v => v._id !== activeVideo?._id).slice(0, 3);

  // Stats data
  

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mt-6">
          Loading Excellence...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {banners.length > 0 ? (
            banners.map((banner, idx) => (
              <div
                key={banner._id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image 
                  src={banner.imageUrl} 
                  alt={banner.title || "Banner"} 
                  fill
                  className="object-cover" 
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-slate-950" />
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase">
                  Excellence in Education
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Iqra Dars<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Udinur & Padanna
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl">
                {contentData?.description || "Dedicated to spreading knowledge, faith, and wisdom through comprehensive Islamic education and modern academic excellence."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2">
                    Begin Journey
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/organizations">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all">
                    View Structure
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 right-4 sm:right-8 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === currentBannerIndex ? 'w-8 bg-emerald-400' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </section>

     

      {/* MISSION SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Target size={14} />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Guiding Towards <span className="text-emerald-600">Excellence</span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                {contentData?.mission || "To illuminate hearts and minds with the light of Islamic knowledge, guiding individuals on the path of righteousness."}
              </p>
              <p className="text-slate-600 leading-relaxed">
                We nurture highly qualified Islamic scholars through comprehensive structured education, preserving cultural heritage while guiding students toward bilingual proficiency.
              </p>
            </div>
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800" 
                alt="Mission" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                <BookOpen size={14} />
                Insights
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                Latest <span className="text-emerald-600">Articles</span>
              </h2>
            </div>
            <Link href="/articles">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-sm font-semibold">
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Featured Article */}
              {featuredArticle && (
                <div className="lg:row-span-2">
                  <Link
                    href={`/articles/${featuredArticle._id}`}
                    onClick={() => handleArticleView(featuredArticle)}
                    className="group block relative h-full min-h-[400px] sm:min-h-[600px] rounded-2xl overflow-hidden shadow-xl"
                  >
                    <Image 
                      src={featuredArticle.bannerUrl || '/placeholder.jpg'} 
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase mb-4">
                        {featuredArticle.type || 'Featured'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                        {featuredArticle.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span className="font-medium">{featuredArticle.author || "Editorial Team"}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {formatCount(featuredArticle.views)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleArticleLike(featuredArticle);
                            }}
                            className="flex items-center gap-1 hover:text-red-400 transition-colors"
                          >
                            <Heart size={14} className={likedArticleIds.includes(featuredArticle._id) ? 'fill-red-500 text-red-500' : ''} />
                            {formatCount(featuredArticle.likes)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Supporting Articles */}
              {supportingArticles.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article._id}`}
                  onClick={() => handleArticleView(article)}
                  className="group flex gap-4 p-4 sm:p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={article.bannerUrl || '/placeholder.jpg'} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">
                      {article.language}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {formatCount(article.views)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleArticleLike(article);
                        }}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart size={12} className={likedArticleIds.includes(article._id) ? 'fill-red-500 text-red-500' : ''} />
                        {formatCount(article.likes)}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-semibold">No articles available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ADVISORY BOARD */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Users size={14} />
              Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Advisory <span className="text-emerald-600">Board</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              Guided by esteemed scholars and community leaders
            </p>
          </div>

          {advisoryMembers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {advisoryMembers.map((member, idx) => (
                <div key={idx} className="group text-center">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image 
                        src={member.image || 'https://via.placeholder.com/150'} 
                        alt={member.name} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{member.name}</h3>
                  <span className="text-xs sm:text-sm text-emerald-600 font-semibold uppercase tracking-wide">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-semibold">Advisory board members coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* MEDIA GALLERY */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Film size={14} />
                Multimedia
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                Campus <span className="text-emerald-600">Gallery</span>
              </h2>
            </div>
            <Link href="/gallery">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all text-sm font-semibold">
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Video Section */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Film className="text-white" size={20} />
                </div>
                Video Spotlight
              </h3>
              
              {activeVideo ? (
                <>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-slate-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtubeUrl)}`}
                      className="w-full h-full"
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{activeVideo.title}</h4>
                    <p className="text-slate-600">Watch our latest events and campus highlights</p>
                  </div>

                  {videoPlaylist.length > 0 && (
                    <div className="space-y-3">
                      {videoPlaylist.map((video) => (
                        <button
                          key={video._id}
                          onClick={() => setActiveVideo(video)}
                          className="w-full flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                        >
                          <div className="relative w-24 sm:w-32 h-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                            {getYouTubeId(video.youtubeUrl) && (
                              <Image 
                                src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeUrl)}/mqdefault.jpg`}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play size={24} className="text-white fill-white" />
                            </div>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h5 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-600 line-clamp-2 transition-colors">
                              {video.title}
                            </h5>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                  <Film size={48} className="text-slate-300 mb-4" />
                  <p className="text-slate-500 font-semibold">No videos available.</p>
                </div>
              )}
            </div>

            {/* News Section */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Newspaper className="text-white" size={20} />
                </div>
                Latest Updates
              </h3>

              {latestNews ? (
                <>
                  <Link href={`/news/${latestNews.slug}`} className="group block relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-2xl">
                    <Image 
                      src={latestNews.thumbnail} 
                      alt={latestNews.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase mb-3">
                        Featured News
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {latestNews.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar size={14} />
                        <span>{formatDate(latestNews.createdAt)}</span>
                      </div>
                    </div>
                  </Link>

                  {recentNews.length > 0 && (
                    <div className="space-y-4">
                      {recentNews.map((newsItem) => (
                        <Link
                          key={newsItem._id}
                          href={`/news/${newsItem.slug}`}
                          className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                        >
                          <div className="relative w-24 sm:w-28 h-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image 
                              src={newsItem.thumbnail || '/placeholder.jpg'} 
                              alt={newsItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                              <Calendar size={12} />
                              <span>{formatDate(newsItem.createdAt)}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors mb-2">
                              {newsItem.title}
                            </h4>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              Read More <ExternalLink size={10} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-10 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <div>
                    <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-semibold">No news available.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-teal-900/10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Users size={14} />
            Join Us
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Community</span>
          </h2>
          
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            Embark on a path of knowledge, wisdom, and spiritual growth. The doors to excellence are open.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <button className="w-full sm:w-auto group px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white transition-all shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50">
                Contact Admissions
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white/50 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
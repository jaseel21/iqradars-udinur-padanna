'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowRight, BookOpen, Users, Target, Newspaper, Play, ChevronLeft, ChevronRight, Feather, Heart, Eye } from 'lucide-react';

export default function Home() {
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

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const viewed = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    setLikedArticleIds(liked);
    setViewedArticleIds(viewed);
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners]);

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
        const contentPayload = await contentRes.json();
        setContentData(contentPayload.content || null);
        setAdvisoryMembers(contentPayload.advisory || []);
      }

      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        setBanners(bannerData.banners || []);
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData.news || []);
      }

      if (videoRes.ok) {
        const videoData = await videoRes.json();
        setVideos(videoData.videos || []);
      }

      if (articleRes.ok) {
        const articleData = await articleRes.json();
        setArticles(articleData.articles || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Static content
  const staticMission = 'To illuminate hearts and minds with the light of Islamic knowledge, guiding individuals on the path of righteousness, and creating a generation of Muslims who are well-grounded in faith and ready to serve their community with wisdom and compassion.';
  const aboutIqraDars = 'Iqra Dars Udinur is a leading Islamic education institution dedicated to spreading knowledge, faith, and wisdom. We provide comprehensive Islamic education and guidance to help individuals strengthen their connection with Allah and understand the teachings of Islam.';
  const aboutUDSA = 'UDSA Organization works in partnership with Iqra Dars Udinur to support educational initiatives, community development, and social welfare programs. Together, we strive to create a positive impact in our community through faith-based education and service.';

  const placeholderArticles = [
    {
      _id: 'placeholder-1',
      isPlaceholder: true,
      title: 'Echoes of Faith',
      subtitle: 'Contemplations on resilience and gratitude',
      author: 'Sheikh Amjad Kareem',
      language: 'English',
      type: 'article',
      bannerUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=960&h=640&fit=crop',
      content: 'In the quiet hours before dawn, hearts awaken with remembrance and gratitude...',
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    },
    {
      _id: 'placeholder-2',
      isPlaceholder: true,
      title: 'പ്രണയത്തിന്റെ മൊഴികൾ',
      subtitle: 'മലയാള കവിതാ സമർപ്പണം',
      author: 'Fathima Rahman',
      language: 'Malayalam',
      type: 'poem',
      bannerUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=960&h=640&fit=crop',
      content: 'സ്വപ്നങ്ങൾ തുറക്കുന്ന കവിത, പ്രണയത്തിന്റെ മിഴികൾ...',
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    },
    {
      _id: 'placeholder-3',
      isPlaceholder: true,
      title: 'Verses in Velvet Night',
      subtitle: 'An Urdu ode to the seeker',
      author: 'Dr. Saifuddin',
      language: 'Urdu',
      type: 'poem',
      bannerUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=960&h=640&fit=crop',
      content: 'رات کے دامن میں چھپے چراغ...',
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    },
  ];

  const articleList = articles.length > 0 ? articles : placeholderArticles;
  const featuredArticle = articleList[0] || null;
  const supportingArticles = articleList.slice(1, 4);

  const advisoryFallback = [
    { name: 'Sheikh Ibrahim Kareem', role: 'Chief Patron', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
    { name: 'Ustadh Maryam Rahman', role: 'Academic Secretary', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { name: 'Dr. Salman Qureshi', role: 'Executive Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
    { name: 'Amina Abdul Wahid', role: 'Community Chair', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
  ];

  const advisoryList = advisoryMembers.length > 0 ? advisoryMembers : advisoryFallback;

  const latestNews = news.length > 0 ? news[0] : null;
  const previousNews = news.slice(1);

  const latestVideo = videos.length > 0 ? videos[0] : null;
  const previousVideos = videos.slice(1);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const formatArticleDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const heroDescription = contentData?.description || aboutIqraDars;
  const missionStatement = contentData?.mission || staticMission;

  const persistLikedArticles = (list) => {
    setLikedArticleIds(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedArticles', JSON.stringify(list));
    }
  };

  const persistViewedArticles = (list) => {
    setViewedArticleIds(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewedArticles', JSON.stringify(list));
    }
  };

  const hasLikedArticle = (id) => likedArticleIds.includes(id);
  const hasViewedArticle = (id) => viewedArticleIds.includes(id);
  const isRTL = (language = '') =>
    /arabic|urdu|farsi|persian|hebrew|pashto/i.test((language || '').toLowerCase());
  const formatCount = (value = 0) => new Intl.NumberFormat().format(value || 0);

  const updateArticleEntry = (id, updates) => {
    if (!id) return;
    setArticles((prev) =>
      prev.map((article) => (article._id === id ? { ...article, ...updates } : article))
    );
  };

  const sendArticleAction = async (id, action) => {
    if (!id || id.startsWith('placeholder-')) return;
    try {
      const res = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        throw new Error('Failed to update article');
      }
      const data = await res.json();
      if (action === 'like') {
        updateArticleEntry(id, { likes: data.likes });
      } else if (action === 'view') {
        updateArticleEntry(id, { views: data.views });
      }
    } catch (error) {
      console.error('Article action error:', error);
      toast.error('Unable to update article stats right now.');
    }
  };

  const handleArticleLike = async (article) => {
    if (!article?._id || article.isPlaceholder) return;
    if (hasLikedArticle(article._id)) {
      toast('You already appreciated this article');
      return;
    }
    await sendArticleAction(article._id, 'like');
    persistLikedArticles([...likedArticleIds, article._id]);
    toast.success('Thanks for the love!');
  };

  const handleArticleView = async (article) => {
    if (!article?._id || article.isPlaceholder || hasViewedArticle(article._id)) return;
    await sendArticleAction(article._id, 'view');
    persistViewedArticles([...viewedArticleIds, article._id]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner._id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={banner.imageUrl}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
              </div>
            ))}
            {/* Banner Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBannerIndex ? 'w-12 bg-white' : 'w-2 bg-white/60'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
            {/* Arrow Navigation */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all"
                  aria-label="Next banner"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-700 to-green-600">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-7xl font-bold font-amiri mb-6 tracking-tight"
          >
            Iqra Dars Udinur
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-xl md:text-2xl text-white/95 leading-relaxed mb-8"
          >
            {heroDescription}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/contact">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <span>Get In Touch</span>
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/organizations">
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30">
                Learn More
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Articles & Poems Preview */}
      {featuredArticle && (
       <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 space-y-10">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.4em] text-emerald-500">Articles & Poems</p>
      <h2 className="text-4xl font-bold text-gray-900">Thoughtful reads in every language</h2>
      <p className="text-gray-600 max-w-3xl mx-auto">
        Explore scholarly reflections, community stories, and heartfelt poems curated for today&apos;s reader. Latest entries are highlighted for quick reading.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-10">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-100">
        {featuredArticle.bannerUrl && (
          <Image
            src={featuredArticle.bannerUrl}
            alt={featuredArticle.title}
            width={960}
            height={640}
            className="w-full h-72 object-cover"
          />
        )}
        <div
          className={`p-8 space-y-4 bg-gradient-to-b from-white to-emerald-50 ${
            isRTL(featuredArticle.language) ? 'text-right' : 'text-left'
          }`}
          dir={isRTL(featuredArticle.language) ? 'rtl' : 'ltr'}
        >
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-emerald-600">
            <span>{featuredArticle.type}</span>
            <span>{featuredArticle.language}</span>
            <span>{formatArticleDate(featuredArticle.createdAt)}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{featuredArticle.title}</h3>
          {featuredArticle.subtitle && (
            <p className="text-gray-600">{featuredArticle.subtitle}</p>
          )}
          <p className="text-sm text-gray-500">By {featuredArticle.author || 'Editorial Team'}</p>
          <p className="text-gray-700 leading-relaxed line-clamp-4">
            {featuredArticle.content?.slice(0, 400)}...
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleArticleLike(featuredArticle)}
              disabled={
                !featuredArticle._id ||
                featuredArticle.isPlaceholder ||
                hasLikedArticle(featuredArticle._id)
              }
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold ${
                hasLikedArticle(featuredArticle._id)
                  ? 'bg-emerald-50 text-emerald-700 border-transparent'
                  : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
              }`}
            >
              <Heart
                size={18}
                className="transition-colors"
                fill={hasLikedArticle(featuredArticle._id) ? 'currentColor' : 'none'}
              />
              <span>{formatCount(featuredArticle.likes)}</span>
            </button>
            <span className="inline-flex items-center space-x-2 text-gray-500 text-sm font-medium">
              <Eye size={18} />
              <span>{formatCount(featuredArticle.views)}</span>
            </span>
            <Link
              href="/articles"
              onClick={() => handleArticleView(featuredArticle)}
              className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              <span>Read full article</span>
              <ArrowRight size={16} />
            </Link>
            <span className="text-sm text-gray-500">
              Crafted for poetry-friendly reading and multilingual publishing
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {supportingArticles.map((article) => (
          <div
            key={article._id || article.slug || article.title}
            className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-300 transition flex flex-col"
          >
            {article.bannerUrl && (
              <div className="relative w-full h-32">
                <Image
                  src={article.bannerUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div
              className={`p-5 flex flex-col flex-1 ${
                isRTL(article.language) ? 'text-right' : 'text-left'
              }`}
              dir={isRTL(article.language) ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="uppercase tracking-[0.4em]">{article.type}</span>
                <span>{formatArticleDate(article.createdAt)}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3 flex-1 mb-3">
                {article.content?.slice(0, 150)}...
              </p>
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-400">By {article.author || 'Editorial Team'}</p>
                <div className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <Feather size={14} />
                  <span>{article.language}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <button
                  type="button"
                  onClick={() => handleArticleLike(article)}
                disabled={!article._id || article.isPlaceholder || hasLikedArticle(article._id)}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border ${
                    hasLikedArticle(article._id)
                      ? 'bg-emerald-50 text-emerald-700 border-transparent'
                      : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Heart
                    size={14}
                    fill={article._id && hasLikedArticle(article._id) ? 'currentColor' : 'none'}
                  />
                  <span>{formatCount(article.likes)}</span>
                </button>
                <span className="inline-flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{formatCount(article.views)}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
        {supportingArticles.length < 3 && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-emerald-200 flex flex-col justify-center items-start space-y-3 h-64">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Stay tuned</p>
            <h4 className="text-2xl font-semibold text-gray-900">New poems arriving soon</h4>
            <p className="text-gray-600 text-sm">
              We publish reflections and poetry throughout the month. Visit the article studio to explore more.
            </p>
            <Link href="/articles" className="text-emerald-600 font-semibold flex items-center space-x-2">
              <span>Explore archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
</section>
      )}
      {/* About Section - Three Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <BookOpen className="text-emerald-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold font-amiri text-gray-900">About Iqra Dars</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {aboutIqraDars}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold font-amiri text-gray-900">UDSA Organization</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {aboutUDSA}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-5">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Target className="text-purple-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold font-amiri text-gray-900">Our Mission</h3>
        </div>
              <p className="text-gray-600 leading-relaxed">
                {missionStatement}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Advisory Board */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advisory Board</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guided by respected scholars and administrators who provide strategic direction for Iqra Dars Udinur.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisoryList.map((member, index) => (
              <motion.div
                key={member._id || index}
                whileHover={{ y: -6 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 text-center"
              >
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-emerald-50 mb-4">
                  <Image
                    src={member.image || 'https://via.placeholder.com/200'}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-emerald-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Latest News - Smaller & More Compact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main News - Takes 2 columns */}
            <div className="lg:col-span-2">
              {latestNews ? (
                <Link href={`/news/${latestNews.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 h-full cursor-pointer"
                  >
                    <div className="relative h-56">
                      <Image
                        src={latestNews.thumbnail}
                        alt={latestNews.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{latestNews.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {latestNews.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                      <div className="flex items-center text-emerald-600 text-sm font-semibold">
                        <span>Read More</span>
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div className="bg-gray-100 rounded-xl p-12 text-center">
                  <Newspaper size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No news available yet</p>
                </div>
              )}
            </div>
            {/* Previous News - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {previousNews.length > 0 ? (
                previousNews.map((item) => (
                  <Link key={item._id} href={`/news/${item.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-28 h-28 flex-shrink-0">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 py-3 pr-4">
                          <h5 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">{item.title}</h5>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {item.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No previous news</p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Videos - Smaller & More Compact */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Take a Look Here!</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Video - Takes 2 columns */}
            <div className="lg:col-span-2">
              {latestVideo ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(latestVideo.youtubeUrl)}`}
                      title={latestVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{latestVideo.title}</h3>
                    {latestVideo.description && (
                      <p className="text-gray-600 text-sm">{latestVideo.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-12 text-center">
                  <Play size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No videos available yet</p>
                </div>
              )}
            </div>
            {/* Previous Videos - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {previousVideos.length > 0 ? (
                previousVideos.map((video) => {
                  const videoId = getYouTubeId(video.youtubeUrl);
                  return (
                    <motion.div
                      key={video._id}
                      whileHover={{ x: 4 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer border border-gray-100"
                      onClick={() => {
                        setVideos([video, ...videos.filter(v => v._id !== video._id)]);
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="relative w-36 h-24 flex-shrink-0">
                          {videoId ? (
                            <Image
                              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Play size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-2">
                              <Play size={16} className="text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 py-3 pr-4">
                          <h5 className="font-semibold text-gray-900 line-clamp-2 text-sm">{video.title}</h5>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-sm">No previous videos</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
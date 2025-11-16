'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Target, Newspaper, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
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
      const [bannerRes, newsRes, videoRes] = await Promise.all([
        fetch('/api/banner'),
        fetch('/api/news'),
        fetch('/api/video'),
      ]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Banner Section with Slider */}
      <section className="relative h-screen flex items-center justify-center text-white text-center px-4 overflow-hidden">
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
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
            {/* Banner Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBannerIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  aria-label="Next banner"
                >
                  <ChevronRight size={24} />
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
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-amiri mb-4"
          >
            Iqra Dars Udinur
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {aboutIqraDars}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Link href="/contact">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2">
                <span>Get In Touch</span>
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/organizations">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30">
                Learn More
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Iqra Dars, UDSA Organization, and Mission - Single Row */}
      <AnimatedSection title="" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-600 dark:bg-green-700 p-4 rounded-full">
                <BookOpen className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-amiri text-gray-800 dark:text-gray-100">About Iqra Dars</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{aboutIqraDars}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-600 dark:bg-blue-700 p-4 rounded-full">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-amiri text-gray-800 dark:text-gray-100">UDSA Organization</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{aboutUDSA}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-purple-600 dark:bg-purple-700 p-4 rounded-full">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-amiri text-gray-800 dark:text-gray-100">Our Mission</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{staticMission}</p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Latest News Section */}
      <AnimatedSection title="Latest News" className="py-16 bg-white dark:bg-gray-900">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main News Display */}
          <div className="lg:col-span-2">
            {latestNews ? (
              <Link href={`/news/${latestNews.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                >
                  <div className="relative h-64 md:h-96">
                    <Image
                      src={latestNews.thumbnail}
                      alt={latestNews.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                      {latestNews.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {latestNews.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                    </p>
                    <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                      <span className="font-semibold">Read More</span>
                      <ArrowRight size={20} className="ml-2" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center">
                <Newspaper size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No news available yet</p>
              </div>
            )}
          </div>

          {/* Side News List */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Previous News</h4>
            {previousNews.length > 0 ? (
              previousNews.map((item) => (
                <Link key={item._id} href={`/news/${item.slug}`}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-1">
                          {item.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">No previous news</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Take a Look Here! - YouTube Videos Section */}
      <AnimatedSection title="Take a Look Here!" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Display */}
          <div className="lg:col-span-2">
            {latestVideo ? (
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(latestVideo.youtubeUrl)}`}
                    title={latestVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {latestVideo.title}
                  </h3>
                  {latestVideo.description && (
                    <p className="text-gray-600 dark:text-gray-400">{latestVideo.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center">
                <Play size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No videos available yet</p>
              </div>
            )}
          </div>

          {/* Side Video List */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Previous Videos</h4>
            {previousVideos.length > 0 ? (
              previousVideos.map((video) => {
                const videoId = getYouTubeId(video.youtubeUrl);
                return (
                  <motion.div
                    key={video._id}
                    whileHover={{ x: 5 }}
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                    onClick={() => {
                      setVideos([video, ...videos.filter(v => v._id !== video._id)]);
                    }}
                  >
                    <div className="relative aspect-video">
                      {videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Play size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 text-sm">
                        {video.title}
                      </h5>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">No previous videos</p>
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

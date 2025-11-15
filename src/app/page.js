'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, MapPin } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function Home() {
  const [data, setData] = useState({ description: '', goals: '', mission: '', board: [], socials: [], location: {} });
  const [loading, setLoading] = useState(true);

  // Demo fallbacks
  const demoData = {
    description: 'Iqra Dars Udinur...',
    goals: 'Empower...',
    mission: 'To illuminate...',
    board: [
      { name: 'Sheikh Ahmed', role: 'Lead Scholar', image: 'https://via.placeholder.com/150?text=Sheikh', bio: 'Expert in Fiqh.' },
      // Add 2-3 more
    ],
    socials: [
      { name: 'Instagram', url: 'https://instagram.com/iqradars', icon: <Instagram /> },
      { name: 'Facebook', url: 'https://facebook.com/iqradars', icon: <Facebook /> },
      // Add more
    ],
    location: { address: '123 Islamic St, City, Country', mapEmbed: 'https://www.google.com/maps/embed?pb=...' },
    gallery: [] // From separate fetch if needed
  };

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch('/api/content');
      if (res.ok) {
        const fetched = await res.json();
        setData({
          ...demoData,
          ...fetched,
          board: fetched.board || demoData.board,
          socials: fetched.socials || demoData.socials,
          location: fetched.location || demoData.location
        });
      } else {
        setData(demoData);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero h-screen flex items-center justify-center text-white text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h1 initial={{ y: 50 }} animate={{ y: 0 }} className="text-6xl font-amiri">{data.description.split(' ')[0]}</motion.h1>
          <p className="text-xl">{data.description}</p>
          <Link href="/contact"><button className="bg-yellow-300 text-green-800 px-8 py-4 rounded-full">Explore</button></Link>
        </div>
      </section>

      {/* Goals & Mission */}
      <AnimatedSection title="Our Vision">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div className="card"><h3 className="text-2xl font-amiri mb-4">Goals</h3><p>{data.goals}</p></motion.div>
          <motion.div className="card"><h3 className="text-2xl font-amiri mb-4">Mission</h3><p>{data.mission}</p></motion.div>
        </div>
      </AnimatedSection>

      {/* Gallery Teaser */}
      <AnimatedSection title="Gallery Highlights">
        <div className="grid md:grid-cols-3 gap-4">
          {data.gallery.slice(0, 3).map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-lg">
              <Image src={img.url} alt={img.alt} width={400} height={300} className="w-full h-48 object-cover" />
            </motion.div>
          ))}
        </div>
        <Link href="/gallery"><button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">View Full Gallery</button></Link>
      </AnimatedSection>

      {/* Advisory Board Teaser */}
      <AnimatedSection title="Our Leaders">
        <div className="grid md:grid-cols-4 gap-6">
          {data.board.slice(0, 4).map((member, i) => (
            <motion.div key={i} className="card text-center" whileHover={{ y: -10 }}>
              <Image src={member.image} alt={member.name} width={150} height={150} className="rounded-full mx-auto mb-2" />
              <h4 className="font-bold">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
              <p className="text-xs">{member.bio}</p>
            </motion.div>
          ))}
        </div>
        <Link href="/board"><button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Meet the Board</button></Link>
      </AnimatedSection>

      {/* Contact Teaser */}
      <AnimatedSection title="Connect With Us">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg mb-4">Stay connected via social media.</p>
            <div className="flex space-x-4">
              {data.socials.map((s, i) => (
                <motion.a key={i} href={s.url} target="_blank" whileHover={{ scale: 1.1 }} className="text-2xl">
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <form className="space-y-2">
              <input placeholder="Email" className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Subscribe</button>
            </form>
          </div>
        </div>
        <Link href="/contact"><button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Full Contact</button></Link>
      </AnimatedSection>

      {/* Location Teaser */}
      <AnimatedSection title="Our Location">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-amiri mb-4">{data.location.address}</h3>
            <MapPin className="text-green-600 mb-2" size={24} />
            <p>Visit us for classes and events.</p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <iframe src={data.location.mapEmbed} width="100%" height="300" className="border-0" />
          </div>
        </div>
        <Link href="/location"><button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Get Directions</button></Link>
      </AnimatedSection>
    </div>
  );
}
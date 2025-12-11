'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
    Users, Shield, Award, ChevronRight, Briefcase, 
    Sparkles, Building2, Search 
} from 'lucide-react';

// --- CSS FOR PREMIUM EDITORIAL FEEL ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-stack: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-serif: 'Playfair Display', serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
  }

  .font-serif {
    font-family: var(--font-serif);
  }

  /* Warm Premium Shadow */
  .premium-card {
    box-shadow: 
      0 10px 40px rgba(120, 113, 108, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-card-hover {
    box-shadow: 
      0 20px 60px rgba(245, 158, 11, 0.15),
      0 0 0 1px rgba(245, 158, 11, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(231, 229, 228, 0.8);
  }
`;

export default function Organizations() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      const res = await fetch('/api/committee');
      if (res.ok) {
        const data = await res.json();
        setCommittees(data.committees || []);
      }
    } catch (error) {
      console.error('Error fetching committees:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50, damping: 20 } 
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 font-stack">
        <style jsx global>{customStyles}</style>
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
           <p className="text-stone-400 text-xs font-bold uppercase tracking-widest animate-pulse">
             Loading ...
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-32 font-stack selection:bg-amber-100 selection:text-amber-900 text-stone-900 overflow-x-hidden">
      <style jsx global>{customStyles}</style>
      
      {/* Background Texture (Subtle Noise or Dots) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(#78716c 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* --- PREMIUM PAGE HERO --- */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <Shield size={12} className="text-amber-600" />
            <span>Organizational Structure</span>
          </motion.div>
          
        
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Meet the dedicated scholars and board members working tirelessly to uphold our mission of excellence.
          </motion.p>

          {/* Stats Bar (Refined) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 inline-flex flex-wrap items-center justify-center gap-4 bg-white p-2 rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-stone-50">
              <Building2 size={20} className="text-amber-600" />
              <div className="text-left">
                <div className="text-xl font-bold text-stone-900 leading-none">{committees.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mt-1">Wings</div>
              </div>
            </div>
            <div className="w-px h-10 bg-stone-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-stone-50">
              <Users size={20} className="text-amber-600" />
              <div className="text-left">
                <div className="text-xl font-bold text-stone-900 leading-none">
                  {committees.reduce((acc, c) => acc + (c.members?.length || 0), 0)}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mt-1">Members</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- COMMITTEES SECTIONS --- */}
        {committees.length > 0 ? (
          <div className="space-y-32">
            {committees.map((committee, cIndex) => (
              <section key={committee._id || cIndex} className="relative group/section scroll-mt-32">
                
                {/* Section Header (Sticky) */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="sticky top-24 z-20 bg-white/95 backdrop-blur-md py-4 px-6 mb-10 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between max-w-5xl mx-auto"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-600 border border-stone-200">
                        <Briefcase size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-stone-900">
                        {committee.wing}
                      </h2>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                        {committee.members?.length || 0} Members
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                    Active Board
                  </div>
                </motion.div>

                {/* Members Grid */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-[1400px] mx-auto"
                >
                  {committee.members && committee.members.length > 0 ? (
                    committee.members.map((member, index) => {
                      const isLeader = member.position?.toLowerCase().includes('chair') || 
                                      member.position?.toLowerCase().includes('president') ||
                                      member.position?.toLowerCase().includes('director');
                      return (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          whileHover={{ y: -6 }}
                          className="group relative bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 flex flex-col items-center text-center"
                        >
                          {/* Image Area */}
                          <div className="relative w-32 h-32 mb-5">
                            {/* Hover Ring */}
                            <div className="absolute -inset-2 rounded-full border border-dashed border-amber-300 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
                            
                            <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-stone-100 bg-stone-100 shadow-inner group-hover:border-white transition-colors">
                              {member.photo ? (
                                <Image
                                  src={member.photo}
                                  alt={member.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                  <Users size={32} />
                                </div>
                              )}
                            </div>

                            {/* Leader Badge */}
                            {isLeader && (
                              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md border-2 border-white z-10" title="Leadership Position">
                                <Award size={12} />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="w-full relative z-10">
                            <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors mb-1 line-clamp-1">
                              {member.name}
                            </h3>
                            
                            {/* Decorative Dash */}
                            <div className="h-0.5 w-6 bg-amber-200 mx-auto my-3 rounded-full group-hover:w-12 transition-all duration-300" />
                            
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 line-clamp-2 min-h-[2.5em]">
                              {member.position}
                            </p>
                            
                            {/* Profile Button (Hidden until hover) */}
                            <div className="h-8 overflow-hidden">
                              <button className="flex items-center justify-center gap-1 mx-auto text-stone-400 text-[10px] font-bold uppercase tracking-widest hover:text-stone-900 transition-all translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                                <span>View Details</span>
                                <ChevronRight size={10} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    // Empty State per Committee
                    <div className="col-span-full py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400">
                      <Users size={32} className="opacity-50 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-wider">Members Pending</p>
                    </div>
                  )}
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          // Empty State Global
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-stone-200 border-dashed max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
               <Search size={32} className="text-stone-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Structure Updating</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto">
              Our organizational chart is currently being updated. Please check back soon.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
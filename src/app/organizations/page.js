'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Shield, Award, ChevronRight, Briefcase, Sparkles, Building2 } from 'lucide-react';

// --- CSS FOR STACK SANS FONT & PREMIUM UTILITIES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  
  :root {
    --font-stack: 'Stack Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-serif: 'Playfair Display', serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
  }

  .premium-card {
    box-shadow: 
      0 20px 60px rgba(15, 23, 42, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .premium-card-hover {
    box-shadow: 
      0 30px 80px rgba(16, 185, 129, 0.15),
      0 0 0 1px rgba(16, 185, 129, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 40, damping: 15 } 
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 font-stack">
        <style jsx global>{customStyles}</style>
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mt-6 flex items-center gap-2"
        >
          <Sparkles size={14} className="text-emerald-500" />
          Loading Structure...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-32 pb-32 font-stack selection:bg-emerald-100 selection:text-emerald-900 text-slate-900">
      <style jsx global>{customStyles}</style>
      
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#059669 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }} 
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-emerald-50/10" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* --- PREMIUM PAGE HERO --- */}
        <div className="text-center max-w-5xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-10 premium-card"
          >
            <div className="p-1.5 rounded-full bg-emerald-100">
              <Shield size={12} className="text-emerald-600" />
            </div>
            <span>Organizational Structure</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.05]"
          >
            Leadership &{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
                Committees
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Meet the dedicated professionals, scholars, and board members working tirelessly to uphold our mission and drive excellence in education.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 premium-card">
              <Building2 size={18} className="text-emerald-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-slate-900">{committees.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Committees</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 premium-card">
              <Users size={18} className="text-emerald-600" />
              <div className="text-left">
                <div className="text-2xl font-bold text-slate-900">
                  {committees.reduce((acc, c) => acc + (c.members?.length || 0), 0)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Members</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- PREMIUM COMMITTEES LIST --- */}
        {committees.length > 0 ? (
          <div className="space-y-40">
            {committees.map((committee, cIndex) => (
              <section key={committee._id || cIndex} className="relative group/section">
                
                {/* Premium Sticky Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="sticky top-24 z-20 glass-panel py-6 px-6 mb-12 rounded-2xl premium-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-40"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center text-white shadow-xl">
                        <Briefcase size={24} className="drop-shadow-sm" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                        {committee.wing}
                      </h2>
                      <p className="text-sm text-slate-500 font-medium">
                        {committee.members?.length || 0} {committee.members?.length === 1 ? 'Member' : 'Members'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                    <Award size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Active</span>
                  </div>
                </motion.div>

                {/* Premium Members Grid */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8"
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
                          whileHover={{ y: -8 }}
                          className="group relative premium-card rounded-3xl p-8 hover:premium-card-hover transition-all duration-500 flex flex-col items-center text-center bg-white/90 backdrop-blur-sm"
                        >
                          {/* Premium Gradient Background on Hover */}
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-teal-50/0 to-emerald-50/0 group-hover:from-emerald-50/30 group-hover:via-teal-50/20 group-hover:to-emerald-50/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                          
                          {/* Image Container with Premium Effects */}
                          <div className="relative w-44 h-44 mb-7 z-10">
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200/50 to-teal-200/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Animated Border Ring */}
                            <motion.div 
                              className="absolute inset-0 rounded-full border-2 border-slate-200 group-hover:border-emerald-300 transition-all duration-500"
                              whileHover={{ scale: 1.05, rotate: 5 }}
                            />
                            
                            {/* Image Container */}
                            <div className="absolute inset-3 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 shadow-inner">
                              {member.photo ? (
                                <Image
                                  src={member.photo}
                                  alt={member.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                                  <Users size={48} strokeWidth={1.5} />
                                </div>
                              )}
                            </div>

                            {/* Premium Leadership Badge */}
                            {isLeader && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3 rounded-full shadow-xl border-4 border-white z-20"
                              >
                                <Award size={18} className="drop-shadow-sm" />
                              </motion.div>
                            )}

                            {/* Decorative Corner Accent */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>

                          {/* Text Info with Premium Typography */}
                          <div className="relative z-10 w-full">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-3 leading-tight">
                              {member.name}
                            </h3>
                            
                            {/* Premium Divider */}
                            <div className="relative h-0.5 w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto mb-4">
                              <div className="absolute inset-0 bg-emerald-500/30 blur-sm" />
                            </div>
                            
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] group-hover:text-emerald-600 transition-colors leading-relaxed">
                              {member.position}
                            </p>
                            
                            {/* Premium View Profile Action */}
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              whileHover={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden mt-4"
                            >
                              <button className="group/btn flex items-center justify-center gap-2 mx-auto text-emerald-600 text-xs font-bold uppercase tracking-wider hover:text-emerald-700 transition-colors">
                                <span>View Profile</span>
                                <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </motion.div>
                          </div>

                          {/* Bottom Accent Line */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full group-hover:w-20 transition-all duration-500" />
                        </motion.div>
                      );
                    })
                  ) : (
                    // Premium Empty State
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="col-span-full py-20 bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 premium-card"
                    >
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Users size={40} className="opacity-40" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Members to be announced</p>
                      <p className="text-xs text-slate-400 mt-1">Check back soon for updates</p>
                    </motion.div>
                  )}
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center border-4 border-slate-200 premium-card">
                <Users size={56} className="text-slate-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Structure Updating</h3>
            <p className="text-slate-600 max-w-md leading-relaxed mb-6">
              We are currently updating our organizational data. Please check back later for the latest information.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <Sparkles size={16} />
              <span>Coming Soon</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
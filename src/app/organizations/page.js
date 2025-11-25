'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Shield, Award, ChevronRight, Briefcase } from 'lucide-react';

// --- CSS FOR STACK SANS FONT ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :root {
    --font-stack: 'Stack Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .font-stack {
    font-family: var(--font-stack);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-stack">
        <style jsx global>{customStyles}</style>
        <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Loading Structure...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-32 font-stack selection:bg-emerald-100 selection:text-emerald-900 text-slate-900">
      <style jsx global>{customStyles}</style>
      
      {/* Background Subtle Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* --- PAGE HERO --- */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm"
          >
            <Shield size={14} />
            <span>Organizational Structure</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.05]"
          >
            Leadership & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Committees</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Meet the dedicated professionals, scholars, and board members working tirelessly to uphold our mission.
          </motion.p>
        </div>

        {/* --- COMMITTEES LIST --- */}
        {committees.length > 0 ? (
          <div className="space-y-32">
            {committees.map((committee, cIndex) => (
              <section key={committee._id || cIndex} className="relative group/section">
                
                {/* Sticky Section Header */}
                <div className="sticky top-20 z-20 bg-[#FDFDFD]/95 backdrop-blur-md py-6 mb-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {committee.wing}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Members Grid */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12"
                >
                  {committee.members && committee.members.length > 0 ? (
                    committee.members.map((member, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 hover:border-transparent flex flex-col items-center text-center"
                      >
                        {/* Image Container */}
                        <div className="relative w-40 h-40 mb-6">
                          {/* Circle Border Effect */}
                          <div className="absolute inset-0 rounded-full border-2 border-slate-100 group-hover:border-emerald-200 group-hover:scale-105 transition-all duration-500" />
                          
                          {/* ACTUAL IMAGE LOGIC - SIMPLIFIED TO WORK LIKE VERSION 1 */}
                          <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-50">
                             {member.photo ? (
                                <Image
                                  src={member.photo}
                                  alt={member.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                  <Users size={40} strokeWidth={1.5} />
                                </div>
                             )}
                          </div>

                          {/* Badge for Chair/President */}
                          {(member.position?.toLowerCase().includes('chair') || member.position?.toLowerCase().includes('president')) && (
                            <div className="absolute bottom-1 right-1 bg-slate-900 text-white p-2 rounded-full shadow-lg border-2 border-white z-10">
                              <Award size={14} />
                            </div>
                          )}
                        </div>

                        {/* Text Info */}
                        <div className="relative z-10 w-full">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 leading-tight">
                            {member.name}
                          </h3>
                          <div className="h-px w-8 bg-emerald-500/30 mx-auto mb-3"></div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                            {member.position}
                          </p>
                          
                          {/* View Profile Action */}
                          <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300 mt-2 opacity-0 group-hover:opacity-100">
                             <button className="text-emerald-600 text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
                                View Profile <ChevronRight size={10} />
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // Empty State
                    <div className="col-span-full py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <Users size={32} className="opacity-50 mb-3" />
                      <p className="text-sm font-medium">Members to be announced.</p>
                    </div>
                  )}
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <Users size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Structure Updating</h3>
            <p className="text-slate-500 max-w-md">
              We are currently updating our organizational data. Please check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
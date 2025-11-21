'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import { Users } from 'lucide-react';

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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection title="Organizations and Committees" className="py-16">
          {committees.length > 0 ? (
            <div className="space-y-16">
              {committees.map((committee) => (
                <motion.div
                  key={committee._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-8 py-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-600 p-4 rounded-full">
                        <Users className="text-white" size={28} />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">
                        {committee.wing}
                      </h2>
                    </div>
                  </div>

                  <div className="px-8 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                      {committee.members && committee.members.length > 0 ? (
                        committee.members.map((member, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="text-center bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-green-600 shadow-md">
                              <Image
                                src={member.photo}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {member.name}
                            </h3>
                            <p className="text-green-600 font-semibold text-lg">
                              {member.position}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-3 text-center py-12 text-lg">
                          No members added yet
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No committees available yet
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

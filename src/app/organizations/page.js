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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection title="Organizations and Committees" className="py-16">
          {committees.length > 0 ? (
            <div className="space-y-12">
              {committees.map((committee) => (
                <motion.div
                  key={committee._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-green-600 dark:bg-green-700 p-3 rounded-full">
                      <Users className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {committee.wing}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {committee.members && committee.members.length > 0 ? (
                      committee.members.map((member, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-600 dark:border-green-500">
                            <Image
                              src={member.photo}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {member.name}
                          </h3>
                          <p className="text-green-600 dark:text-green-400 font-semibold">
                            {member.position}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 col-span-3 text-center py-8">
                        No members added yet
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No committees available yet
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

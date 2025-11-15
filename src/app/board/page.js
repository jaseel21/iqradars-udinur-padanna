'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Board() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('/api/content/board')
      .then(res => res.json())
      .then(setMembers);
  }, []);

  return (
    <div className="py-16 px-4">
      <motion.h1 className="text-4xl font-bold text-center mb-8 text-green-800">Advisory Board and Leaders</motion.h1>
      <div className="grid md:grid-cols-4 gap-6">
        {members.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-white p-4 rounded-lg shadow-lg text-center"
          >
            <img src={member.image || '/placeholder.jpg'} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
            <h3 className="font-bold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
'use client';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

export default function Organizations() {
  const subwings = [
    { name: 'Youth Wing', desc: 'Programs for young Muslims.' },
    { name: 'Women\'s Circle', desc: 'Empowering women through faith.' },
    // Add more
  ];

  return (
    <div className="py-16 px-4">
      <AnimatedSection title="Organizations and Subwings">
        <div className="grid md:grid-cols-3 gap-6">
          {subwings.map((wing, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">{wing.name}</h3>
              <p>{wing.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
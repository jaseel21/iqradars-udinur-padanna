import { motion } from 'framer-motion';

export default function AnimatedSection({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 px-4"
    >
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center mb-8 text-green-800"
      >
        {title}
      </motion.h2>
      {children}
    </motion.section>
  );
}
'use client';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Contact() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    if (res.ok) toast.success('Message sent!');
  };

  const socials = [
    { name: 'Facebook', url: 'https://fb.com/iqradars', icon: '📘' },
    { name: 'Instagram', url: 'https://ig.com/iqradars', icon: '📷' },
    // Add more
  ];

  return (
    <div className="py-16 px-4">
      <motion.div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} placeholder="Name" className="w-full p-2 border rounded" />
          <input {...register('email')} placeholder="Email" className="w-full p-2 border rounded" />
          <textarea {...register('message')} placeholder="Message" className="w-full p-2 border rounded h-32" />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Send</button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Social Media</h3>
          <div className="flex space-x-4">
            {socials.map((s, i) => (
              <motion.a key={i} href={s.url} target="_blank" whileHover={{ scale: 1.1 }} className="text-2xl">
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
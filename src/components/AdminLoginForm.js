'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log('=== FORM SUBMIT START ===');
    console.log('Form data:', data);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      console.log('Response status:', res.status);
      console.log('Response headers (cookies set?):', res.headers.get('set-cookie'));

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || 'Login successful! Redirecting...');
        // Use window.location for full page reload to ensure cookie is read
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        const errorData = await res.json();
        console.log('Error response:', errorData);
        toast.error(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Network error. Try again.');
    } finally {
      setIsLoading(false);
      console.log('=== FORM SUBMIT END ===');
    }
  };

  return (
    // Wrap the form in a centered container that takes up the full screen
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-2xl shadow-emerald-900/10 w-full max-w-md space-y-6 border border-slate-100"
      >
        
        {/* Header/Branding Area */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 mb-3 rounded-full  text-emerald-600 shadow-lg shadow-emerald-500/20">
           <img src='/icon.png' className='h-16 bg-white p-1'></img>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Secure access to manage the content.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Email Address
            </label>
            <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                    }
                  })} 
                  type="email"
                  placeholder="Email" 
                  className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition-all text-slate-900 ${
                    errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                  disabled={isLoading}
                />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Password
            </label>
            <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  {...register('password', { required: 'Password is required' })} 
                  type="password"
                  placeholder="********" 
                  className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 transition-all text-slate-900 ${
                    errors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                  disabled={isLoading}
                />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 disabled:bg-emerald-700/70 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login Securely</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-slate-400 pt-4">
            For authorized personnel only. Contact support for access issues.
        </p>

      </motion.div>
    </div>
  );
}
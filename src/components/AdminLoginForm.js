'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT START ===');
    console.log('Form data:', formData);
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log('Response status:', res.status);
      console.log('Response headers (cookies set?):', res.headers.get('set-cookie'));

      if (res.ok) {
        const data = await res.json();
        // Toast success notification would go here
        console.log('Login successful:', data.message || 'Login successful! Redirecting...');
        
        // Use window.location for full page reload to ensure cookie is read
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        const errorData = await res.json();
        console.log('Error response:', errorData);
        setErrors({ general: errorData.error || 'Login failed' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ general: 'Network error. Try again.' });
    } finally {
      setIsLoading(false);
      console.log('=== FORM SUBMIT END ===');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-purple-200/30 to-emerald-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50"
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full" />
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
            className="relative mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
           
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight"
          >
            Admin Portal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm mt-2"
          >
            Secure access to manage content
          </motion.p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">{errors.general}</p>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
              Email Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 ${errors.email ? 'opacity-0' : ''}`} />
              <div className="relative">
                <Mail size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'
                }`} />
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="admin@example.com" 
                  className={`relative w-full p-4 pl-12 pr-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-900 bg-white placeholder:text-slate-400 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 bg-red-50/50' 
                      : 'border-slate-200 focus:border-transparent group-focus-within:border-transparent'
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2 font-medium flex items-center"
              >
                <AlertCircle size={12} className="mr-1" />
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 ${errors.password ? 'opacity-0' : ''}`} />
              <div className="relative">
                <Lock size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'
                }`} />
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  className={`relative w-full p-4 pl-12 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-300 text-slate-900 bg-white placeholder:text-slate-400 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 bg-red-50/50' 
                      : 'border-slate-200 focus:border-transparent group-focus-within:border-transparent'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2 font-medium flex items-center"
              >
                <AlertCircle size={12} className="mr-1" />
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="relative w-full mt-8 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login Securely</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </motion.button>
        </form>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-slate-200"
        >
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
            <Shield size={14} className="text-emerald-500" />
            <p>For authorized personnel only</p>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            Contact support for access issues
          </p>
        </motion.div>
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
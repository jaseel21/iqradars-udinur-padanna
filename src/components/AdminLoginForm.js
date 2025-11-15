'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Admin Login</h2>
      
      <div>
        <input 
          {...register('email', { required: 'Email is required' })} 
          type="email"
          placeholder="Email (e.g., iqradars@gmail.com)" 
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <input 
          {...register('password', { required: 'Password is required' })} 
          type="password"
          placeholder="Password (e.g., admin123)" 
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
          disabled={isLoading}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
'use client';
import AdminLoginForm from '@/components/AdminLoginForm';
import { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <AdminLoginForm />
      <Toaster position="top-right" />
    </div>
  );
}
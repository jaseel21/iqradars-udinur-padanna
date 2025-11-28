'use client';
import AdminLoginForm from '@/components/AdminLoginForm';
import { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  return (
    <div className="">
      <AdminLoginForm />
      <Toaster position="top-right" />
    </div>
  );
}
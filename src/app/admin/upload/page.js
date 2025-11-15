'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function Upload() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(false);
      setIsUploading(true);
      const { file } = data;
      
      if (!file || file.length === 0) {
        throw new Error('Please select a file');
      }

      const fileToUpload = file[0];
      
      // Upload file to API route (which handles Supabase and MongoDB)
      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setSuccess(true);
      // Reset form
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please check your Supabase configuration.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Gallery Image</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input 
          type="file" 
          {...register('file', { required: 'Please select a file' })} 
          className="w-full p-2 border rounded"
          accept="image/*"
          disabled={isUploading}
        />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Image uploaded successfully!
          </div>
        )}
        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
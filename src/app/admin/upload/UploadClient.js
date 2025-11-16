'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadClient({ user }) {
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

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
        credentials: 'include',
        body: formData
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(result.error || 'Upload failed');
      }
      
      setSuccess(true);
      setUploadedUrl(result.url);
      toast.success('Image uploaded successfully!');
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setUploadedUrl(null);
      }, 5000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please check your Supabase configuration.');
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
            <h1 className="text-4xl font-bold mb-2">Upload Gallery Image</h1>
            <p className="text-green-100">Upload images to the gallery (Max file size: 10MB)</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-700">
                    Click to select an image or drag and drop
                  </span>
                  <input 
                    type="file" 
                    {...register('file', { required: 'Please select a file' })} 
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => {
                      register('file').onChange(e);
                      setError(null);
                      setSuccess(false);
                    }}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3"
                >
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {success && uploadedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm mt-1">Image uploaded successfully.</p>
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-800 underline mt-2 inline-block"
                    >
                      View uploaded image
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
            </form>

            {/* Preview */}
            {uploadedUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 border-2 border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={uploadedUrl}
                  alt="Uploaded preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


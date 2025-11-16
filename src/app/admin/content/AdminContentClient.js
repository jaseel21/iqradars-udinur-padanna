'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, Upload, Image as ImageIcon, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToSupabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminContentClient({ initialData, user }) {
  const router = useRouter();
  const [data, setData] = useState(initialData || { 
    content: {}, 
    organizations: [], 
    gallery: [], 
    banners: [], 
    news: [], 
    videos: [], 
    committees: [] 
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState({});
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contentRes, bannerRes, newsRes, videoRes, committeeRes] = await Promise.all([
        fetch('/api/content', { credentials: 'include' }),
        fetch('/api/banner', { credentials: 'include' }),
        fetch('/api/news', { credentials: 'include' }),
        fetch('/api/video', { credentials: 'include' }),
        fetch('/api/committee', { credentials: 'include' }),
      ]);

      const allData = { ...data };
      
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        allData.content = contentData.content || {};
        allData.organizations = contentData.organizations || [];
        allData.gallery = contentData.gallery || [];
      }

      if (bannerRes.ok) {
        const bannerData = await bannerRes.json();
        allData.banners = bannerData.banners || [];
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        allData.news = newsData.news || [];
      }

      if (videoRes.ok) {
        const videoData = await videoRes.json();
        allData.videos = videoData.videos || [];
      }

      if (committeeRes.ok) {
        const committeeData = await committeeRes.json();
        allData.committees = committeeData.committees || [];
      }

      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const { register: registerCore, handleSubmit: handleCore, setValue: setCoreValue, reset: resetCore } = useForm({ 
    defaultValues: data.content 
  });

  useEffect(() => {
    if (data.content) {
      resetCore(data.content);
    }
  }, [data.content, resetCore]);

  const handleSaveCore = handleCore(async (formData) => {
    try {
      setSaving(prev => ({ ...prev, core: true }));
      const res = await fetch('/api/content', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'content', ...formData }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to save');
      }
      
      setData({ ...data, content: formData });
      toast.success('Core content saved!');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(prev => ({ ...prev, core: false }));
    }
  });

  const addItem = (type) => {
    const newItem = type === 'board' 
      ? { name: '', role: '', image: '', bio: '' } 
      : type === 'organizations'
      ? { name: '', desc: '' }
      : { name: '', url: '', icon: '' };
    setData({ ...data, [type]: [...(data[type] || []), newItem] });
  };

  const updateItem = (type, index, field, value) => {
    const updated = [...(data[type] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, [type]: updated });
  };

  const saveItems = async (type) => {
    try {
      setSaving(prev => ({ ...prev, [type]: true }));
      const items = data[type] || [];
      
      // Map type to API expected type
      const apiType = type === 'organizations' ? 'organizations' : type;
      
      for (const item of items) {
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: apiType, ...item }),
          credentials: 'include'
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error(`Failed to save ${type}`);
        }
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`);
      fetchAllData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(`Failed to save ${type}`);
    } finally {
      setSaving(prev => ({ ...prev, [type]: false }));
    }
  };

  const deleteItem = async (type, id, index) => {
    if (!confirm(`Delete ${type} item?`)) return;
    
    try {
      // Map type to API expected type
      const apiType = type === 'organizations' ? 'organizations' : type;
      
      const res = await fetch('/api/content', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: apiType }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to delete');
      }
      
      const updated = (data[type] || []).filter((_, i) => i !== index);
      setData({ ...data, [type]: updated });
      toast.success('Item deleted!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const removeItem = (type, index) => {
    const updated = (data[type] || []).filter((_, i) => i !== index);
    setData({ ...data, [type]: updated });
  };

  const handleImageUpload = async (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      const url = await uploadToSupabase(file);
      
      if (type === 'gallery') {
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'gallery', url, category: 'events', alt: file.name }),
          credentials: 'include'
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to upload');
        }
        
        toast.success('Image uploaded!');
        fetchAllData();
      } else {
        updateItem(type, index, 'image', url);
        toast.success('Image uploaded!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload image';
      if (errorMessage.includes('Supabase') || errorMessage.includes('environment variables')) {
        toast.error('Supabase is not configured. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See README for instructions.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading && !data.content) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
            <h1 className="text-4xl font-bold mb-2">Content Management</h1>
            <p className="text-green-100">Manage all site content, gallery, board members, and more</p>
          </div>

          {/* Tabs */}
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <div className="border-b border-gray-200 bg-gray-50">
              <Tab.List className="flex space-x-1 px-6 pt-4 overflow-x-auto">
                {['Core Content', 'Banner', 'News', 'Videos', 'Gallery', 'Organizations', 'Committees', 'Socials', 'Location'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `px-6 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                        selected
                          ? 'bg-white text-green-600 border-t-2 border-l-2 border-r-2 border-green-600 -mb-px'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              {/* Core Content Tab */}
              <Tab.Panel>
                <form onSubmit={handleSaveCore} className="space-y-6">
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        {...registerCore('description')}
                        placeholder="Enter description..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                      <textarea
                        {...registerCore('mission')}
                        placeholder="Enter mission..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        {...registerCore('phone')}
                        placeholder="Enter phone..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        {...registerCore('email')}
                        type="email"
                        placeholder="Enter email..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                      <input
                        {...registerCore('hours')}
                        placeholder="Enter hours..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving.core}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={18} />
                    <span>{saving.core ? 'Saving...' : 'Save All'}</span>
                  </button>
                </form>
              </Tab.Panel>

              {/* Banner Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Manage banner images (up to 3 images for slider)</p>
                    <label className="flex items-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      <Upload size={18} className="mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Banner'}
                      <input
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            setUploading(true);
                            const url = await uploadToSupabase(file);
                            const res = await fetch('/api/banner', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ imageUrl: url, order: data.banners?.length || 0 }),
                              credentials: 'include'
                            });
                            if (res.ok) {
                              toast.success('Banner uploaded!');
                              fetchAllData();
                            } else {
                              throw new Error('Failed to save banner');
                            }
                          } catch (error) {
                            console.error('Upload error:', error);
                            const errorMessage = error.message || 'Failed to upload banner';
                            if (errorMessage.includes('Supabase') || errorMessage.includes('environment variables')) {
                              toast.error('Supabase is not configured. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See README for instructions.');
                            } else {
                              toast.error(errorMessage);
                            }
                          } finally {
                            setUploading(false);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {(data.banners || []).map((banner, i) => (
                      <motion.div
                        key={banner._id || i}
                        className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="aspect-video relative">
                          <Image src={banner.imageUrl} alt={`Banner ${i + 1}`} fill className="object-cover" />
                        </div>
                        <button
                          onClick={async () => {
                            if (!confirm('Delete this banner?')) return;
                            try {
                              const res = await fetch('/api/banner', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: banner._id }),
                                credentials: 'include'
                              });
                              if (res.ok) {
                                toast.success('Banner deleted!');
                                fetchAllData();
                              }
                            } catch (error) {
                              toast.error('Failed to delete banner');
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              {/* News Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <button
                    onClick={() => setEditingNews({ title: '', content: '', thumbnail: '' })}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add News</span>
                  </button>
                  
                  {editingNews !== null && (
                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-green-500">
                      <h3 className="text-lg font-bold mb-4">{editingNews._id ? 'Edit News' : 'New News'}</h3>
                      <div className="space-y-4">
                        <input
                          value={editingNews.title || ''}
                          onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                          placeholder="News Title"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <label className="flex items-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit">
                          <Upload size={18} className="mr-2" />
                          Upload Thumbnail
                          <input
                            type="file"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              try {
                                setUploading(true);
                                const url = await uploadToSupabase(file);
                                setEditingNews({ ...editingNews, thumbnail: url });
                                toast.success('Thumbnail uploaded!');
                              } catch (error) {
                                console.error('Upload error:', error);
                                const errorMessage = error.message || 'Failed to upload thumbnail';
                                if (errorMessage.includes('Supabase') || errorMessage.includes('environment variables')) {
                                  toast.error('Supabase is not configured. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See README for instructions.');
                                } else {
                                  toast.error(errorMessage);
                                }
                              } finally {
                                setUploading(false);
                                e.target.value = '';
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                        {editingNews.thumbnail && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Image src={editingNews.thumbnail} alt="Thumbnail" fill className="object-cover" />
                          </div>
                        )}
                        <textarea
                          value={editingNews.content || ''}
                          onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                          placeholder="News Content (HTML supported)"
                          className="w-full p-3 border border-gray-300 rounded-lg h-48 resize-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={async () => {
                              // Validate required fields
                              if (!editingNews.title || !editingNews.title.trim()) {
                                toast.error('Please enter a news title');
                                return;
                              }
                              if (!editingNews.content || !editingNews.content.trim()) {
                                toast.error('Please enter news content');
                                return;
                              }
                              if (!editingNews.thumbnail || !editingNews.thumbnail.trim()) {
                                toast.error('Please upload a thumbnail image');
                                return;
                              }

                              try {
                                const method = editingNews._id ? 'PUT' : 'POST';
                                const body = editingNews._id 
                                  ? { id: editingNews._id, ...editingNews }
                                  : editingNews;
                                const res = await fetch('/api/news', {
                                  method,
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(body),
                                  credentials: 'include'
                                });
                                
                                const result = await res.json();
                                
                                if (res.ok) {
                                  toast.success('News saved!');
                                  setEditingNews(null);
                                  fetchAllData();
                                } else {
                                  toast.error(result.error || 'Failed to save news');
                                }
                              } catch (error) {
                                console.error('Save error:', error);
                                toast.error('Failed to save news: ' + (error.message || 'Unknown error'));
                              }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNews(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {(data.news || []).map((item) => (
                      <div key={item._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                        <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        </div>
                        <h4 className="font-bold mb-2">{item.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingNews(item)}
                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this news?')) return;
                              try {
                                const res = await fetch('/api/news', {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: item._id }),
                                  credentials: 'include'
                                });
                                if (res.ok) {
                                  toast.success('News deleted!');
                                  fetchAllData();
                                }
                              } catch (error) {
                                toast.error('Failed to delete news');
                              }
                            }}
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              {/* Videos Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <button
                    onClick={() => {
                      const newVideo = { title: '', youtubeUrl: '', description: '', order: data.videos?.length || 0 };
                      setData({ ...data, videos: [...(data.videos || []), newVideo] });
                    }}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Video</span>
                  </button>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(data.videos || []).map((video, i) => (
                      <div key={video._id || i} className="border-2 border-gray-200 rounded-lg p-4 space-y-3 hover:border-green-500 transition-colors">
                        <input
                          value={video.title || ''}
                          onChange={(e) => updateItem('videos', i, 'title', e.target.value)}
                          placeholder="Video Title"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          value={video.youtubeUrl || ''}
                          onChange={(e) => updateItem('videos', i, 'youtubeUrl', e.target.value)}
                          placeholder="YouTube URL"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <textarea
                          value={video.description || ''}
                          onChange={(e) => updateItem('videos', i, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none"
                        />
                        <div className="flex space-x-2">
                          {video._id ? (
                            <>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch('/api/video', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: video._id, ...video }),
                                      credentials: 'include'
                                    });
                                    if (res.ok) {
                                      toast.success('Video updated!');
                                      fetchAllData();
                                    }
                                  } catch (error) {
                                    toast.error('Failed to update video');
                                  }
                                }}
                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                              >
                                Update
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm('Delete this video?')) return;
                                  try {
                                    const res = await fetch('/api/video', {
                                      method: 'DELETE',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: video._id }),
                                      credentials: 'include'
                                    });
                                    if (res.ok) {
                                      toast.success('Video deleted!');
                                      fetchAllData();
                                    }
                                  } catch (error) {
                                    toast.error('Failed to delete video');
                                  }
                                }}
                                className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/video', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(video),
                                    credentials: 'include'
                                  });
                                  if (res.ok) {
                                    toast.success('Video saved!');
                                    fetchAllData();
                                  }
                                } catch (error) {
                                  toast.error('Failed to save video');
                                }
                              }}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                            >
                              Save
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('videos', i)}
                            className="flex-1 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              {/* Gallery Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(data.gallery || []).slice(0, 12).map((img, i) => (
                      <motion.div
                        key={img._id || i}
                        className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={img.url || '/placeholder.jpg'}
                            alt={img.alt || 'Gallery image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={() => deleteItem('gallery', img._id, i)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <label className="flex items-center justify-center cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto">
                    <Upload size={18} className="mr-2" />
                    {uploading ? 'Uploading...' : 'Upload New Image'}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'gallery', null)}
                      className="hidden"
                      accept="image/*"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </Tab.Panel>

              {/* Committees Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <button
                    onClick={() => {
                      const newCommittee = { wing: '', members: [] };
                      setData({ ...data, committees: [...(data.committees || []), newCommittee] });
                    }}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Committee</span>
                  </button>
                  <div className="space-y-6">
                    {(data.committees || []).map((committee, ci) => (
                      <div key={committee._id || ci} className="border-2 border-gray-200 rounded-lg p-6 space-y-4 hover:border-green-500 transition-colors">
                        <input
                          value={committee.wing || ''}
                          onChange={(e) => {
                            const updated = [...(data.committees || [])];
                            updated[ci] = { ...updated[ci], wing: e.target.value };
                            setData({ ...data, committees: updated });
                          }}
                          placeholder="Wing Name (e.g., Youth Wing)"
                          className="w-full p-3 border border-gray-300 rounded-lg font-bold text-lg"
                        />
                        <div className="grid md:grid-cols-3 gap-4">
                          {(committee.members || []).map((member, mi) => (
                            <div key={mi} className="bg-gray-50 p-4 rounded-lg space-y-3">
                              <label className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-green-600">
                                <ImageIcon size={16} className="mr-2" />
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    try {
                                      setUploading(true);
                                      const url = await uploadToSupabase(file);
                                      const updated = [...(data.committees || [])];
                                      updated[ci].members[mi] = { ...updated[ci].members[mi], photo: url };
                                      setData({ ...data, committees: updated });
                                      toast.success('Photo uploaded!');
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      const errorMessage = error.message || 'Failed to upload photo';
                                      if (errorMessage.includes('Supabase') || errorMessage.includes('environment variables')) {
                                        toast.error('Supabase is not configured. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See README for instructions.');
                                      } else {
                                        toast.error(errorMessage);
                                      }
                                    } finally {
                                      setUploading(false);
                                      e.target.value = '';
                                    }
                                  }}
                                  className="hidden"
                                  accept="image/*"
                                />
                              </label>
                              {member.photo && (
                                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                                </div>
                              )}
                              <input
                                value={member.name || ''}
                                onChange={(e) => {
                                  const updated = [...(data.committees || [])];
                                  updated[ci].members[mi] = { ...updated[ci].members[mi], name: e.target.value };
                                  setData({ ...data, committees: updated });
                                }}
                                placeholder="Member Name"
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                              <input
                                value={member.position || ''}
                                onChange={(e) => {
                                  const updated = [...(data.committees || [])];
                                  updated[ci].members[mi] = { ...updated[ci].members[mi], position: e.target.value };
                                  setData({ ...data, committees: updated });
                                }}
                                placeholder="Position"
                                className="w-full p-2 border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...(data.committees || [])];
                                  updated[ci].members = updated[ci].members.filter((_, i) => i !== mi);
                                  setData({ ...data, committees: updated });
                                }}
                                className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                              >
                                Remove Member
                              </button>
                            </div>
                          ))}
                          {(!committee.members || committee.members.length < 3) && (
                            <button
                              onClick={() => {
                                const updated = [...(data.committees || [])];
                                if (!updated[ci].members) updated[ci].members = [];
                                updated[ci].members.push({ name: '', position: '', photo: '' });
                                setData({ ...data, committees: updated });
                              }}
                              className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg flex items-center justify-center text-gray-600"
                            >
                              <Plus size={24} />
                            </button>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {committee._id ? (
                            <>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await fetch('/api/committee', {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: committee._id, ...committee }),
                                      credentials: 'include'
                                    });
                                    if (res.ok) {
                                      toast.success('Committee updated!');
                                      fetchAllData();
                                    }
                                  } catch (error) {
                                    toast.error('Failed to update committee');
                                  }
                                }}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                              >
                                Update
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm('Delete this committee?')) return;
                                  try {
                                    const res = await fetch('/api/committee', {
                                      method: 'DELETE',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: committee._id }),
                                      credentials: 'include'
                                    });
                                    if (res.ok) {
                                      toast.success('Committee deleted!');
                                      fetchAllData();
                                    }
                                  } catch (error) {
                                    toast.error('Failed to delete committee');
                                  }
                                }}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/committee', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(committee),
                                    credentials: 'include'
                                  });
                                  if (res.ok) {
                                    toast.success('Committee saved!');
                                    fetchAllData();
                                  }
                                } catch (error) {
                                  toast.error('Failed to save committee');
                                }
                              }}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const updated = (data.committees || []).filter((_, i) => i !== ci);
                              setData({ ...data, committees: updated });
                            }}
                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              {/* Organizations Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <button
                    onClick={() => addItem('organizations')}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Organization</span>
                  </button>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(data.organizations || []).map((org, i) => (
                      <div key={org._id || i} className="border-2 border-gray-200 rounded-lg p-4 space-y-3 hover:border-green-500 transition-colors">
                        <input
                          value={org.name || ''}
                          onChange={(e) => updateItem('organizations', i, 'name', e.target.value)}
                          placeholder="Organization Name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                        />
                        <textarea
                          value={org.desc || ''}
                          onChange={(e) => updateItem('organizations', i, 'desc', e.target.value)}
                          placeholder="Description"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
                        />
                        <div className="flex space-x-2">
                          {org._id && (
                            <button
                              onClick={() => deleteItem('organizations', org._id, i)}
                              className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={14} className="inline mr-1" />
                              Delete
                            </button>
                          )}
                          <button
                            onClick={() => removeItem('organizations', i)}
                            className="flex-1 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                          >
                            <X size={14} className="inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => saveItems('organizations')}
                    disabled={saving.organizations}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Save size={18} />
                    <span>{saving.organizations ? 'Saving...' : 'Save Organizations'}</span>
                  </button>
                </div>
              </Tab.Panel>

              {/* Socials Tab */}
              <Tab.Panel>
                <div className="space-y-4">
                  {(data.content?.socials || []).map((s, i) => (
                    <div key={i} className="flex gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                      <input
                        value={s.name || ''}
                        onChange={(e) => {
                          const updated = (data.content?.socials || []).map((ss, ii) =>
                            ii === i ? { ...ss, name: e.target.value } : ss
                          );
                          setData({ ...data, content: { ...data.content, socials: updated } });
                        }}
                        placeholder="Name (e.g., Facebook)"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        value={s.url || ''}
                        onChange={(e) => {
                          const updated = (data.content?.socials || []).map((ss, ii) =>
                            ii === i ? { ...ss, url: e.target.value } : ss
                          );
                          setData({ ...data, content: { ...data.content, socials: updated } });
                        }}
                        placeholder="URL"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        value={s.icon || ''}
                        onChange={(e) => {
                          const updated = (data.content?.socials || []).map((ss, ii) =>
                            ii === i ? { ...ss, icon: e.target.value } : ss
                          );
                          setData({ ...data, content: { ...data.content, socials: updated } });
                        }}
                        placeholder="Icon"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.content?.socials || []).filter((_, ii) => ii !== i);
                          setData({ ...data, content: { ...data.content, socials: updated } });
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        content: {
                          ...data.content,
                          socials: [...(data.content?.socials || []), { name: '', url: '', icon: '' }],
                        },
                      });
                    }}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Social</span>
                  </button>
                  <button
                    onClick={handleSaveCore}
                    disabled={saving.core}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Save size={18} />
                    <span>{saving.core ? 'Saving...' : 'Save Socials'}</span>
                  </button>
                </div>
              </Tab.Panel>

              {/* Location Tab */}
              <Tab.Panel>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      value={data.content?.location?.address || ''}
                      onChange={(e) => setCoreValue('location.address', e.target.value)}
                      placeholder="Enter address..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Map Embed URL</label>
                    <input
                      value={data.content?.location?.mapEmbed || ''}
                      onChange={(e) => setCoreValue('location.mapEmbed', e.target.value)}
                      placeholder="Enter map embed URL..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSaveCore}
                    disabled={saving.core}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Save size={18} />
                    <span>{saving.core ? 'Saving...' : 'Save Location'}</span>
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </motion.div>
      </div>
    </div>
  );
}


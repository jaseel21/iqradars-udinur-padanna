'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, PenSquare, Save, Upload, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultArticle = {
  title: '',
  subtitle: '',
  author: '',
  language: 'English',
  fontFamily: 'serif',
  type: 'article',
  bannerUrl: '',
  content: '',
  tags: '',
  status: 'draft',
};

const fontOptions = [
  { label: 'Serif', value: 'serif' },
  { label: 'Sans Serif', value: 'sans-serif' },
  { label: 'Amiri', value: 'Amiri, serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
];

const languageOptions = ['English', 'Arabic', 'Malayalam', 'Urdu', 'Tamil', 'Hindi'];
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export default function AdminArticlesClient({ initialArticles = [] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState(defaultArticle);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(result.error || 'Upload failed');
      }

      handleChange('bannerUrl', result.url);
      toast.success('Banner uploaded');
    } catch (error) {
      console.error('Banner upload error', error);
      toast.error(error.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = editingId ? 'PUT' : 'POST';
    const payload = {
      ...(editingId ? { _id: editingId } : {}),
      ...form,
      tags: form.tags
        ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    };

    try {
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to save article');
      }

      const data = await res.json();
      if (editingId) {
        setArticles((prev) => prev.map((a) => (a._id === editingId ? data.article : a)));
        toast.success('Article updated');
      } else {
        setArticles((prev) => [data.article, ...prev]);
        toast.success('Article created');
      }

      setForm(defaultArticle);
      setEditingId(null);
    } catch (error) {
      console.error('Save article error', error);
      toast.error(error.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (article) => {
    if (!article?._id) return;
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    setStatusUpdatingId(article._id);
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: article._id, status: nextStatus }),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to update status');
      }

      const data = await res.json();
      setArticles((prev) => prev.map((a) => (a._id === article._id ? data.article : a)));
      toast.success(
        nextStatus === 'published' ? 'Article published publicly' : 'Article moved to drafts'
      );
    } catch (error) {
      console.error('Status change error', error);
      toast.error(error.message || 'Unable to update status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleEdit = (article) => {
    setForm({
      title: article.title || '',
      subtitle: article.subtitle || '',
      author: article.author || '',
      language: article.language || 'English',
      fontFamily: article.fontFamily || 'serif',
      type: article.type || 'article',
      bannerUrl: article.bannerUrl || '',
      content: article.content || '',
      tags: article.tags?.join(', ') || '',
      status: article.status || 'draft',
    });
    setEditingId(article._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to delete article');
      }

      setArticles((prev) => prev.filter((a) => a._id !== id));
      toast.success('Article deleted');
    } catch (error) {
      console.error('Delete article error', error);
      toast.error('Failed to delete article');
    }
  };

  const handleReset = () => {
    setForm(defaultArticle);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-900 to-emerald-900 text-white px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
                <BookOpen size={40} />
                <span>Articles & Poems</span>
              </h1>
              <p className="text-green-100">
                Craft multilingual articles or poems with rich presentation controls.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              <RefreshCw size={18} />
              <span>{editingId ? 'New Article' : 'Clear Form'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Heading</label>
                  <input
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter article or poem title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Subheading</label>
                  <input
                    value={form.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full p-3 border-2 text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter subtitle or summary"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Writer</label>
                    <input
                      value={form.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full p-3 text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Language</label>
                    <select
                      value={form.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full p-3 border-2 text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Font Style</label>
                    <select
                      value={form.fontFamily}
                      onChange={(e) => handleChange('fontFamily', e.target.value)}
                      className="w-full p-3 text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Format</label>
                    <select
                      value={form.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="w-full text-black p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="article">Article</option>
                      <option value="poem">Poem</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Status</label>
                    <select
                      value={form.status || 'draft'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full text-black p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Draft articles stay private until you set status to Published.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Tags</label>
                  <input
                    value={form.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    className="w-full text-black p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Comma separated (e.g., Faith, Spirituality)"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Banner Image URL</label>
                  <input
                    value={form.bannerUrl}
                    onChange={(e) => handleChange('bannerUrl', e.target.value)}
                    className="w-full p-3 text-black text-black border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                  <label className="mt-3 flex items-center space-x-2 text-sm text-green-700 cursor-pointer">
                    <Upload size={16} />
                    <span>{uploading ? 'Uploading...' : 'Upload banner image'}</span>
                    <input
                      type="file"
                      className="hidden text-black"
                      accept="image/*"
                      onChange={(e) => handleBannerUpload(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Body</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    required
                    rows={12}
                    className="w-full text-black p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Write the full article or poem text. Use paragraphs for clarity."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supports multi-language content. Add stanza spacing for poems.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                <Save size={18} />
                <span>{editingId ? 'Update Article' : 'Publish Article'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <PenSquare size={18} />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2 text-gray-800">
              <PenSquare size={24} />
              <span>Published entries</span>
            </h2>
            <span className="text-sm text-gray-500">{articles.length} items</span>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Plus className="mx-auto mb-4 text-gray-400" size={32} />
              <p>No articles or poems yet. Start by publishing one!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="border-2 border-gray-100 rounded-xl p-5 hover:border-green-400 transition group flex flex-col space-y-3"
                >
                  <div className="flex items-center  justify-between">
                    <div className="space-x-2 text-xs  uppercase tracking-wide text-gray-500">
                      <span>{article.type}</span>
                      <span>· {article.language}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs  font-semibold ${
                        article.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {article.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-4">
                      <span className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 21c-4.2-3.2-7-6.1-7-9.8a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 3.7-2.8 6.6-7 9.8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{article.likes || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{article.views || 0}</span>
                      </span>
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {article.subtitle || article.content?.slice(0, 120)}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">By {article.author || 'Editorial Team'}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleEdit(article)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusToggle(article)}
                      disabled={statusUpdatingId === article._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                        article.status === 'published'
                          ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                          : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {statusUpdatingId === article._id
                        ? 'Updating...'
                        : article.status === 'published'
                        ? 'Move to Draft'
                        : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


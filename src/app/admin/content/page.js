'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToSupabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminContent() {
  const router = useRouter();
  const [data, setData] = useState({ content: {}, board: [], organizations: [], gallery: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.user) router.push('/admin/login');
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    const res = await fetch('/api/content');
    const allData = await res.json();
    setData(allData);
    setLoading(false);
  };

  const { register: registerCore, handleSubmit: handleCore, setValue: setCoreValue } = useForm({ defaultValues: data.content });
  const handleSaveCore = handleCore((formData) => {
    fetch('/api/content', { method: 'PUT', body: JSON.stringify({ type: 'content', ...formData }) }).then(() => {
      setData({ ...data, content: formData });
      toast.success('Core content saved!');
    });
  });

  const addItem = (type) => {
    const newItem = type === 'board' ? { name: '', role: '', image: '', bio: '' } : { name: '', desc: '' };
    setData({ ...data, [type]: [...data[type], newItem] });
  };

  const updateItem = (type, index, field, value) => {
    const updated = [...data[type]];
    updated[index][field] = value;
    setData({ ...data, [type]: updated });
  };

  const deleteItem = async (type, id, index) => {
    if (confirm(`Delete ${type} item?`)) {
      await fetch('/api/content', { method: 'DELETE', body: JSON.stringify({ id, type }) });
      const updated = data[type].filter((_, i) => i !== index);
      setData({ ...data, [type]: updated });
      toast.success('Item deleted!');
    }
  };

  const handleImageUpload = async (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToSupabase(file);
    if (type === 'gallery') {
      await fetch('/api/content', { method: 'POST', body: JSON.stringify({ type: 'gallery', url, category: 'events', alt: 'New image' }) });
      fetchAllData();
    } else {
      updateItem(type, index, 'image', url);
    }
    setUploading(false);
    toast.success('Image uploaded!');
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-green-800">Full Content Control</h1>
      <Tab.Group selectedIndex={activeTab} onSelectedIndexChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-green-900/20 p-1 mb-8">
          {['Core Content', 'Gallery', 'Board', 'Organizations', 'Socials', 'Location'].map((tab) => (
            <Tab key={tab} className="w-full py-2.5 text-sm font-medium leading-5 rounded-lg ui-selected:bg-green-600 ui-selected:text-white">
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {/* Core Content Tab */}
          <Tab.Panel>
            <form onSubmit={handleSaveCore} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <textarea {...registerCore('description')} placeholder="Description" className="p-3 border rounded-lg h-32" />
                <textarea {...registerCore('goals')} placeholder="Goals" className="p-3 border rounded-lg h-32" />
                <textarea {...registerCore('mission')} placeholder="Mission" className="p-3 border rounded-lg h-32" />
              </div>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save All</button>
            </form>
          </Tab.Panel>

          {/* Gallery Tab */}
          <Tab.Panel>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {data.gallery.slice(0, 9).map((img, i) => (
                <motion.div key={img._id} className="relative border rounded-lg overflow-hidden" whileHover={{ scale: 1.05 }}>
                  <Image src={img.url} alt={img.alt} width={200} height={150} className="w-full h-32 object-cover" />
                  <button onClick={() => deleteItem('gallery', img._id, i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><Trash2 size={12} /></button>
                </motion.div>
              ))}
            </div>
            <label className="flex items-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
              <Upload size={16} className="mr-2" /> Upload New Image
              <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
            </label>
            {uploading && <p>Uploading...</p>}
          </Tab.Panel>

          {/* Board Tab */}
          <Tab.Panel>
            <button onClick={() => addItem('board')} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"><Plus size={16} className="mr-2" /> Add Member</button>
            <div className="grid md:grid-cols-3 gap-4">
              {data.board.map((member, i) => (
                <div key={member._id || i} className="border p-4 rounded-lg space-y-2">
                  <input value={member.name} onChange={(e) => updateItem('board', i, 'name', e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
                  <input value={member.role} onChange={(e) => updateItem('board', i, 'role', e.target.value)} placeholder="Role" className="w-full p-2 border rounded" />
                  <input value={member.bio} onChange={(e) => updateItem('board', i, 'bio', e.target.value)} placeholder="Bio" className="w-full p-2 border rounded" />
                  <label className="flex items-center cursor-pointer">
                    <ImageIcon size={16} className="mr-2" /> Image
                    <input type="file" onChange={(e) => handleImageUpload(e, 'board', i)} className="hidden" accept="image/*" />
                  </label>
                  <button onClick={() => deleteItem('board', member._id, i)} className="bg-red-500 text-white px-3 py-1 rounded"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button onClick={() => fetch('/api/content', { method: 'POST', body: JSON.stringify({ type: 'board' }) })} className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Save Board</button>
          </Tab.Panel>

          {/* Organizations Tab - Similar to Board */}
          <Tab.Panel>
            <button onClick={() => addItem('organizations')} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"><Plus size={16} className="mr-2" /> Add Subwing</button>
            <div className="grid md:grid-cols-2 gap-4">
              {data.organizations.map((org, i) => (
                <div key={org._id || i} className="border p-4 rounded-lg space-y-2">
                  <input value={org.name} onChange={(e) => updateItem('organizations', i, 'name', e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
                  <textarea value={org.desc} onChange={(e) => updateItem('organizations', i, 'desc', e.target.value)} placeholder="Description" className="w-full p-2 border rounded h-20" />
                  <button onClick={() => deleteItem('organizations', org._id, i)} className="bg-red-500 text-white px-3 py-1 rounded"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Save Organizations</button>
          </Tab.Panel>

          {/* Socials Tab */}
          <Tab.Panel>
            <div className="space-y-4">
              {data.content.socials?.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.name || ''} onChange={(e) => setData({ ...data, content: { ...data.content, socials: data.content.socials.map((ss, ii) => ii === i ? { ...ss, name: e.target.value } : ss) } })} placeholder="Name" className="flex-1 p-2 border rounded" />
                  <input value={s.url || ''} onChange={(e) => setData({ ...data, content: { ...data.content, socials: data.content.socials.map((ss, ii) => ii === i ? { ...ss, url: e.target.value } : ss) } })} placeholder="URL" className="flex-1 p-2 border rounded" />
                  <input value={s.icon || ''} onChange={(e) => setData({ ...data, content: { ...data.content, socials: data.content.socials.map((ss, ii) => ii === i ? { ...ss, icon: e.target.value } : ss) } })} placeholder="Icon (e.g., Fb)" className="flex-1 p-2 border rounded" />
                  <button type="button" onClick={() => setData({ ...data, content: { ...data.content, socials: data.content.socials.filter((_, ii) => ii !== i) } })} className="bg-red-500 text-white px-2 py-2 rounded"><Trash2 size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setData({ ...data, content: { ...data.content, socials: [...(data.content.socials || []), { name: '', url: '', icon: '' }] } })} className="bg-blue-500 text-white px-4 py-2 rounded">Add Social</button>
              <button onClick={handleSaveCore} className="bg-green-600 text-white px-6 py-2 rounded">Save Socials</button>
            </div>
          </Tab.Panel>

          {/* Location Tab */}
          <Tab.Panel>
            <div className="space-y-4">
              <input value={data.content.location?.address || ''} onChange={(e) => setCoreValue('location.address', e.target.value)} placeholder="Address" className="w-full p-2 border rounded" />
              <input value={data.content.location?.mapEmbed || ''} onChange={(e) => setCoreValue('location.mapEmbed', e.target.value)} placeholder="Map Embed URL" className="w-full p-2 border rounded" />
              <button onClick={handleSaveCore} className="bg-green-600 text-white px-6 py-2 rounded">Save Location</button>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  );
}
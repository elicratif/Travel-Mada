import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BlogPost, Category } from '../types';
import { generateBlogContent, generateSEO, generatePostTitles, generatePostOutline, generateLogo } from '../services/geminiService';
import { Button } from '../components/UI';
import { Plus, Edit2, Trash2, Sparkles, Loader2, Eye, TrendingUp, Users, Lightbulb, List, Image as ImageIcon, Save, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Login Page ---
export const Login: React.FC = () => {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  if (user) {
    navigate('/admin');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) login(email);
  };

  return (
    <div className="min-h-screen bg-mada-green flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 mt-2">Sign in to manage Travel Mada</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none"
              placeholder="admin@travelmada.com"
            />
          </div>
          <Button type="submit" className="w-full py-3">Sign In</Button>
          <div className="text-center text-xs text-gray-400">
            For demo, enter any email.
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard ---
export const Dashboard: React.FC = () => {
  const { posts } = useApp();
  
  const data = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 2000 },
    { name: 'Thu', views: 2780 },
    { name: 'Fri', views: 1890 },
    { name: 'Sat', views: 2390 },
    { name: 'Sun', views: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening with your blog today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Views</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">42.5k</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Eye className="w-5 h-5"/></div>
          </div>
          <span className="text-xs text-green-600 font-medium mt-4 inline-block">+12% from last week</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Posts</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{posts.length}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp className="w-5 h-5"/></div>
          </div>
          <span className="text-xs text-gray-400 font-medium mt-4 inline-block">Updated just now</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Subscribers</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">1,204</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5"/></div>
          </div>
          <span className="text-xs text-green-600 font-medium mt-4 inline-block">+5 new today</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6">Traffic Analytics</h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
              <Bar dataKey="views" fill="#064e3b" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Post Manager & Editor ---
export const PostManager: React.FC = () => {
  const { posts, deletePost, addPost, updatePost } = useApp();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleCreate = () => {
    setEditingPost({
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1570701564993-e00652af8aa7?q=80&w=2070&auto=format&fit=crop',
      author: 'Travel Mada Team',
      date: new Date().toLocaleDateString(),
      category: 'Adventure',
      readTime: '5 min',
      tags: [],
      status: 'draft'
    });
    setView('edit');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView('edit');
  };

  const handleSave = (post: BlogPost) => {
    const exists = posts.find(p => p.id === post.id);
    if (exists) {
      updatePost(post);
    } else {
      addPost(post);
    }
    setView('list');
    setEditingPost(null);
  };

  if (view === 'edit' && editingPost) {
    return <PostEditor post={editingPost} onSave={handleSave} onCancel={() => setView('list')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> New Post</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{post.title}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">{post.category}</span></td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{post.status}</span></td>
                <td className="p-4 text-gray-500">{post.date}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(post)} className="text-gray-400 hover:text-mada-green"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => deletePost(post.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Post Editor Component ---
const PostEditor: React.FC<{ post: BlogPost, onSave: (p: BlogPost) => void, onCancel: () => void }> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<BlogPost>(post);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [showTitles, setShowTitles] = useState(false);

  const handleGenerateContent = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const content = await generateBlogContent(aiPrompt, 'inspiring and informative');
    setFormData(prev => ({ ...prev, content: prev.content + "\n\n" + content }));
    setIsGenerating(false);
    setAiPrompt('');
  };

  const handleGenerateTitles = async () => {
     if (!formData.title && !aiPrompt) {
         alert("Please enter a topic in the AI prompt box to generate titles.");
         return;
     }
     const topic = aiPrompt || formData.title;
     setIsGenerating(true);
     const titles = await generatePostTitles(topic);
     setGeneratedTitles(titles);
     setShowTitles(true);
     setIsGenerating(false);
  };

  const handleGenerateOutline = async () => {
      if(!formData.title) return;
      setIsGenerating(true);
      const outline = await generatePostOutline(formData.title);
      setFormData(prev => ({ ...prev, content: prev.content + "\n\n" + outline }));
      setIsGenerating(false);
  };

  const handleGenerateSEO = async () => {
    if (!formData.content) return;
    setIsGenerating(true);
    const seo = await generateSEO(formData.content);
    setFormData(prev => ({ ...prev, seoTitle: seo.title, seoDesc: seo.description }));
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <div className="space-x-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>Save Post</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 relative">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <div className="flex gap-2">
                <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none"
                    placeholder="Enter post title"
                />
                <button 
                    onClick={handleGenerateTitles}
                    disabled={isGenerating}
                    className="flex-shrink-0 bg-yellow-50 text-yellow-600 px-3 rounded-lg hover:bg-yellow-100 transition-colors"
                    title="Generate Titles"
                >
                    <Lightbulb className="w-5 h-5" />
                </button>
              </div>
              {showTitles && generatedTitles.length > 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-xs font-bold text-yellow-700 mb-2">AI Suggestions:</p>
                      <div className="space-y-1">
                          {generatedTitles.map((t, i) => (
                              <button key={i} onClick={() => { setFormData({...formData, title: t}); setShowTitles(false); }} className="block w-full text-left text-sm text-yellow-800 hover:bg-yellow-100 p-1 rounded">
                                  {t}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea 
                rows={2}
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-gray-700">Content</label>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="Topic for AI generation..." 
                     value={aiPrompt}
                     onChange={e => setAiPrompt(e.target.value)}
                     className="text-xs border rounded px-2 py-1 w-40"
                   />
                   <button 
                    onClick={handleGenerateOutline}
                    disabled={isGenerating || !formData.title}
                    className="text-xs flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                    title="Generate Outline based on Title"
                   >
                     <List className="w-3 h-3 mr-1"/> Outline
                   </button>
                   <button 
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !aiPrompt}
                    className="text-xs flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                   >
                     {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1"/>}
                     Write Section
                   </button>
                 </div>
              </div>
              <textarea 
                rows={15}
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">SEO Settings</h3>
              <button onClick={handleGenerateSEO} disabled={isGenerating} className="text-xs text-mada-green hover:underline flex items-center">
                {isGenerating && <Loader2 className="w-3 h-3 animate-spin mr-1"/>} Generate with AI
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Meta Title</label>
              <input 
                type="text" 
                value={formData.seoTitle || ''} 
                onChange={e => setFormData({...formData, seoTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded mt-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Meta Description</label>
              <textarea 
                rows={2}
                value={formData.seoDesc || ''} 
                onChange={e => setFormData({...formData, seoDesc: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded mt-1 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Publishing</h3>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Beaches">Beaches</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Culture">Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Food">Food</option>
              </select>
            </div>
            
             <div>
              <label className="block text-xs text-gray-500 mb-2">Cover Image</label>
              
              {/* File Upload Area */}
              <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-green-50 text-mada-green rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-gray-600">
                          <span className="font-medium text-mada-green">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-[10px] text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
              </div>

              {/* URL Fallback */}
              <div className="mt-3">
                  <input 
                    type="text" 
                    value={formData.coverImage}
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                    className="w-full border rounded px-3 py-2 text-xs text-gray-600"
                    placeholder="Or paste image URL..."
                  />
              </div>

              {/* Preview */}
              {formData.coverImage && (
                  <div className="mt-3 relative group">
                      <img src={formData.coverImage} className="w-full h-40 object-cover rounded-lg border border-gray-100" />
                      <button 
                        onClick={() => setFormData({...formData, coverImage: ''})}
                        className="absolute top-2 right-2 bg-white/90 text-gray-600 p-1.5 rounded-full shadow-sm hover:text-red-500 transition-colors"
                      >
                          <Trash2 className="w-3 h-3"/>
                      </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Settings Page ---
export const Settings: React.FC = () => {
    const { settings, updateSettings } = useApp();
    const [logoPrompt, setLogoPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);

    const handleGenerateLogo = async () => {
        if(!logoPrompt) return;
        setIsGenerating(true);
        const logoData = await generateLogo(logoPrompt);
        if(logoData) {
            setGeneratedLogo(logoData);
        }
        setIsGenerating(false);
    };

    const handleSaveLogo = () => {
        if(generatedLogo) {
            updateSettings({ ...settings, logoUrl: generatedLogo });
            setGeneratedLogo(null);
            setLogoPrompt('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
             <div>
                <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-gray-500">Manage your website configuration and branding.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-mada-green"/> AI Logo Generator
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Describe your desired logo style, elements, and colors. The AI will generate a unique vector-style logo for your brand.
                        </p>
                        <textarea 
                            value={logoPrompt}
                            onChange={(e) => setLogoPrompt(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none h-32 resize-none"
                            placeholder="e.g., A minimalist line art of a Baobab tree with a sun behind it, emerald green and gold colors..."
                        />
                        <Button 
                            onClick={handleGenerateLogo} 
                            disabled={isGenerating || !logoPrompt}
                            className="w-full"
                        >
                            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Generating...</> : <><Sparkles className="w-4 h-4 mr-2"/> Generate Logo</>}
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 min-h-[300px]">
                        {generatedLogo ? (
                            <div className="text-center w-full">
                                <p className="text-sm font-medium text-gray-500 mb-4">Preview</p>
                                <div className="bg-white p-4 rounded shadow-sm inline-block mb-4">
                                    <img src={generatedLogo} alt="Generated Logo" className="h-32 object-contain" />
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" onClick={() => setGeneratedLogo(null)}>Discard</Button>
                                    <Button onClick={handleSaveLogo}><Save className="w-4 h-4 mr-2"/> Apply Logo</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                {settings.logoUrl ? (
                                    <>
                                        <p className="text-xs uppercase font-bold mb-2">Current Logo</p>
                                        <img src={settings.logoUrl} alt="Current" className="h-24 mx-auto opacity-80" />
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>No logo generated yet</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                <div className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                        <input 
                            type="text" 
                            value={settings.siteName}
                            onChange={(e) => updateSettings({...settings, siteName: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green outline-none"
                        />
                    </div>
                    {/* Additional settings could go here */}
                </div>
            </div>
        </div>
    );
};
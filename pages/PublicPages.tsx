import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BlogCard, DestinationCard, Button } from '../components/UI';
import { Search, MapPin, Send, CheckCircle, ChevronDown } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

// --- Home Page ---
export const Home: React.FC = () => {
  const { posts } = useApp();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [bgUrl, setBgUrl] = useState('');
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Parallax scroll handler
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    // Optimize image size based on device width
    const width = window.innerWidth;
    // Using a coastal sunset image with a dhow sailboat to match the "Discover Madagascar" vibe
    const url = width < 768 
      ? "https://images.unsplash.com/photo-1605218457338-79577c271030?q=80&w=800&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1605218457338-79577c271030?q=80&w=2070&auto=format&fit=crop";
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setBgUrl(url);
      setImgLoaded(true);
    };

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-center text-white bg-mada-green overflow-hidden"
        role="img"
        aria-label="Sunset over the ocean in Madagascar with a traditional sailing dhow"
        style={{ backgroundColor: '#064e3b' }}
      >
        {/* Background Image with Parallax Transform */}
        <div 
          className={`absolute w-full -top-[10%] h-[120%] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-out will-change-transform ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: bgUrl ? `url('${bgUrl}')` : 'none',
            transform: `translateY(${offsetY * 0.5}px)` // Moves down at half scroll speed for depth effect
          }}
        />

        {/* CSS Fallback if JS fails or loading - background color is on parent */}
        
        {/* Gradient Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-4 pt-20 animate-slide-up-fade">
          <span className="block text-mada-sand font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base drop-shadow-md">
            Welcome to the 8th Continent
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-xl">
            Discover the Soul of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-mada-sand to-amber-400">Madagascar</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
            From the majestic Baobabs to the pristine beaches of Nosy Be. 
            Your ultimate guide to the most unique island on Earth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/destinations"><Button variant="primary" size="lg" className="min-w-[160px] shadow-lg hover:shadow-green-900/40 border-2 border-transparent hover:border-mada-sand transition-all">Explore Places</Button></Link>
            <Link to="/blog"><Button variant="secondary" size="lg" className="min-w-[160px] shadow-lg hover:shadow-amber-900/40">Read the Journal</Button></Link>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10 text-white/70 hidden md:block">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-mada-accent font-bold uppercase tracking-wider text-sm">Travel Journal</span>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2">Latest Adventures</h2>
          </div>
          <Link to="/blog" className="hidden md:block text-mada-green font-medium hover:text-mada-accent transition-colors">View All Stories &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link to="/blog"><Button variant="outline">View All Stories</Button></Link>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="bg-mada-green py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
           <svg width="400" height="400" viewBox="0 0 100 100" fill="white"><circle cx="50" cy="50" r="50"/></svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Join the Adventure</h2>
          <p className="text-green-100 mb-8">Get weekly guides, hidden gems, and travel tips delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-mada-sand text-gray-900"/>
            <Button variant="secondary" size="md">Subscribe Free</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

// --- Blog Listing ---
export const BlogList: React.FC = () => {
  const { posts } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Beaches', 'Wildlife', 'Culture', 'Adventure', 'Food'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'All' || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-mada-accent font-bold uppercase tracking-wider text-sm">The Journal</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-6">Stories from the Island</h1>
        <p className="text-gray-600 text-lg">Detailed guides, personal stories, and expert tips for your Malagasy journey.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-mada-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-mada-green"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          <button onClick={() => {setFilter('All'); setSearch('')}} className="mt-4 text-mada-green font-medium underline">Clear filters</button>
        </div>
      )}
    </div>
  );
};

// --- Single Blog Post ---
export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug } = useApp();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <div className="text-center py-40 text-xl text-gray-600">Article not found.</div>;

  return (
    <article className="pb-20">
      <div className="h-[60vh] relative">
        <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-4xl mx-auto px-4 w-full pb-16 text-white">
            <span className="bg-mada-accent px-3 py-1 text-xs font-bold uppercase rounded text-white mb-4 inline-block">{post.category}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center space-x-6 text-sm md:text-base">
              <span className="font-medium">By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-green mx-auto">
          <p className="lead text-xl text-gray-600 mb-8 font-light italic border-l-4 border-mada-sand pl-4">
            {post.excerpt}
          </p>
          {/* Simple rendering for demo. In real app, use Markdown renderer */}
          {post.content.split('\n').map((p, i) => <p key={i} className="mb-4 text-gray-800 leading-relaxed">{p}</p>)}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">Tags</h4>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

// --- Destinations ---
export const Destinations: React.FC = () => {
  // Updated with reliable Unsplash IDs
  const destinations = [
    { id: '1', name: 'Nosy Be', region: 'North', description: 'Tropical paradise with perfumes of ylang-ylang.', image: 'https://images.unsplash.com/photo-1570701564993-e00652af8aa7?q=80&w=2070&auto=format&fit=crop' },
    { id: '2', name: 'Isalo National Park', region: 'South', description: 'Jurassic sandstone landscapes and hidden oases.', image: 'https://images.unsplash.com/photo-1534234828563-02511c9735d4?q=80&w=2000&auto=format&fit=crop' },
    { id: '3', name: 'Tsingy de Bemaraha', region: 'West', description: 'Sharp limestone pinnacles of the Stone Forest.', image: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?q=80&w=2000&auto=format&fit=crop' },
    { id: '4', name: 'Sainte Marie', region: 'East', description: 'Whale watching and pirate history.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
         <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Explore Destinations</h1>
         <p className="text-gray-600 max-w-2xl mx-auto">Madagascar is vast and diverse. Discover the distinct regions that make up this micro-continent.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {destinations.map(dest => <DestinationCard key={dest.id} dest={dest} />)}
      </div>
    </div>
  );
};

// --- Contact ---
export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-mada-accent font-bold uppercase tracking-wider text-sm">Get in Touch</span>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">Let's Plan Your Trip</h1>
            <p className="text-gray-600 mb-8">Have questions about traveling to Madagascar? Need a custom itinerary? Send us a message.</p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-mada-green mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Head Office</h4>
                  <p className="text-gray-600">123 Independence Avenue<br/>Antananarivo 101, Madagascar</p>
                </div>
              </div>
              <div className="flex items-start">
                <Send className="w-6 h-6 text-mada-green mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">hello@travelmada.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-mada-green" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-mada-green font-medium">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mada-green focus:border-transparent outline-none transition-all"></textarea>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </div>
       </div>
    </div>
  );
};
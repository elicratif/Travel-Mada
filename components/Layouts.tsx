import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo, Button } from './UI';
import { useApp } from '../context/AppContext';
import { Menu, X, Instagram, Facebook, Twitter, Map, LayoutDashboard, FileText, Settings, LogOut, Search } from 'lucide-react';

// --- Public Navbar ---
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useApp();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/login' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/"><Logo className="h-10" src={settings.logoUrl} /></Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-mada-accent ${location.pathname === link.path ? 'text-mada-green font-bold' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="primary" size="sm" onClick={() => window.location.hash = '#/newsletter'}>Subscribe</Button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-mada-green p-2">
              {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-mada-green hover:bg-green-50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer ---
const Footer: React.FC = () => {
  const { settings } = useApp();
  return (
  <footer className="bg-mada-green text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Logo dark className="h-10 mb-6" src={settings.logoUrl} />
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Discover the untold stories of Madagascar. From the Baobab Avenue to the pristine beaches of Nosy Be, we guide you through the 8th continent.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-mada-sand transition-colors"><Instagram className="h-5 w-5"/></a>
            <a href="#" className="text-gray-300 hover:text-mada-sand transition-colors"><Facebook className="h-5 w-5"/></a>
            <a href="#" className="text-gray-300 hover:text-mada-sand transition-colors"><Twitter className="h-5 w-5"/></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-serif text-xl mb-6 text-mada-sand">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link to="/destinations" className="hover:text-white">Regions</Link></li>
            <li><Link to="/blog" className="hover:text-white">Travel Guides</Link></li>
            <li><Link to="/about" className="hover:text-white">Culture</Link></li>
            <li><Link to="/blog" className="hover:text-white">Wildlife</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 text-mada-sand">Company</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/admin" className="hover:text-white">Partner Login</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6 text-mada-sand">Newsletter</h4>
          <p className="text-gray-300 text-sm mb-4">Get the latest travel tips and hidden gems directly to your inbox.</p>
          <form className="flex flex-col space-y-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-green-800 border border-green-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-mada-sand placeholder-green-400 text-sm"
            />
            <Button variant="secondary" size="sm" className="w-full">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-green-800 pt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Travel Mada. All rights reserved. Designed with precision.
      </div>
    </div>
  </footer>
  );
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col font-sans">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

// --- Admin Layout ---
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: FileText, label: "All Posts", path: "/admin/posts" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-mada-green text-white fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-green-800">
          <Logo dark src={settings.logoUrl} />
          <p className="text-xs text-green-300 mt-2">CMS Dashboard v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-green-800 text-white' : 'text-green-100 hover:bg-green-800'}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-green-800">
          <div className="flex items-center mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-mada-sand text-mada-green flex items-center justify-center font-bold mr-3">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-green-300 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-200 hover:bg-green-800 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, Destination } from '../types';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

// --- Logo ---
export const Logo: React.FC<{ className?: string, dark?: boolean, src?: string }> = ({ className = "h-8", dark = false, src }) => {
  if (src) {
    return <img src={src} alt="Travel Mada" className={`${className} object-contain`} />;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto fill-current text-mada-green">
        <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 70c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
        <path d="M50 25c-5 0-15 20-15 35 0 8.3 6.7 15 15 15s15-6.7 15-15c0-15-10-35-15-35z" className="text-mada-accent fill-current opacity-80"/>
      </svg>
      <span className={`font-serif font-bold text-xl tracking-tight ${dark ? 'text-white' : 'text-mada-green'}`}>
        Travel<span className="text-mada-accent">Mada</span>
      </span>
    </div>
  );
};

// --- Blog Card ---
export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link to={`/blog/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
    <div className="relative h-56 overflow-hidden">
      <img 
        src={post.coverImage} 
        alt={post.title} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop"; // Reliable fallback
        }}
      />
      <div className="absolute top-4 left-4 bg-mada-sand text-mada-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        {post.category}
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {post.date}</span>
        <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {post.readTime}</span>
      </div>
      <h3 className="text-xl font-serif font-bold text-mada-green mb-3 group-hover:text-mada-accent transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
        {post.excerpt}
      </p>
      <div className="flex items-center text-mada-accent font-medium text-sm mt-auto">
        Read Article <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"/>
      </div>
    </div>
  </Link>
);

// --- Destination Card ---
export const DestinationCard: React.FC<{ dest: Destination }> = ({ dest }) => (
  <div className="relative group overflow-hidden rounded-2xl cursor-pointer">
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"/>
    <img 
      src={dest.image} 
      alt={dest.name} 
      className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700 bg-gray-200"
      onError={(e) => {
        // Fallback to a reliable generic travel image if the specific one fails
        e.currentTarget.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop";
      }}
    />
    <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full">
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs uppercase tracking-widest font-bold text-mada-sand mb-1 flex items-center">
          <MapPin className="w-3 h-3 mr-1" /> {dest.region}
        </p>
        <h3 className="text-2xl font-serif font-bold mb-2">{dest.name}</h3>
        <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
          {dest.description}
        </p>
      </div>
    </div>
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-mada-green text-white hover:bg-green-900 focus:ring-green-900",
    secondary: "bg-mada-accent text-white hover:bg-amber-700 focus:ring-amber-600",
    outline: "border-2 border-mada-green text-mada-green hover:bg-mada-green hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
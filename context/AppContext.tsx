import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, User, SiteSettings } from '../types';

interface AppContextType {
  posts: BlogPost[];
  user: User | null;
  settings: SiteSettings;
  login: (email: string) => void;
  logout: () => void;
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  updateSettings: (settings: SiteSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Avenue of the Baobabs: A Sunset to Remember",
    slug: "avenue-of-baobabs",
    excerpt: "Witness the majestic ancient trees of Madagascar in their golden hour glory.",
    content: "The Avenue of the Baobabs is a prominent group of Grandidier's baobabs lining the dirt road between Morondava and Belon'i Tsiribihina in the Menabe region of western Madagascar. Its striking landscape draws travelers from around the world, making it one of the most visited locations in the region. The best time to visit is at sunset when the sky turns a fiery orange behind the massive trunks.",
    coverImage: "https://picsum.photos/800/600?random=1",
    author: "Sarah Jenkins",
    date: "Oct 12, 2023",
    category: "Nature" as any,
    readTime: "5 min",
    tags: ["Baobab", "Sunset", "Photography"],
    status: 'published'
  },
  {
    id: '2',
    title: "Nosy Be: The Perfumed Island",
    slug: "nosy-be-guide",
    excerpt: "Explore the crystal clear waters and ylang-ylang plantations of Nosy Be.",
    content: "Nosy Be is Madagascar's premier beach destination. Known as the 'Perfumed Island' due to the scent of Ylang Ylang in the air, it offers incredible diving, snorkeling, and seafood. Don't miss the Lokobe Nature Reserve to see lemurs in the wild or a boat trip to Nosy Iranja.",
    coverImage: "https://picsum.photos/800/600?random=2",
    author: "Malagasy Explorer",
    date: "Nov 05, 2023",
    category: "Beaches",
    readTime: "7 min",
    tags: ["Beach", "Diving", "Luxury"],
    status: 'published'
  },
  {
    id: '3',
    title: "Lemurs of Andasibe-Mantadia",
    slug: "lemurs-andasibe",
    excerpt: "Hearing the haunting call of the Indri Indri in the misty rainforests.",
    content: "Andasibe-Mantadia National Park is the best place to see the Indri, the largest living lemur. The park is accessible from the capital, Antananarivo, and offers a cool, misty rainforest environment teeming with biodiversity.",
    coverImage: "https://picsum.photos/800/600?random=3",
    author: "Dr. Eco",
    date: "Sep 20, 2023",
    category: "Wildlife",
    readTime: "6 min",
    tags: ["Lemurs", "Rainforest", "Hiking"],
    status: 'published'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({ siteName: 'Travel Mada' });

  const login = (email: string) => {
    setUser({
      id: 'admin-1',
      name: 'Admin User',
      email,
      role: 'admin'
    });
  };

  const logout = () => setUser(null);

  const addPost = (post: BlogPost) => {
    setPosts([post, ...posts]);
  };

  const updatePost = (updatedPost: BlogPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

  const updateSettings = (newSettings: SiteSettings) => setSettings(newSettings);

  return (
    <AppContext.Provider value={{ posts, user, login, logout, addPost, updatePost, deletePost, getPostBySlug, settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
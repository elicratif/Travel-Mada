import React from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  category: Category;
  readTime: string;
  tags: string[];
  slug: string;
  seoTitle?: string;
  seoDesc?: string;
  status: 'published' | 'draft';
}

export type Category = 'Beaches' | 'Wildlife' | 'Culture' | 'Adventure' | 'Food';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
}

export interface SiteSettings {
  logoUrl?: string;
  siteName: string;
}
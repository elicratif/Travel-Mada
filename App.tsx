import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { Home, BlogList, BlogPostPage, Destinations, Contact } from './pages/PublicPages';
import { Dashboard, PostManager, Login, Settings } from './pages/AdminPages';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogList /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
          <Route path="/destinations" element={<PublicLayout><Destinations /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><div className="pt-20 text-center text-xl">About Page Placeholder</div></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/posts" element={<AdminLayout><PostManager /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
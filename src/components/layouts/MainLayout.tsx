
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check local storage for sidebar state
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // Save to local storage
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  if (!isMounted) {
    return null; // Prevent layout shift during hydration
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border p-4 flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-accent transition-colors duration-200 mr-4"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <ArrowLeftFromLine size={18} /> : <ArrowRightFromLine size={18} />}
          </button>
          
          <SearchBar className="max-w-md w-full" />
        </div>
        
        <main className="flex-1 p-4 md:p-8 transition-all duration-300 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

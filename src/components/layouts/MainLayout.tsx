
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

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
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-card p-2 rounded-full shadow-md transition-all duration-300 hover:bg-accent md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <ArrowLeftFromLine size={18} /> : <ArrowRightFromLine size={18} />}
        </button>
        
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 hidden bg-card p-2 rounded-full shadow-md transition-all duration-300 hover:bg-accent md:flex items-center justify-center"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <ArrowLeftFromLine size={18} /> : <ArrowRightFromLine size={18} />}
        </button>
        
        <main className="flex-1 p-4 md:p-8 transition-all duration-300 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

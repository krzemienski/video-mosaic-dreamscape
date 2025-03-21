
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Film, Folder, Home, Info, RefreshCw } from 'lucide-react';
import { fetchCategories, refreshRemoteData } from '@/services/videoApi';
import { ExtendedCategory } from '@/types/video';
import { toast } from 'sonner';

interface CategoryItem {
  name: string;
  slug: string;
  subcategories?: CategoryItem[];
}

interface AccordionItemProps {
  category: CategoryItem;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-sidebar-border">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-sidebar-accent transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-muted-foreground" />
          <span>{category.name}</span>
        </div>
        <button className="text-muted-foreground">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      {isOpen && category.subcategories && category.subcategories.length > 0 && (
        <div className="pl-6 bg-sidebar-accent/30 animate-accordion-down">
          {category.subcategories.map((subcategory) => (
            <Link 
              key={subcategory.slug}
              to={`/category/${category.slug}/${subcategory.slug}`}
              className="flex items-center gap-2 p-3 hover:bg-sidebar-accent transition-colors duration-200"
            >
              <Film size={16} className="text-muted-foreground" />
              <span className="text-sm">{subcategory.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      console.log('Sidebar: Fetching categories...');
      const data = await fetchCategories();
      console.log('Sidebar: Loaded categories count:', data.length);
      
      if (data.length > 0) {
        console.log('Sidebar: First few categories:', data.slice(0, 3).map(c => c.name).join(', '));
      }
      
      setCategories(data);
    } catch (error: any) {
      console.error('Error loading categories for sidebar:', error);
      
      // Check for CORS related errors
      if (error.message && (
          error.message.includes('CORS') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('Network Error')
      )) {
        setErrorMessage('CORS issue detected. The application is using fallback data.');
        toast.error('CORS issue detected. Using fallback data.');
      } else {
        setErrorMessage('Failed to load categories');
        toast.error('Failed to load categories');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setErrorMessage(null);
      toast.loading('Refreshing data...');
      
      const freshData = await refreshRemoteData();
      setCategories(freshData);
      
      toast.success('Data refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      
      // Check for CORS related errors
      if (error.message && (
          error.message.includes('CORS') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('Network Error')
      )) {
        setErrorMessage('CORS issue detected. The application is using fallback data.');
        toast.error('CORS issue detected. Using fallback data.');
      } else {
        setErrorMessage('Failed to refresh data');
        toast.error('Failed to refresh data');
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out overflow-hidden border-r border-sidebar-border
      ${isOpen ? 'w-64' : 'w-0 md:w-0'}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Video Resources</h2>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-sidebar-accent rounded-full text-muted-foreground transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Curated learning materials</p>
          
          {errorMessage && (
            <div className="mt-2 text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-2">
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-3 hover:bg-sidebar-accent transition-colors duration-200"
            >
              <Home size={18} className="text-muted-foreground" />
              <span>Home</span>
            </Link>
            
            <div className="mt-2 mb-2">
              <div className="px-4 py-2 text-xs text-muted-foreground">
                CATEGORIES {isLoading ? '(Loading...)' : `(${categories.length})`}
              </div>
              
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">Loading categories...</div>
              ) : (
                categories.map((category) => (
                  <AccordionItem key={category.slug} category={category} />
                ))
              )}
            </div>
            
            <Link 
              to="/about"
              className="flex items-center gap-2 px-4 py-3 hover:bg-sidebar-accent transition-colors duration-200 mt-2"
            >
              <Info size={18} className="text-muted-foreground" />
              <span>About</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Video Resources
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

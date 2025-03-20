
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Film, Folder, Home, Info } from 'lucide-react';
import { fetchCategories } from '@/services/videoApi';
import { ExtendedCategory } from '@/types/video';

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        console.log('Sidebar: Fetching categories...');
        const data = await fetchCategories();
        console.log('Sidebar: Loaded categories count:', data.length);
        
        if (data.length > 0) {
          console.log('Sidebar: First few categories:', data.slice(0, 3).map(c => c.name).join(', '));
        }
        
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories for sidebar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out overflow-hidden border-r border-sidebar-border
      ${isOpen ? 'w-64' : 'w-0 md:w-0'}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-semibold">Video Resources</h2>
          <p className="text-sm text-muted-foreground mt-1">Curated learning materials</p>
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

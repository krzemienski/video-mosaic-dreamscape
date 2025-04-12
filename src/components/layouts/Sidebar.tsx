import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Film, Folder, Home, Loader } from 'lucide-react';
import { fetchCategories } from '@/services/videoApi';
import { ExtendedCategory } from '@/types/video';
import { toast } from 'sonner';
import Logo from '@/components/brand/Logo';

interface CategoryItem {
  name: string;
  slug: string;
  subcategories?: CategoryItem[];
}

interface AccordionItemProps {
  category: CategoryItem;
  level?: number;
  parentSlug?: string;
}

interface GithubRepoInfo {
  stargazers_count: number;
  html_url: string;
  owner: {
    login: string;
  };
  name: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  category,
  level = 0,
  parentSlug = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Create the correct path for nested subcategories
  const categoryPath = parentSlug ? `${parentSlug}/${category.slug}` : category.slug;

  return <div className={`border-b border-sidebar-border ${level > 0 ? 'pl-3' : ''}`}>
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-sidebar-accent transition-colors duration-200" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-muted-foreground" />
          <span>{category.name}</span>
        </div>
        <button className="text-muted-foreground">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {isOpen && category.subcategories && category.subcategories.length > 0 && <div className="pl-6 bg-sidebar-accent/30 animate-accordion-down">
          {category.subcategories.map(subcategory => {
            // If this subcategory has nested subcategories, render it recursively
            if (subcategory.subcategories && subcategory.subcategories.length > 0) {
              return <AccordionItem
                key={subcategory.slug}
                category={subcategory}
                level={level + 1}
                parentSlug={categoryPath}
              />;
            } else {
              // Render leaf subcategory as a link
              return <Link
                key={subcategory.slug}
                to={`/category/${categoryPath}/${subcategory.slug}`}
                className="flex items-center gap-2 p-3 hover:bg-sidebar-accent transition-colors duration-200"
              >
                <Film size={16} className="text-muted-foreground" />
                <span className="text-sm">{subcategory.name}</span>
              </Link>;
            }
          })}
        </div>}
    </div>;
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen
}) => {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState({
    name: "awesome-video",
    owner: "krzemienski",
    stars: 1600,
    url: "https://github.com/krzemienski/awesome-video"
  });

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
      if (error.message && error.message.includes('CORS')) {
        setErrorMessage('We\'re having trouble accessing the resources due to CORS restrictions. Please try refreshing or come back later.');
        toast.error('CORS issue detected. Unable to load content.');
      } else {
        setErrorMessage('Failed to load categories. Please try again later.');
        toast.error('Failed to load categories');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGithubRepoInfo = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/krzemienski/awesome-video');
      if (response.ok) {
        const data: GithubRepoInfo = await response.json();
        setRepoInfo({
          name: data.name,
          owner: data.owner.login,
          stars: data.stargazers_count,
          url: data.html_url
        });
      }
    } catch (error) {
      console.error('Error fetching GitHub repo information:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    fetchGithubRepoInfo();
  }, []);

  return <aside className={`fixed top-0 left-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out overflow-hidden border-r border-sidebar-border
      ${isOpen ? 'w-64' : 'w-0 md:w-0'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <Logo type="full" size={32} />
          </div>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            From FFMPEG to playback, streaming video.
          </p>

          {errorMessage && <div className="mt-2 text-xs text-amber-500 bg-amber-950/30 p-2 rounded-md font-mono">
              {errorMessage}
            </div>}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-2">
            <Link to="/" className="flex items-center gap-2 px-4 py-3 hover:bg-sidebar-accent transition-colors duration-200" onClick={() => window.gtag?.('event', 'navigation', {
            action: 'home_click'
          })}>
              <Home size={18} className="text-brand-cyan" />
              <span className="font-mono tracking-wide">Home</span>
            </Link>

            <div className="mt-2 mb-2">
              <div className="px-4 py-2 text-xs text-muted-foreground flex items-center font-mono tracking-wider">
                CATEGORIES {isLoading ? <span className="ml-2 inline-flex items-center">
                    <Loader size={12} className="animate-spin mr-1" />
                    Loading...
                  </span> : `(${categories.length})`}
              </div>

              {isLoading ? <div className="px-4 py-3 text-sm text-muted-foreground flex items-center">
                  <Loader size={16} className="animate-spin mr-2" />
                  Loading categories...
                </div> : categories.map(category => <AccordionItem key={category.slug} category={category} />)}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <a
            href={repoInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-md bg-brand-magenta/10 hover:bg-brand-magenta/20 transition-colors text-sm"
            onClick={() => window.gtag?.('event', 'external_link', { destination: 'github_repo' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cyan">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <div>
              <div className="font-mono tracking-wide text-brand-magenta">{repoInfo.owner}/{repoInfo.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <span>⭐ {repoInfo.stars}</span>
                <span className="mx-1">•</span>
                <span>Contribute</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </aside>;
};

export default Sidebar;

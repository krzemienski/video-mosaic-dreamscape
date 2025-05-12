
import React, { useState, useRef, useEffect } from 'react';
import { Search, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';
import useAnalytics from '@/hooks/useAnalytics';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  minCharsToSearch?: number;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search resources...",
  className = "",
  minCharsToSearch = 2,
  debounceTime = 600
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const isInitialMount = useRef(true);
  
  // Create a stable reference to the debounce function
  const debouncedSearchRef = useRef<(term: string) => void>();
  
  useEffect(() => {
    // Initialize the debounced function once
    debouncedSearchRef.current = debounce((term: string) => {
      if (term.trim().length >= minCharsToSearch) {
        setIsSearching(false);
        navigate(`/search?q=${encodeURIComponent(term.trim())}`);
        
        // Track search initiation
        trackEvent(
          'search_initiated', 
          'interaction', 
          term, 
          undefined, 
          { search_method: 'debounced' }
        );
      }
    }, debounceTime);
    
    // Cleanup function
    return () => {
      // Cancel any pending debounced calls if component unmounts
      if (debouncedSearchRef.current) {
        // TypeScript doesn't know about the cancel property on debounced functions
        const debouncedFn = debouncedSearchRef.current as any;
        if (debouncedFn.cancel) {
          debouncedFn.cancel();
        }
      }
    };
  }, [navigate, trackEvent, minCharsToSearch, debounceTime]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Skip search on initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Show searching indicator only for valid search terms
    if (value.trim().length >= minCharsToSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim().length >= minCharsToSearch) {
      e.preventDefault();
      
      // Cancel any pending debounced calls
      const debouncedFn = debouncedSearchRef.current as any;
      if (debouncedFn?.cancel) {
        debouncedFn.cancel();
      }
      
      setIsSearching(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      
      // Track search initiated by Enter key
      trackEvent(
        'search_initiated', 
        'interaction', 
        searchTerm, 
        undefined, 
        { search_method: 'enter_key' }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isSearching ? (
        <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
      ) : (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="pl-10 w-full bg-secondary/50 border-secondary focus-visible:ring-primary-500"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchBar;

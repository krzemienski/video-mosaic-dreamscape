
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';
import useAnalytics from '@/hooks/useAnalytics';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search resources...",
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const isInitialMount = useRef(true);
  
  // Create a stable reference to the debounce function
  const debouncedSearchRef = useRef<(term: string) => void>();
  
  useEffect(() => {
    // Initialize the debounced function once
    debouncedSearchRef.current = debounce((term: string) => {
      if (term.trim().length > 1) {
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
    }, 800); // Increased debounce delay to reduce search frequency
    
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
  }, [navigate, trackEvent]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Skip search on initial render or for very short terms
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Don't trigger search for very short terms
    if (value.trim().length <= 1) {
      return;
    }
    
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim().length > 1) {
      e.preventDefault();
      
      // Cancel any pending debounced calls
      const debouncedFn = debouncedSearchRef.current as any;
      if (debouncedFn?.cancel) {
        debouncedFn.cancel();
      }
      
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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="pl-10 w-full bg-secondary/50 border-secondary focus-visible:ring-primary-500"
      />
    </div>
  );
};

export default SearchBar;

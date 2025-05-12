
import React, { useState, useCallback } from 'react';
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

  // Debounced search navigation
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim().length > 1) {
        navigate(`/search?q=${encodeURIComponent(term)}`);
        
        // Track search initiation (different from search results tracking)
        trackEvent(
          'search_initiated', 
          'interaction', 
          term, 
          undefined, 
          { search_method: 'debounced' }
        );
      }
    }, 500),
    [navigate, trackEvent]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim().length > 1) {
      e.preventDefault();
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      
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

import React, { useState, useRef, useEffect } from 'react';
import { Search, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
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
  debounceTime = 800 // Increased from 200ms to 800ms to give users more time to type
}) => {
  const location = useLocation();
  // Initialize search term from URL query parameter if available
  const getInitialSearchTerm = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('q') || '';
  };

  const [searchTerm, setSearchTerm] = useState(getInitialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a stable reference to the debounced search function
  const debouncedSearchRef = useRef<(...args: any[]) => void>();

  // Initialize the debounced search function once on component mount
  useEffect(() => {
    // Define the actual search function
    const performSearch = (term: string) => {
      console.log('Debounced search executing with term:', term);
      if (term.length >= minCharsToSearch) {
        setIsSearching(false);
        trackEvent('search', { term });

        // Use replace instead of push to avoid multiple history entries
        navigate(`/search?q=${encodeURIComponent(term)}`, { replace: true });
      }
    };

    // Create the debounced version of the search function
    debouncedSearchRef.current = debounce(performSearch, debounceTime);

    // Clean up function
    return () => {
      // No need to cleanup as debounce's cancel is not exposed in our implementation
    };
  }, [navigate, minCharsToSearch, debounceTime, trackEvent]);

  // Update search term when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && queryFromUrl !== searchTerm) {
      setSearchTerm(queryFromUrl);
    }
  }, [location.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);

    console.log('Search term changed to:', newTerm);

    if (newTerm.length >= minCharsToSearch) {
      setIsSearching(true);
      console.log('Invoking debounced search for:', newTerm);
      // Use the stable reference to the debounced search function
      debouncedSearchRef.current?.(newTerm);
    } else {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search form submitted with term:', searchTerm);

    if (searchTerm.length >= minCharsToSearch) {
      setIsSearching(false);
      trackEvent('search', { term: searchTerm });
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className={`relative ${className}`}>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full pl-8 pr-10"
        aria-label={`Search with auto-complete (after ${minCharsToSearch} characters)`}
      />

      {isSearching && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
          Searching...
        </div>
      )}
    </form>
  );
};

export default SearchBar;

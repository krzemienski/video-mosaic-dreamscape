
import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';

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

  // Debounced search navigation
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim().length > 1) {
        navigate(`/search?q=${encodeURIComponent(term)}`);
      }
    }, 500),
    [navigate]
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

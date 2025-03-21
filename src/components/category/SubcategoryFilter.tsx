
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SubcategoryOption {
  label: string;
  value: string | null;
}

interface SubcategoryFilterProps {
  subcategories: SubcategoryOption[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (value: string | null) => void;
}

const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({ 
  subcategories, 
  selectedSubcategory, 
  onSubcategoryChange 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubcategoryChange = (value: string | null) => {
    onSubcategoryChange(value);
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg text-sm"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {subcategories.find(sub => sub.value === selectedSubcategory)?.label || 'All Projects'}
        <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 animate-fade-in-down">
          {subcategories.map((sub) => (
            <button
              key={sub.value || 'all'}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                selectedSubcategory === sub.value ? 'bg-accent/50 font-medium' : ''
              }`}
              onClick={() => handleSubcategoryChange(sub.value)}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryFilter;


import React from 'react';
import ViewToggle from '@/components/ui/ViewToggle';
import SubcategoryFilter from './SubcategoryFilter';

interface CategoryControlsProps {
  subcategories: Array<{ label: string; value: string | null }>;
  selectedSubcategory: string | null;
  onSubcategoryChange: (value: string | null) => void;
  view: 'grid' | 'list' | 'masonry';
  onViewChange: (view: 'grid' | 'list' | 'masonry') => void;
}

const CategoryControls: React.FC<CategoryControlsProps> = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  view,
  onViewChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <SubcategoryFilter 
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={onSubcategoryChange}
      />
      <ViewToggle view={view} onChange={onViewChange} />
    </div>
  );
};

export default CategoryControls;

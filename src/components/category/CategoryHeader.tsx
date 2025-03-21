
import React from 'react';
import { ExtendedCategory } from '@/types/video';
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryHeaderProps {
  category: ExtendedCategory | null;
  isLoading: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-muted/40 rounded w-1/4 mb-3"></div>
        <div className="h-4 bg-muted/30 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!category) return null;
  
  return (
    <div className="mb-8 animate-fade-in-down">
      <span className="inline-block text-xs font-mono font-medium text-brand-cyan bg-brand-cyan/10 rounded-full px-3 py-1 mb-3 tracking-wider uppercase">
        CATEGORY
      </span>
      <h1 className="text-3xl md:text-4xl font-bold mb-3 font-mono tracking-wider text-glow text-brand-magenta uppercase">
        {category.name}
      </h1>
      {category.description && (
        <p className="text-muted-foreground max-w-3xl font-mono tracking-wide">
          {category.description}
        </p>
      )}
    </div>
  );
};

export default CategoryHeader;

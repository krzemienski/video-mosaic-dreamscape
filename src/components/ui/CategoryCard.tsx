
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Folder } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  count?: number;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in group"
    >
      <div className="relative">
        <div className="aspect-video w-full bg-muted/30 overflow-hidden">
          {category.thumbnail ? (
            <img 
              src={category.thumbnail} 
              alt={category.name} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <Folder size={48} className="text-muted-foreground/50" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{category.name}</h3>
          {category.count !== undefined && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
              {category.count} videos
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
        )}
        <div className="flex items-center justify-end text-sm font-medium text-primary group-hover:underline transition-all">
          View category <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

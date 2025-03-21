
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Code, FileText, Package, Archive, Radio, Film, Library } from 'lucide-react';

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

// Map category names to appropriate icons
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('codec') || name.includes('compression')) {
    return <Archive size={48} className="text-primary/70" />;
  } else if (name.includes('encoding') || name.includes('transcoding')) {
    return <Code size={48} className="text-primary/70" />;
  } else if (name.includes('stream') || name.includes('broadcast')) {
    return <Radio size={48} className="text-primary/70" />;
  } else if (name.includes('player') || name.includes('playback')) {
    return <Film size={48} className="text-primary/70" />;
  } else if (name.includes('docs') || name.includes('resources')) {
    return <BookOpen size={48} className="text-primary/70" />;
  } else if (name.includes('tool') || name.includes('software')) {
    return <Package size={48} className="text-primary/70" />;
  } else {
    return <Library size={48} className="text-primary/70" />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in group"
    >
      <div className="relative">
        <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden flex items-center justify-center">
          {category.thumbnail ? (
            <img 
              src={category.thumbnail} 
              alt={category.name} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getCategoryIcon(category.name)}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{category.name}</h3>
          {category.count !== undefined && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
              {category.count} resources
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
        )}
        <div className="flex items-center justify-end text-sm font-medium text-primary group-hover:underline transition-all">
          View resources <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

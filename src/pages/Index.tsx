
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryCard from '@/components/ui/CategoryCard';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategories } from '@/services/api';
import { Category } from '@/components/ui/CategoryCard';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCategories();
      
      // Add count property to each category
      const categoriesWithCount = data.map(category => {
        const videosCount = (category.videos?.length || 0) + 
          (category.subcategories?.reduce((sum, sub) => sum + (sub.videos?.length || 0), 0) || 0);
        
        return {
          ...category,
          count: videosCount
        };
      });
      
      setCategories(categoriesWithCount);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-video w-full bg-muted/30"></div>
        <div className="p-4">
          <div className="h-6 bg-muted/40 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-full mb-1"></div>
          <div className="h-4 bg-muted/30 rounded w-2/3"></div>
          <div className="flex justify-end mt-4">
            <div className="h-5 bg-muted/40 rounded w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center animate-fade-in-down">
          <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
            AWESOME VIDEO RESOURCES
          </span>
          <h1 className="text-4xl font-bold mb-4">Video Resource Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of high-quality video resources across various categories.
            Find the perfect resources to enhance your knowledge and skills.
          </p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={loadCategories} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? renderSkeletons() : (
              categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;

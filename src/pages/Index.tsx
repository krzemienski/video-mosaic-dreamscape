import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryCard from '@/components/ui/CategoryCard';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategories } from '@/services/api';
import { Category } from '@/components/ui/CategoryCard';
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MetaTags from '@/components/SEO/MetaTags';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      console.log("Index: Starting to load categories");
      setIsLoading(true);
      setError(null);
      const data = await fetchCategories();
      console.log(`Index: Received ${data.length} categories from API`);
      
      // Track successful data load
      window.gtag?.('event', 'data_load', { 
        event_category: 'api',
        event_label: 'categories_loaded',
        value: data.length
      });

      if (data.length === 0) {
        console.error("Index: No categories returned from API");
        setError("No categories found. Please try again later.");
        toast({
          title: "No data found",
          description: "We couldn't find any categories to display.",
          variant: "destructive",
        });
        
        // Track error event
        window.gtag?.('event', 'error', { 
          event_category: 'api',
          event_label: 'no_categories_found'
        });
        return;
      }

      // Add count property to each category
      const categoriesWithCount = data.map(category => {
        const resourcesCount = (category.videos?.length || 0) +
          (category.subcategories?.reduce((sum, sub) => sum + (sub.videos?.length || 0), 0) || 0);

        console.log(`Index: Category "${category.name}" has ${resourcesCount} total resources`);

        return {
          ...category,
          count: resourcesCount
        };
      });

      setCategories(categoriesWithCount);
      console.log("Index: Categories set successfully");

    } catch (err) {
      console.error("Index: Error loading categories", err);
      setError("Failed to load categories. Please try again.");
      
      // Track error event
      window.gtag?.('event', 'error', { 
        event_category: 'api',
        event_label: 'categories_load_failed',
        error_message: err instanceof Error ? err.message : 'Unknown error'
      });
      
      toast({
        title: "Error loading data",
        description: "There was a problem loading the categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Index: Component mounted, loading categories");
    loadCategories();
    
    // Track page view
    window.gtag?.('event', 'page_view', {
      page_title: 'Home',
      page_location: window.location.href,
      page_path: '/'
    });
  }, []);

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <div className="flex justify-end">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <MainLayout>
      <MetaTags 
        title="Awesome Video - Discover Curated Video Resources"
        description="Explore a handpicked collection of the best video resources across categories like tutorials, entertainment, education, and more."
        canonicalUrl="https://awesome.video/"
        keywords={[
          'video resources', 
          'curated videos', 
          'best video content', 
          'video collection',
          'video categories',
          'awesome video'
        ]}
      />
      
      <div className="max-w-7xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Loader size={16} className="animate-spin mr-2" />
            Loading resources...
          </div>
        )}

        {error ? (
          <ErrorState message={error} onRetry={loadCategories} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? renderSkeletons() : (
              categories.length > 0 ? (
                categories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No categories found. Please try again later.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;

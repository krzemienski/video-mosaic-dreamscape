
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryCard from '@/components/ui/CategoryCard';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategories } from '@/services/api';
import { Category } from '@/components/ui/CategoryCard';
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

      if (data.length === 0) {
        console.error("Index: No categories returned from API");
        setError("No categories found. Please try again later.");
        toast({
          title: "No data found",
          description: "We couldn't find any categories to display.",
          variant: "destructive",
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

      // Show success toast
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${categoriesWithCount.length} categories.`,
      });
    } catch (err) {
      console.error("Index: Error loading categories", err);
      setError("Failed to load categories. Please try again.");
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center animate-fade-in-down">
          <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
            AWESOME VIDEO RESOURCES
          </span>
          <h1 className="text-4xl font-bold mb-4">Awesome Video</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of high-quality resources for video technology,
            from FFMPEG to playback, encoding, and streaming.
          </p>
          
          {isLoading && (
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Loader size={16} className="animate-spin mr-2" />
              Loading resources...
            </div>
          )}
        </div>

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

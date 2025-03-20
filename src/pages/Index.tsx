import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import CategoryCard from '@/components/ui/CategoryCard';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategories, refreshRemoteData } from '@/services/api';
import { Category } from '@/components/ui/CategoryCard';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
        const videosCount = (category.videos?.length || 0) +
          (category.subcategories?.reduce((sum, sub) => sum + (sub.videos?.length || 0), 0) || 0);

        console.log(`Index: Category "${category.name}" has ${videosCount} total videos`);

        return {
          ...category,
          count: videosCount
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

  const handleRefresh = async () => {
    try {
      console.log("Index: Refreshing data from remote source");
      setIsRefreshing(true);

      toast({
        title: "Refreshing data",
        description: "Fetching latest data from remote source...",
      });

      const data = await refreshRemoteData();
      console.log(`Index: Received ${data.length} categories from refresh`);

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

      toast({
        title: "Data refreshed",
        description: `Successfully refreshed ${categoriesWithCount.length} categories.`,
      });
    } catch (err) {
      console.error("Index: Error refreshing data", err);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing the data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Index: Component mounted, loading categories");
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
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
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

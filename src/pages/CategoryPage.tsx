
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import VideoCard from '@/components/ui/VideoCard';
import ViewToggle from '@/components/ui/ViewToggle';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategory, fetchVideos } from '@/services/api';
import { ExtendedCategory, VideoResource } from '@/types/video';
import useViewState from '@/hooks/useViewState';
import { ChevronDown } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface SubcategoryOption {
  label: string;
  value: string | null;
}

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug?: string }>();
  const [category, setCategory] = useState<ExtendedCategory | null>(null);
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useViewState('grid');
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategorySlug || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loadData = async () => {
    if (!categorySlug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`CategoryPage: Loading data for category slug "${categorySlug}"`);
      
      // Fetch category details
      const categoryData = await fetchCategory(categorySlug);
      if (!categoryData) {
        console.error("CategoryPage: Category not found");
        setError("Category not found");
        toast({
          title: "Category not found",
          description: "We couldn't find the category you're looking for.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`CategoryPage: Found category "${categoryData.name}" with ${categoryData.videos?.length || 0} videos`);
      setCategory(categoryData);
      
      // Fetch videos
      console.log(`CategoryPage: Fetching videos for category "${categorySlug}" and subcategory "${selectedSubcategory || 'none'}"`);
      const videosData = await fetchVideos(categorySlug, selectedSubcategory || undefined);
      console.log(`CategoryPage: Fetched ${videosData.length} videos`);
      setVideos(videosData);
      
      // Build subcategory options from the category data
      const subcategoryOptions: SubcategoryOption[] = [
        { label: 'All Videos', value: null }
      ];
      
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        console.log(`CategoryPage: Category has ${categoryData.subcategories.length} subcategories`);
        categoryData.subcategories.forEach(sub => {
          if (sub.videos && sub.videos.length > 0) {
            subcategoryOptions.push({
              label: `${sub.name} (${sub.videos.length})`,
              value: sub.slug
            });
          }
        });
      } else {
        console.log('CategoryPage: Category has no subcategories');
      }
      
      setSubcategories(subcategoryOptions);
      
      // Show success toast
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${videosData.length} videos in ${categoryData.name}.`,
      });
    } catch (err) {
      console.error("CategoryPage: Error loading data", err);
      setError("Failed to load category data. Please try again.");
      toast({
        title: "Error loading data",
        description: "There was a problem loading the category data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("CategoryPage: Component mounted or updated, loading data");
    loadData();
  }, [categorySlug, selectedSubcategory]);

  const handleSubcategoryChange = (value: string | null) => {
    console.log(`CategoryPage: Subcategory changed to "${value || 'All'}"`);
    setSelectedSubcategory(value);
    setDropdownOpen(false);
  };

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-video w-full bg-muted/30"></div>
        <div className="p-4">
          <div className="h-6 bg-muted/40 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-full mb-1"></div>
          <div className="h-4 bg-muted/30 rounded w-2/3"></div>
          <div className="flex justify-between mt-4">
            <div className="h-5 bg-muted/40 rounded w-16"></div>
            <div className="h-5 bg-muted/40 rounded w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error} onRetry={loadData} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-down">
          {!isLoading && category && (
            <>
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                CATEGORY
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground max-w-3xl">{category.description}</p>
              )}
            </>
          )}
          
          {isLoading && (
            <div className="animate-pulse">
              <div className="h-8 bg-muted/40 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-muted/30 rounded w-1/2"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg text-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {subcategories.find(sub => sub.value === selectedSubcategory)?.label || 'All Videos'}
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
          
          <ViewToggle view={view} onChange={setView} />
        </div>

        {isLoading ? (
          <div className={`grid gap-6 ${
            view === 'list' 
              ? 'grid-cols-1' 
              : view === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {renderSkeletons()}
          </div>
        ) : videos.length > 0 ? (
          <div className={`grid gap-6 ${
            view === 'list' 
              ? 'grid-cols-1' 
              : view === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} view={view} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-border/40 animate-fade-in">
            <p className="text-muted-foreground">No videos found in this category.</p>
            <button 
              onClick={loadData} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;

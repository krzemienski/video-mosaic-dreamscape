
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategory, fetchVideos } from '@/services/api';
import { ExtendedCategory, VideoResource } from '@/types/video';
import useViewState from '@/hooks/useViewState';
import { toast } from "@/components/ui/use-toast";

// Import our new components
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryControls from '@/components/category/CategoryControls';
import ProjectsDisplay from '@/components/category/ProjectsDisplay';

interface SubcategoryOption {
  label: string;
  value: string | null;
}

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug?: string }>();
  const [category, setCategory] = useState<ExtendedCategory | null>(null);
  const [projects, setProjects] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useViewState('grid');
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategorySlug || null);

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
      
      console.log(`CategoryPage: Found category "${categoryData.name}" with ${categoryData.videos?.length || 0} projects`);
      setCategory(categoryData);
      
      // Fetch projects
      console.log(`CategoryPage: Fetching projects for category "${categorySlug}" and subcategory "${selectedSubcategory || 'none'}"`);
      const projectsData = await fetchVideos(categorySlug, selectedSubcategory || undefined);
      console.log(`CategoryPage: Fetched ${projectsData.length} projects`);
      setProjects(projectsData);
      
      // Build subcategory options
      const subcategoryOptions: SubcategoryOption[] = [
        { label: 'All Projects', value: null }
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
        description: `Loaded ${projectsData.length} projects in ${categoryData.name}.`,
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
        <CategoryHeader category={category} isLoading={isLoading} />
        
        <CategoryControls 
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={handleSubcategoryChange}
          view={view}
          onViewChange={setView}
        />

        <ProjectsDisplay 
          projects={projects}
          isLoading={isLoading}
          view={view}
          onRetry={loadData}
        />
      </div>
    </MainLayout>
  );
};

export default CategoryPage;

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ErrorState from '@/components/ui/ErrorState';
import { fetchCategory, fetchVideos } from '@/services/videoApi';
import { ExtendedCategory, VideoResource } from '@/types/video';
import useViewState from '@/hooks/useViewState';
import { toast } from 'sonner';
import MetaTags from '@/components/SEO/MetaTags';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ExtendedCategory | null>(null);
  const [projects, setProjects] = useState<VideoResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useViewState('grid');
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);

  // Extract the full subcategory path from the URL
  // This handles both single-level and nested subcategories
  const getSubcategoryPathFromUrl = () => {
    // If we have a regular subcategorySlug from useParams, use that
    if (subcategorySlug) {
      console.log(`getSubcategoryPathFromUrl: Using subcategorySlug from params: "${subcategorySlug}"`);
      return subcategorySlug;
    }

    // Otherwise, extract from the pathname
    // pathname will be something like "/category/categorySlug/subcat1/subcat2"
    const pathParts = location.pathname.split('/');
    console.log(`getSubcategoryPathFromUrl: Path parts from pathname:`, pathParts);

    // If we have more than 3 parts (0=empty, 1=category, 2=categorySlug, 3+=subcategory parts)
    if (pathParts.length > 3) {
      // Join all the parts after the categorySlug with slashes
      const subcatPath = pathParts.slice(3).join('/');
      console.log(`getSubcategoryPathFromUrl: Extracted subcategory path: "${subcatPath}"`);
      return subcatPath;
    }

    console.log('getSubcategoryPathFromUrl: No subcategory path found in URL');
    return null;
  };

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(getSubcategoryPathFromUrl());

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
        toast("Category not found", {
          description: "We couldn't find the category you're looking for.",
        });
        return;
      }

      console.log(`CategoryPage: Found category "${categoryData.name}" with ${categoryData.videos?.length || 0} projects`);
      setCategory(categoryData);

      // Get the current subcategory path
      const currentSubcategoryPath = getSubcategoryPathFromUrl();

      // Fetch projects
      console.log(`CategoryPage: Fetching projects for category "${categorySlug}" and subcategory "${currentSubcategoryPath || 'none'}"`);
      const projectsData = await fetchVideos(categorySlug, currentSubcategoryPath || undefined);
      console.log(`CategoryPage: Fetched ${projectsData.length} projects`);
      setProjects(projectsData);

      // Build subcategory options
      const subcategoryOptions: SubcategoryOption[] = [
        { label: 'All Projects', value: null }
      ];

      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        console.log(`CategoryPage: Category has ${categoryData.subcategories.length} subcategories`);

        // Helper function to recursively add subcategories with proper paths
        const addSubcategoriesToOptions = (
          subcats: any[],
          parentPath: string = ''
        ) => {
          subcats.forEach(sub => {
            const subcatPath = parentPath ? `${parentPath}/${sub.slug}` : sub.slug;

            if (sub.videos && sub.videos.length > 0) {
              subcategoryOptions.push({
                label: `${sub.name} (${sub.videos.length})`,
                value: subcatPath
              });
            }

            // Recursively add nested subcategories
            if (sub.subcategories && sub.subcategories.length > 0) {
              addSubcategoriesToOptions(sub.subcategories, subcatPath);
            }
          });
        };

        addSubcategoriesToOptions(categoryData.subcategories);
      } else {
        console.log('CategoryPage: Category has no subcategories');
      }

      setSubcategories(subcategoryOptions);
    } catch (err) {
      console.error("CategoryPage: Error loading data", err);
      setError("Failed to load category data. Please try again.");
      toast("Error loading data", {
        description: "There was a problem loading the category data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to update state when URL changes
  useEffect(() => {
    console.log("CategoryPage: URL path changed, updating state");

    // Extract subcategory path from URL
    const subcatPath = getSubcategoryPathFromUrl();
    console.log(`CategoryPage: Current URL subcategory path: "${subcatPath || 'none'}"`);
    console.log(`CategoryPage: Current state subcategory: "${selectedSubcategory || 'none'}"`);

    // If the URL path is different from the current state, update the state
    if (subcatPath !== selectedSubcategory) {
      console.log(`CategoryPage: Updating selected subcategory from URL: "${subcatPath || 'none'}"`);
      setSelectedSubcategory(subcatPath);
    } else {
      // If they're the same, just load the data
      console.log("CategoryPage: URL path matches current subcategory selection, loading data");
      loadData();
    }
  }, [categorySlug, location.pathname]);

  // Reload data when selected subcategory changes
  useEffect(() => {
    if (categorySlug && selectedSubcategory !== undefined) {
      console.log(`CategoryPage: Selected subcategory changed to "${selectedSubcategory || 'All'}", reloading data`);
      loadData();
    }
  }, [selectedSubcategory]);

  const handleSubcategoryChange = (value: string | null) => {
    console.log(`CategoryPage: Subcategory changed to "${value || 'All'}" from dropdown selection`);

    // Navigate to the new URL path when subcategory changes
    if (categorySlug) {
      if (value) {
        const newPath = `/category/${categorySlug}/${value}`;
        console.log(`CategoryPage: Navigating to new path: ${newPath}`);
        navigate(newPath);
      } else {
        console.log(`CategoryPage: Navigating to category root: /category/${categorySlug}`);
        navigate(`/category/${categorySlug}`);
      }
    }
  };

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error} onRetry={loadData} />
      </MainLayout>
    );
  }

  const getCurrentSubcategoryName = () => {
    if (!selectedSubcategory) return null;

    const subcategory = subcategories.find(sub => sub.value === selectedSubcategory);
    return subcategory ? subcategory.label.split(' (')[0] : null;
  };

  return (
    <MainLayout>
      {/* Dynamic SEO metadata based on category and subcategory */}
      {category && (
        <MetaTags
          title={getCurrentSubcategoryName()
            ? `${getCurrentSubcategoryName()} ${category.name} Videos`
            : `${category.name} Videos`
          }
          description={category.description
            ? category.description
            : `Explore the best ${category.name.toLowerCase()} videos curated for you. ${projects.length} high-quality resources available.`
          }
          canonicalUrl={`https://awesome.video/category/${categorySlug}${selectedSubcategory ? `/${selectedSubcategory}` : ''}`}
          keywords={[
            `${category.name.toLowerCase()} videos`,
            `${category.name.toLowerCase()} resources`,
            'video content',
            getCurrentSubcategoryName()?.toLowerCase() || '',
            'awesome video'
          ].filter(Boolean)}
          ogType="website"
        />
      )}

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

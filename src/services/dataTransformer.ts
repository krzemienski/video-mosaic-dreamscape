
import { AwesomeVideoContents, ExtendedCategory, VideoItem } from '@/types/video';

// Function to convert awesome-video data to our ExtendedCategory format
export const transformAwesomeVideoData = (contents: any): ExtendedCategory[] => {
  console.log('Starting data transformation');

  // Print exactly what the contents structure looks like
  console.log('Raw contents structure:', JSON.stringify(contents, null, 2).substring(0, 1000) + '...');

  if (!contents) {
    console.error('Contents is null or undefined');
    return [];
  }

  // Handle the standard structure from awesome-video repository
  if (contents.categories && Array.isArray(contents.categories)) {
    console.log(`Processing ${contents.categories.length} categories in contents`);

    // Map top-level categories first (those without parent)
    const topLevelCategories = contents.categories.filter(category => !category.parent);
    console.log(`Found ${topLevelCategories.length} top-level categories`);

    return topLevelCategories.map((category, index) => {
      return processCategoryWithProjects(category, index, contents);
    });
  } else {
    console.error('Invalid or missing categories array in contents');
    return [];
  }
};

// Process a category and its associated projects
const processCategoryWithProjects = (category: any, index: number, contents: any): ExtendedCategory => {
  const categoryId = category.id || '';
  const categoryName = category.title || '';
  const categoryDescription = category.description || `Resources related to ${categoryName}`;
  const slug = categoryName.toLowerCase().replace(/\s+/g, '-');

  console.log(`Processing category ${index}: ${categoryName}`);

  // Find all subcategories for this category
  const subcategories = contents.categories
    .filter((subcat: any) => subcat.parent === categoryId)
    .map((subcat: any, subIndex: number) => {
      const subcatName = subcat.title || '';
      const subcatDescription = subcat.description || `Resources related to ${subcatName}`;
      const subcatSlug = subcatName.toLowerCase().replace(/\s+/g, '-');

      // Find all projects belonging to this subcategory
      const subcatProjects = getProjectsForCategory(subcat.id, contents.projects);
      console.log(`Subcategory "${subcatName}" has ${subcatProjects.length} projects`);

      return {
        id: `${index}-sub-${subIndex}`,
        name: subcatName,
        slug: subcatSlug,
        description: subcatDescription,
        videos: subcatProjects.map((project: any, projectIndex: number) =>
          mapProjectToVideoItem(project, index, subIndex, projectIndex)
        ),
      };
    });

  // Find all projects belonging directly to this category
  const categoryProjects = getProjectsForCategory(categoryId, contents.projects);
  console.log(`Category "${categoryName}" has ${categoryProjects.length} direct projects`);

  return {
    id: `cat-${index}`,
    name: categoryName,
    slug,
    description: categoryDescription,
    imageUrl: `/images/category-${index % 6 + 1}.jpg`, // Cycle through 6 placeholder images
    videos: categoryProjects.map((project: any, projectIndex: number) =>
      mapProjectToVideoItem(project, index, null, projectIndex)
    ),
    subcategories,
  };
};

// Get all projects for a specific category ID
const getProjectsForCategory = (categoryId: string, projects: any[]): any[] => {
  if (!Array.isArray(projects)) {
    console.log('Projects array is not valid:', projects);
    return [];
  }

  return projects.filter(project => {
    if (typeof project.category === 'string') {
      return project.category === categoryId;
    } else if (Array.isArray(project.category)) {
      return project.category.includes(categoryId);
    }
    return false;
  });
};

// Map a project to our VideoItem format
const mapProjectToVideoItem = (
  project: any,
  categoryIndex: number,
  subcategoryIndex: number | null,
  projectIndex: number
): VideoItem => {
  const idPrefix = subcategoryIndex !== null
    ? `${categoryIndex}-${subcategoryIndex}-item-`
    : `${categoryIndex}-item-`;

  return {
    id: `${idPrefix}${projectIndex}`,
    title: project.title || `Resource ${projectIndex}`,
    url: project.homepage || '',
    description: project.description || '',
    tags: project.tags || [],
  };
};

// Helper function to examine and debug the URL content
export const examineUrlContent = async (url: string): Promise<any> => {
  try {
    console.log(`Examining content from URL: ${url}`);
    
    // First try with standard CORS-enabled fetch
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const text = await response.text();
      console.log(`Received ${text.length} bytes of data`);
      
      try {
        const json = JSON.parse(text);
        console.log('Content structure keys:', Object.keys(json).join(', '));
        return json;
      } catch (e) {
        console.error('Not valid JSON:', e);
        throw e;
      }
    } catch (error) {
      console.log('Standard fetch failed, trying with no-cors mode:', error);
      
      // If standard fetch fails, try with no-cors mode
      // Note: This will result in an opaque response that cannot be read directly
      // but we can use it to signal that the resource exists
      const noCorsResponse = await fetch(url, {
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('No-cors fetch completed with status:', noCorsResponse.type);
      
      // For opaque responses from no-cors mode, we need to fall back to a proxy or local data
      // Since we can't read the response, return a signal that we should use fallback
      throw new Error('CORS issue detected, using fallback data');
    }
  } catch (error) {
    console.error('Error examining URL:', error);
    throw error;
  }
};


import { ExtendedCategory, VideoItem } from '@/types/video';

// Function to convert awesome-video data to our ExtendedCategory format
export const transformAwesomeVideoData = (contents: any): ExtendedCategory[] => {
  console.log('Starting data transformation');

  if (!contents) {
    console.error('Contents is null or undefined');
    return [];
  }

  // Print exactly what the contents structure looks like for debugging
  console.log('Raw contents structure:', JSON.stringify(contents, null, 2).substring(0, 1000) + '...');

  // Handle the recategorized structure from awesome-video repository
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
  const slug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  console.log(`Processing category ${index}: ${categoryName}`);

  // Find all subcategories for this category
  const subcategories = contents.categories
    .filter((subcat: any) => subcat.parent === categoryId)
    .map((subcat: any, subIndex: number) => {
      const subcatName = subcat.title || '';
      const subcatDescription = subcat.description || `Resources related to ${subcatName}`;
      const subcatSlug = subcatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
    title: project.title || project.name || `Resource ${projectIndex}`,
    url: project.homepage || project.url || '',
    description: project.description || '',
    tags: project.tags || [],
  };
};

// Helper function to fetch content using CORS proxy if needed
export const fetchContentWithCorsHandling = async (url: string): Promise<any> => {
  console.log(`Fetching content from URL: ${url}`);
  
  // Get the content URL from environment variables if available
  const contentUrl = import.meta.env.VITE_CONTENT_URL || url;
  console.log(`Using content URL: ${contentUrl}`);
  
  try {
    // First attempt: Direct fetch with CORS mode
    console.log('Attempting direct fetch with CORS mode');
    const response = await fetch(contentUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log(`Received ${text.length} bytes of data`);
    
    try {
      const json = JSON.parse(text);
      console.log('Content successfully parsed as JSON');
      return json;
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    
    // First fallback: Try with CORS proxy - allorigins
    try {
      console.log('Attempting to use CORS proxy (allorigins)');
      const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(contentUrl)}`;
      
      const proxyResponse = await fetch(corsProxyUrl);
      if (!proxyResponse.ok) {
        throw new Error(`Proxy HTTP error! Status: ${proxyResponse.status}`);
      }
      
      const proxyText = await proxyResponse.text();
      console.log(`Received ${proxyText.length} bytes of data via proxy`);
      
      const proxyJson = JSON.parse(proxyText);
      console.log('Content successfully parsed as JSON via proxy');
      return proxyJson;
    } catch (proxyError) {
      console.error('First CORS proxy attempt failed:', proxyError);
      
      // Second fallback: Try with a different CORS proxy - corsproxy.io
      try {
        console.log('Attempting with alternate CORS proxy (corsproxy.io)');
        const corsProxyAlt = `https://corsproxy.io/?${encodeURIComponent(contentUrl)}`;
        
        const altProxyResponse = await fetch(corsProxyAlt);
        if (!altProxyResponse.ok) {
          throw new Error(`Alt proxy HTTP error! Status: ${altProxyResponse.status}`);
        }
        
        const altProxyText = await altProxyResponse.text();
        const altProxyJson = JSON.parse(altProxyText);
        console.log('Content successfully parsed via alternate proxy');
        return altProxyJson;
      } catch (altProxyError) {
        console.error('All proxies failed:', altProxyError);
        throw new Error('Unable to fetch content: CORS or network issues detected');
      }
    }
  }
};

// Helper function for debugging - examine a URL's content structure
export const examineUrlContent = async (url: string): Promise<any> => {
  try {
    console.log(`Examining content from URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log(`Received ${text.length} bytes of data`);
    
    try {
      const json = JSON.parse(text);
      console.log('Content structure keys:', Object.keys(json).join(', '));
      return json;
    } catch (e) {
      console.error('Not valid JSON:', e);
      throw new Error('Invalid JSON data received');
    }
  } catch (error) {
    console.error('Error examining URL:', error);
    throw error;
  }
};

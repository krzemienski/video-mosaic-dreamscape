
import { ExtendedCategory, VideoItem } from '@/types/video';

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

// Helper function to fetch content using CORS proxy if needed
export const fetchContentWithCorsHandling = async (url: string): Promise<any> => {
  console.log(`Fetching content from URL: ${url}`);
  
  // Updated S3 URL for recategorized content
  const S3_RECATEGORIZED_URL = 'https://hack-ski.s3.us-east-1.amazonaws.com/av/recategorized_projects_anthropic_claude_3_5_haiku_20241022_1743170712_1181.json';
  const S3_FALLBACK_URL = 'https://hack-ski.s3.us-east-1.amazonaws.com/av/contents.json';
  
  try {
    // First attempt: Use no-cors mode with proper CORS headers
    const response = await fetch(url, {
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
    
    // Directly use recategorized URL
    try {
      console.log(`Attempting to use recategorized content URL: ${S3_RECATEGORIZED_URL}`);
      const recategorizedResponse = await fetch(S3_RECATEGORIZED_URL);
      
      if (!recategorizedResponse.ok) {
        throw new Error(`Recategorized HTTP error! Status: ${recategorizedResponse.status}`);
      }
      
      const recategorizedText = await recategorizedResponse.text();
      console.log(`Received ${recategorizedText.length} bytes of data from recategorized source`);
      
      try {
        const recategorizedJson = JSON.parse(recategorizedText);
        console.log('Recategorized content successfully parsed as JSON');
        return recategorizedJson;
      } catch (e) {
        console.error('Failed to parse recategorized response as JSON:', e);
        throw new Error('Invalid JSON response from recategorized source');
      }
    } catch (recategorizedError) {
      console.error('Recategorized content attempt failed:', recategorizedError);
    
      // Second attempt: Try with S3 fallback URL
      try {
        console.log(`Attempting to use S3 fallback URL: ${S3_FALLBACK_URL}`);
        const fallbackResponse = await fetch(S3_FALLBACK_URL);
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback HTTP error! Status: ${fallbackResponse.status}`);
        }
        
        const fallbackText = await fallbackResponse.text();
        console.log(`Received ${fallbackText.length} bytes of data from S3 fallback`);
        
        try {
          const fallbackJson = JSON.parse(fallbackText);
          console.log('S3 fallback content successfully parsed as JSON');
          return fallbackJson;
        } catch (e) {
          console.error('Failed to parse S3 fallback response as JSON:', e);
          throw new Error('Invalid JSON response from S3 fallback');
        }
      } catch (fallbackError) {
        console.error('S3 fallback attempt failed:', fallbackError);
      
        // Third attempt: Try with CORS proxy
        try {
          console.log('Attempting to use CORS proxy');
          const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(S3_RECATEGORIZED_URL)}`;
          
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
          console.error('CORS proxy attempt also failed:', proxyError);
          
          // Fourth attempt: Try with a different CORS proxy
          try {
            console.log('Attempting with alternate CORS proxy');
            const corsProxyAlt = `https://corsproxy.io/?${encodeURIComponent(S3_RECATEGORIZED_URL)}`;
            
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
            throw new Error('Unable to fetch content: CORS issues detected');
          }
        }
      }
    }
  }
};

// Helper function to examine and debug the URL content
export const examineUrlContent = async (url: string): Promise<any> => {
  try {
    console.log(`Examining content from URL: ${url}`);
    
    // Try with no-cors mode first to handle CORS issues
    const response = await fetch(url, {
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('No-cors fetch completed with status:', response.type);
    
    // For opaque responses from no-cors mode, we can't read the content
    // so we throw an error to signal CORS issue
    if (response.type === 'opaque') {
      throw new Error('CORS issue detected');
    }
    
    // If we get here, we received a valid response
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


import { ExtendedCategory, VideoResource } from '@/types/video';
import { transformAwesomeVideoData } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';
import { fallbackCategories } from './fallbackData';

// Use the direct URL to the contents.json
const CONTENTS_URL = 'https://raw.githubusercontent.com/krzemienski/awesome-video/refs/heads/master/contents.json';

export const fetchCategories = async (): Promise<ExtendedCategory[]> => {
  console.log('fetchCategories: Checking cache first');
  const { data: cachedData, isFresh } = getCachedData();
  
  // Return cached data if it's fresh
  if (cachedData && isFresh) {
    console.log('fetchCategories: Returning fresh cached data');
    console.log(`fetchCategories: Cache contains ${cachedData.length} categories`);
    return cachedData;
  }
  
  try {
    console.log(`fetchCategories: Fetching data from ${CONTENTS_URL}`);
    // Fetch content data from the provided URL
    const response = await fetch(CONTENTS_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error(`fetchCategories: HTTP error ${response.status}`);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log(`fetchCategories: Received ${rawData.length} bytes of data`);
    
    // Log a small preview of the raw data
    console.log('fetchCategories: Raw data preview:', rawData.substring(0, 500) + '...');
    
    try {
      const contents = JSON.parse(rawData);
      console.log('fetchCategories: Successfully parsed JSON data');
      console.log('fetchCategories: Contents structure:', Object.keys(contents).join(', '));
      
      // Check if the structure matches what we expect
      if (!contents.categories || !Array.isArray(contents.categories)) {
        console.error('fetchCategories: Invalid data structure - missing categories array');
        console.log('fetchCategories: Contents:', JSON.stringify(contents).substring(0, 500) + '...');
        throw new Error('Invalid data structure');
      }
      
      console.log(`fetchCategories: Found ${contents.categories.length} categories in the data`);
      
      // If there are items, log how many we found
      if (contents.items && Array.isArray(contents.items)) {
        console.log(`fetchCategories: Found ${contents.items.length} items in the data`);
      } else {
        console.warn('fetchCategories: No items array found in the data');
      }
      
      const transformedData = transformAwesomeVideoData(contents);
      
      if (transformedData.length === 0) {
        console.warn('fetchCategories: Transformation returned empty data. Falling back to demo data.');
        return fallbackCategories();
      }
      
      // Update cache
      console.log(`fetchCategories: Updating cache with ${transformedData.length} categories`);
      updateCache(transformedData);
      
      return transformedData;
    } catch (parseError) {
      console.error('fetchCategories: JSON parsing error:', parseError);
      throw parseError;
    }
  } catch (error) {
    console.error('Error fetching awesome-video data:', error);
    
    // Fall back to demo data if fetch fails
    console.log('fetchCategories: Falling back to demo data');
    return fallbackCategories();
  }
};

export const fetchCategory = async (categorySlug: string): Promise<ExtendedCategory | undefined> => {
  console.log(`fetchCategory: Looking for category with slug "${categorySlug}"`);
  const categories = await fetchCategories();
  const category = categories.find(category => category.slug === categorySlug);
  
  if (category) {
    console.log(`fetchCategory: Found category "${category.name}" with ${category.videos?.length || 0} videos`);
  } else {
    console.error(`fetchCategory: No category found with slug "${categorySlug}"`);
  }
  
  return category;
};

export const fetchVideos = async (categorySlug: string, subcategorySlug?: string): Promise<VideoResource[]> => {
  try {
    console.log(`fetchVideos: Fetching videos for category "${categorySlug}" and subcategory "${subcategorySlug || 'none'}"`);
    const category = await fetchCategory(categorySlug);
    if (!category) {
      console.error(`fetchVideos: Category not found for slug "${categorySlug}"`);
      return [];
    }
    
    const videos: VideoResource[] = [];
    
    // Add videos from the main category
    if (category.videos) {
      console.log(`fetchVideos: Adding ${category.videos.length} videos from main category`);
      const mainVideos = category.videos.map(video => ({
        ...video,
        category: category.name,
        subcategory: undefined,
        thumbnail: undefined, // Add default value for thumbnail
        duration: undefined,  // Add default value for duration
        date: undefined       // Add default value for date
      }));
      videos.push(...mainVideos);
    } else {
      console.log(`fetchVideos: No videos found in main category`);
    }
    
    // Add videos from subcategories if no specific subcategory is requested
    if (category.subcategories && (!subcategorySlug || subcategorySlug === '')) {
      console.log(`fetchVideos: Adding videos from all ${category.subcategories.length} subcategories`);
      category.subcategories.forEach(sub => {
        if (sub.videos) {
          console.log(`fetchVideos: Adding ${sub.videos.length} videos from subcategory "${sub.name}"`);
          const subVideos = sub.videos.map(video => ({
            ...video,
            category: category.name,
            subcategory: sub.name,
            thumbnail: undefined, // Add default value for thumbnail
            duration: undefined,  // Add default value for duration
            date: undefined       // Add default value for date
          }));
          videos.push(...subVideos);
        } else {
          console.log(`fetchVideos: No videos found in subcategory "${sub.name}"`);
        }
      });
    } 
    // Add only videos from the specified subcategory
    else if (category.subcategories && subcategorySlug) {
      const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
      if (subcategory?.videos) {
        console.log(`fetchVideos: Adding ${subcategory.videos.length} videos from specific subcategory "${subcategory.name}"`);
        const subVideos = subcategory.videos.map(video => ({
          ...video,
          category: category.name,
          subcategory: subcategory.name,
          thumbnail: undefined, // Add default value for thumbnail
          duration: undefined,  // Add default value for duration
          date: undefined       // Add default value for date
        }));
        videos.push(...subVideos);
      } else {
        console.log(`fetchVideos: No videos found in specific subcategory "${subcategorySlug}"`);
      }
    }
    
    console.log(`fetchVideos: Returning total of ${videos.length} videos`);
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const searchVideos = async (query: string): Promise<VideoResource[]> => {
  try {
    console.log(`searchVideos: Searching for "${query}"`);
    const categories = await fetchCategories();
    
    // Collect all videos from all categories and subcategories
    const allVideos: VideoResource[] = [];
    
    categories.forEach(category => {
      if (category.videos) {
        console.log(`searchVideos: Processing ${category.videos.length} videos from category "${category.name}"`);
        const videosWithCategory = category.videos.map(video => ({
          ...video,
          category: category.name,
          thumbnail: undefined,
          duration: undefined,
          date: undefined
        }));
        allVideos.push(...videosWithCategory);
      }
      
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.videos) {
            console.log(`searchVideos: Processing ${subcategory.videos.length} videos from subcategory "${subcategory.name}"`);
            const videosWithCategoryAndSubcategory = subcategory.videos.map(video => ({
              ...video,
              category: category.name,
              subcategory: subcategory.name,
              thumbnail: undefined,
              duration: undefined,
              date: undefined
            }));
            allVideos.push(...videosWithCategoryAndSubcategory);
          }
        });
      }
    });
    
    console.log(`searchVideos: Collected ${allVideos.length} total videos to search through`);
    
    // Filter videos based on query
    const results = allVideos.filter(video => {
      const searchableText = `${video.title} ${video.description} ${video.tags?.join(' ') || ''}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    
    console.log(`searchVideos: Found ${results.length} videos matching query "${query}"`);
    return results;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw new Error('Failed to search videos');
  }
};

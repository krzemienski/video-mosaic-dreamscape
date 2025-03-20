import { ExtendedCategory, VideoResource } from '@/types/video';
import { transformAwesomeVideoData, examineUrlContent } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';
import { fallbackCategories } from './fallbackData';

// Use the direct URL to the contents.json
const CONTENTS_URL = 'https://raw.githubusercontent.com/krzemienski/awesome-video/master/contents.json';
// Fallback URLs in case the primary one fails
const FALLBACK_URLS = [
  'https://raw.githubusercontent.com/krzemienski/awesome-video/main/contents.json',
  'https://raw.githubusercontent.com/krzemienski/awesome-video/HEAD/contents.json'
];

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
    
    // First try the primary URL
    try {
      const contents = await examineUrlContent(CONTENTS_URL);
      console.log('fetchCategories: Successfully retrieved and parsed data from primary URL');
      
      const transformedData = transformAwesomeVideoData(contents);
      
      if (transformedData.length > 0) {
        console.log(`fetchCategories: Transformation successful, got ${transformedData.length} categories`);
        updateCache(transformedData);
        return transformedData;
      }
      
      console.warn('fetchCategories: Primary URL returned empty data after transformation');
    } catch (primaryError) {
      console.error('fetchCategories: Error with primary URL:', primaryError);
    }
    
    // Try fallback URLs if primary fails
    for (const fallbackUrl of FALLBACK_URLS) {
      try {
        console.log(`fetchCategories: Trying fallback URL: ${fallbackUrl}`);
        const contents = await examineUrlContent(fallbackUrl);
        console.log(`fetchCategories: Successfully retrieved and parsed data from fallback URL: ${fallbackUrl}`);
        
        const transformedData = transformAwesomeVideoData(contents);
        
        if (transformedData.length > 0) {
          console.log(`fetchCategories: Fallback transformation successful, got ${transformedData.length} categories`);
          updateCache(transformedData);
          return transformedData;
        }
        
        console.warn(`fetchCategories: Fallback URL ${fallbackUrl} returned empty data after transformation`);
      } catch (fallbackError) {
        console.error(`fetchCategories: Error with fallback URL ${fallbackUrl}:`, fallbackError);
      }
    }
    
    // If all URLs fail, use the fallback data
    console.warn('fetchCategories: All URLs failed. Falling back to demo data');
    return fallbackCategories();
    
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

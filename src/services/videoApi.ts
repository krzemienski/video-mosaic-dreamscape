
import { ExtendedCategory, VideoResource, AwesomeVideoContents } from '@/types/video';
import { transformAwesomeVideoData } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';
import { fallbackCategories } from './fallbackData';

// Use the direct URL to the contents.json
const CONTENTS_URL = 'https://raw.githubusercontent.com/krzemienski/awesome-video/refs/heads/master/contents.json';

export const fetchCategories = async (): Promise<ExtendedCategory[]> => {
  const { data: cachedData, isFresh } = getCachedData();
  
  // Return cached data if it's fresh
  if (cachedData && isFresh) {
    return cachedData;
  }
  
  try {
    // Fetch content data from the provided URL
    const response = await fetch(CONTENTS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const contents: AwesomeVideoContents = await response.json();
    const transformedData = transformAwesomeVideoData(contents);
    
    // Update cache
    updateCache(transformedData);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching awesome-video data:', error);
    
    // Fall back to demo data if fetch fails
    return fallbackCategories();
  }
};

export const fetchCategory = async (categorySlug: string): Promise<ExtendedCategory | undefined> => {
  const categories = await fetchCategories();
  return categories.find(category => category.slug === categorySlug);
};

export const fetchVideos = async (categorySlug: string, subcategorySlug?: string): Promise<VideoResource[]> => {
  try {
    const category = await fetchCategory(categorySlug);
    if (!category) return [];
    
    const videos: VideoResource[] = [];
    
    // Add videos from the main category
    if (category.videos) {
      const mainVideos = category.videos.map(video => ({
        ...video,
        category: category.name,
        subcategory: undefined,
        thumbnail: undefined, // Add default value for thumbnail
        duration: undefined,  // Add default value for duration
        date: undefined       // Add default value for date
      }));
      videos.push(...mainVideos);
    }
    
    // Add videos from subcategories if no specific subcategory is requested
    if (category.subcategories && (!subcategorySlug || subcategorySlug === '')) {
      category.subcategories.forEach(sub => {
        if (sub.videos) {
          const subVideos = sub.videos.map(video => ({
            ...video,
            category: category.name,
            subcategory: sub.name,
            thumbnail: undefined, // Add default value for thumbnail
            duration: undefined,  // Add default value for duration
            date: undefined       // Add default value for date
          }));
          videos.push(...subVideos);
        }
      });
    } 
    // Add only videos from the specified subcategory
    else if (category.subcategories && subcategorySlug) {
      const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
      if (subcategory?.videos) {
        const subVideos = subcategory.videos.map(video => ({
          ...video,
          category: category.name,
          subcategory: subcategory.name,
          thumbnail: undefined, // Add default value for thumbnail
          duration: undefined,  // Add default value for duration
          date: undefined       // Add default value for date
        }));
        videos.push(...subVideos);
      }
    }
    
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const searchVideos = async (query: string): Promise<VideoResource[]> => {
  try {
    const categories = await fetchCategories();
    
    // Collect all videos from all categories and subcategories
    const allVideos: VideoResource[] = [];
    
    categories.forEach(category => {
      if (category.videos) {
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
    
    // Filter videos based on query
    return allVideos.filter(video => {
      const searchableText = `${video.title} ${video.description} ${video.tags?.join(' ') || ''}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    throw new Error('Failed to search videos');
  }
};

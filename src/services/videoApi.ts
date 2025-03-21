
import { ExtendedCategory, VideoResource } from '@/types/video';
import { transformAwesomeVideoData, examineUrlContent } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';
import { fallbackCategories } from './fallbackData';

// Primary URL to fetch the contents.json from CloudFront
const CONTENTS_URL = 'https://d2l6iuu30u6bxw.cloudfront.net/contents.json';
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
    console.log(`fetchCategories: Fetching data from remote URL: ${CONTENTS_URL}`);

    // First try the primary URL
    try {
      const contents = await examineUrlContent(CONTENTS_URL);
      console.log('fetchCategories: Successfully retrieved and parsed data from primary URL');

      const transformedData = transformAwesomeVideoData(contents);

      if (transformedData && transformedData.length > 0) {
        console.log(`fetchCategories: Transformation successful, got ${transformedData.length} categories`);
        updateCache(transformedData);
        return transformedData;
      }

      console.warn('fetchCategories: Primary URL returned empty data after transformation');
    } catch (primaryError) {
      // If error contains CORS message, just use fallback data immediately
      if (primaryError instanceof Error && 
          (primaryError.message.includes('CORS') || 
           primaryError.message.includes('Failed to fetch'))) {
        console.error('fetchCategories: CORS issue detected with primary URL, using fallback data');
        const fallbackData = fallbackCategories();
        updateCache(fallbackData);
        return fallbackData;
      }
      
      console.error('fetchCategories: Error with primary URL:', primaryError);
    }

    // Try fallback URLs if primary fails
    for (const fallbackUrl of FALLBACK_URLS) {
      try {
        console.log(`fetchCategories: Trying fallback URL: ${fallbackUrl}`);
        const contents = await examineUrlContent(fallbackUrl);
        console.log(`fetchCategories: Successfully retrieved and parsed data from fallback URL: ${fallbackUrl}`);

        const transformedData = transformAwesomeVideoData(contents);

        if (transformedData && transformedData.length > 0) {
          console.log(`fetchCategories: Fallback transformation successful, got ${transformedData.length} categories`);
          updateCache(transformedData);
          return transformedData;
        }

        console.warn(`fetchCategories: Fallback URL ${fallbackUrl} returned empty data after transformation`);
      } catch (fallbackError) {
        console.error(`fetchCategories: Error with fallback URL ${fallbackUrl}:`, fallbackError);
      }
    }

    // If all remote URLs fail, try loading from local file as last resort
    try {
      console.log('fetchCategories: All remote URLs failed, trying local file as backup');
      const response = await fetch('/contents.json');

      if (!response.ok) {
        throw new Error(`Failed to load local contents file: ${response.status}`);
      }

      const contents = await response.json();
      console.log('fetchCategories: Successfully loaded and parsed local contents file');

      const transformedData = transformAwesomeVideoData(contents);

      if (transformedData && transformedData.length > 0) {
        console.log(`fetchCategories: Local file transformation successful, got ${transformedData.length} categories`);
        updateCache(transformedData);
        return transformedData;
      }
    } catch (localError) {
      console.error('fetchCategories: Error loading local backup file:', localError);
    }

    // If everything fails, use the fallback data
    console.warn('fetchCategories: All data sources failed. Falling back to demo data');
    return fallbackCategories();

  } catch (error) {
    console.error('Error fetching data:', error);

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

export const refreshRemoteData = async (): Promise<ExtendedCategory[]> => {
  console.log('refreshRemoteData: Forcing refresh from remote source');

  try {
    // Try primary CloudFront URL first
    console.log(`refreshRemoteData: Fetching from primary URL: ${CONTENTS_URL}`);
    try {
      const contents = await examineUrlContent(CONTENTS_URL);
      console.log('refreshRemoteData: Successfully retrieved data from primary URL');

      const transformedData = transformAwesomeVideoData(contents);

      if (transformedData && transformedData.length > 0) {
        console.log(`refreshRemoteData: Transformation successful, got ${transformedData.length} categories`);
        updateCache(transformedData);
        return transformedData;
      }

      console.warn('refreshRemoteData: Primary URL returned empty data after transformation');
    } catch (primaryError) {
      // If error contains CORS message, just use fallback data immediately
      if (primaryError instanceof Error && 
          (primaryError.message.includes('CORS') || 
           primaryError.message.includes('Failed to fetch'))) {
        console.error('refreshRemoteData: CORS issue detected with primary URL, using fallback data');
        const fallbackData = fallbackCategories();
        updateCache(fallbackData);
        return fallbackData;
      }
      
      console.error('refreshRemoteData: Error with primary URL:', primaryError);
    }

    // Try fallback URLs if primary fails
    for (const fallbackUrl of FALLBACK_URLS) {
      try {
        console.log(`refreshRemoteData: Trying fallback URL: ${fallbackUrl}`);
        const contents = await examineUrlContent(fallbackUrl);
        console.log(`refreshRemoteData: Successfully retrieved data from fallback URL: ${fallbackUrl}`);

        const transformedData = transformAwesomeVideoData(contents);

        if (transformedData && transformedData.length > 0) {
          console.log(`refreshRemoteData: Fallback transformation successful, got ${transformedData.length} categories`);
          updateCache(transformedData);
          return transformedData;
        }

        console.warn(`refreshRemoteData: Fallback URL ${fallbackUrl} returned empty data after transformation`);
      } catch (fallbackError) {
        console.error(`refreshRemoteData: Error with fallback URL ${fallbackUrl}:`, fallbackError);
      }
    }

    // If all remote URLs fail, return the current cache without updating
    const { data: cachedData } = getCachedData();
    if (cachedData && cachedData.length > 0) {
      console.log('refreshRemoteData: Remote refresh failed, returning existing cache');
      return cachedData;
    }

    // If no cache exists, try local file
    try {
      console.log('refreshRemoteData: No cache available, trying local file');
      const response = await fetch('/contents.json');

      if (!response.ok) {
        throw new Error(`Failed to load local contents file: ${response.status}`);
      }

      const contents = await response.json();
      const transformedData = transformAwesomeVideoData(contents);

      if (transformedData && transformedData.length > 0) {
        console.log(`refreshRemoteData: Local file transformation successful, got ${transformedData.length} categories`);
        updateCache(transformedData);
        return transformedData;
      }
    } catch (localError) {
      console.error('refreshRemoteData: Error loading local backup file:', localError);
    }

    // If everything fails, use fallback data
    console.warn('refreshRemoteData: All data sources failed. Using fallback data');
    return fallbackCategories();
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw new Error('Failed to refresh data from remote source');
  }
};

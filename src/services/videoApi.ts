
import { ExtendedCategory, VideoResource } from '@/types/video';
import { transformAwesomeVideoData, fetchContentWithCorsHandling } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';

// Primary URL to fetch the contents.json from CloudFront
const CONTENTS_URL = 'https://d2l6iuu30u6bxw.cloudfront.net/contents.json';
// Fallback URL in case the primary fails
const FALLBACK_URL = 'https://hack-ski.s3.us-east-1.amazonaws.com/av/contents.json';

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
    console.log(`fetchCategories: Fetching data from URL: ${CONTENTS_URL}`);
    const contents = await fetchContentWithCorsHandling(CONTENTS_URL);
    console.log('fetchCategories: Successfully retrieved and parsed data');

    const transformedData = transformAwesomeVideoData(contents);

    if (transformedData && transformedData.length > 0) {
      console.log(`fetchCategories: Transformation successful, got ${transformedData.length} categories`);
      updateCache(transformedData);
      return transformedData;
    } else {
      console.error('fetchCategories: Transformation returned empty data');
      throw new Error('Data transformation returned empty result');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
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
    console.log(`refreshRemoteData: Trying primary URL first: ${CONTENTS_URL}`);
    let contents;
    
    try {
      contents = await fetchContentWithCorsHandling(CONTENTS_URL);
      console.log('refreshRemoteData: Successfully retrieved data from primary URL');
    } catch (primaryError) {
      console.error('refreshRemoteData: Primary URL failed, trying fallback:', primaryError);
      console.log(`refreshRemoteData: Fetching from fallback URL: ${FALLBACK_URL}`);
      contents = await fetchContentWithCorsHandling(FALLBACK_URL);
      console.log('refreshRemoteData: Successfully retrieved data from fallback URL');
    }

    const transformedData = transformAwesomeVideoData(contents);

    if (transformedData && transformedData.length > 0) {
      console.log(`refreshRemoteData: Transformation successful, got ${transformedData.length} categories`);
      updateCache(transformedData);
      return transformedData;
    } else {
      console.error('refreshRemoteData: Transformation returned empty data');
      throw new Error('Data transformation returned empty result');
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
};

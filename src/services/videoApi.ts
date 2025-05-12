import { ExtendedCategory, VideoResource, VideoItem, Subcategory } from '@/types/video';
import { transformAwesomeVideoData, fetchContentWithCorsHandling } from './dataTransformer';
import { getCachedData, updateCache } from './cacheService';

// Get content URL from environment variables
const CONTENTS_URL = import.meta.env.VITE_CONTENT_URL || 'https://hack-ski.s3.us-east-1.amazonaws.com/av/recategorized_with_researchers_2010_projects.json';

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

// Define interfaces for the nested functions
interface SubcategoryWithParent {
  subcategory: Subcategory;
  parentCategory: string;
}

export const fetchVideos = async (categorySlug: string, subcategoryPath?: string): Promise<VideoResource[]> => {
  try {
    console.log(`fetchVideos: Fetching videos for category "${categorySlug}" and subcategory path "${subcategoryPath || 'none'}"`);
    const category = await fetchCategory(categorySlug);
    if (!category) {
      console.error(`fetchVideos: Category not found for slug "${categorySlug}"`);
      return [];
    }

    const videos: VideoResource[] = [];

    // If no subcategory is specified, return videos from the main category
    if (!subcategoryPath) {
      // Add videos from the main category
      if (category.videos) {
        console.log(`fetchVideos: Adding ${category.videos.length} videos from main category`);
        const mainVideos = category.videos.map(video => ({
          ...video,
          category: category.name,
          subcategory: undefined,
          thumbnail: undefined,
          duration: undefined,
          date: undefined,
          tags: video.tags || []
        }));
        videos.push(...mainVideos);
      }

      // Add videos from all subcategories recursively
      if (category.subcategories) {
        const addVideosFromSubcategories = (subcategories: Subcategory[], parentCategory: string) => {
          subcategories.forEach(subcategory => {
            if (subcategory.videos) {
              console.log(`fetchVideos: Adding ${subcategory.videos.length} videos from subcategory "${subcategory.name}"`);
              const subVideos = subcategory.videos.map((video: VideoItem) => ({
                ...video,
                category: parentCategory,
                subcategory: subcategory.name,
                thumbnail: undefined,
                duration: undefined,
                date: undefined,
                tags: video.tags || []
              }));
              videos.push(...subVideos);
            }

            // Recursively add videos from nested subcategories
            if (subcategory.subcategories && subcategory.subcategories.length > 0) {
              addVideosFromSubcategories(subcategory.subcategories, parentCategory);
            }
          });
        };

        console.log(`fetchVideos: Adding videos from all ${category.subcategories.length} subcategories`);
        addVideosFromSubcategories(category.subcategories, category.name);
      }
    }
    // Handle specific subcategory path
    else {
      // Split the path into segments
      const pathSegments = subcategoryPath.split('/');

      // Find the specific subcategory based on the path
      const findSubcategoryByPath = (
        subcategories: Subcategory[],
        segments: string[],
        currentIndex: number = 0,
        parentCategory: string
      ): SubcategoryWithParent | null => {
        if (!subcategories || currentIndex >= segments.length) {
          console.log(`findSubcategoryByPath: Invalid parameters - subcategories ${!!subcategories}, currentIndex ${currentIndex}, segments length ${segments.length}`);
          return null;
        }

        const currentSegment = segments[currentIndex];
        console.log(`findSubcategoryByPath: Looking for segment "${currentSegment}" at index ${currentIndex} in ${subcategories.length} subcategories`);

        // Debug log the available subcategories
        if (subcategories.length > 0) {
          console.log(`findSubcategoryByPath: Available subcategories: ${subcategories.map(sub => sub.slug).join(', ')}`);
        }

        const foundSubcategory = subcategories.find(sub => sub.slug === currentSegment);

        if (!foundSubcategory) {
          console.log(`findSubcategoryByPath: No subcategory found with slug "${currentSegment}" at index ${currentIndex}`);
          return null;
        }

        console.log(`findSubcategoryByPath: Found subcategory "${foundSubcategory.name}" (${foundSubcategory.slug}) at index ${currentIndex}`);

        // If we've reached the final segment, return this subcategory
        if (currentIndex === segments.length - 1) {
          console.log(`findSubcategoryByPath: Reached final segment, returning subcategory "${foundSubcategory.name}"`);
          return {
            subcategory: foundSubcategory,
            parentCategory
          };
        }

        // Otherwise, continue searching in nested subcategories
        if (foundSubcategory.subcategories && foundSubcategory.subcategories.length > 0) {
          console.log(`findSubcategoryByPath: Found ${foundSubcategory.subcategories.length} nested subcategories, continuing search`);
          return findSubcategoryByPath(
            foundSubcategory.subcategories,
            segments,
            currentIndex + 1,
            parentCategory
          );
        }

        console.log(`findSubcategoryByPath: No nested subcategories found for "${foundSubcategory.name}" but more path segments remain`);
        return null;
      };

      const result = findSubcategoryByPath(category.subcategories || [], pathSegments, 0, category.name);

      if (result && result.subcategory) {
        const { subcategory, parentCategory } = result;
        console.log(`fetchVideos: Found subcategory "${subcategory.name}" for path "${subcategoryPath}"`);

        if (subcategory.videos) {
          console.log(`fetchVideos: Adding ${subcategory.videos.length} videos from specific subcategory`);
          const subVideos = subcategory.videos.map((video: VideoItem) => ({
            ...video,
            category: parentCategory,
            subcategory: subcategory.name,
            thumbnail: undefined,
            duration: undefined,
            date: undefined,
            tags: video.tags || []
          }));
          videos.push(...subVideos);
        } else {
          console.log(`fetchVideos: No videos found in specific subcategory "${subcategoryPath}"`);
        }
      } else {
        console.log(`fetchVideos: No subcategory found for path "${subcategoryPath}"`);
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
          date: undefined,
          tags: video.tags || [] // Ensure tags are included
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
              date: undefined,
              tags: video.tags || [] // Ensure tags are included
            }));
            allVideos.push(...videosWithCategoryAndSubcategory);
          }
        });
      }
    });

    console.log(`searchVideos: Collected ${allVideos.length} total videos to search through`);

    // Normalize the query by removing special characters
    const normalizedQuery = query.toLowerCase().replace(/[-_\s]/g, '');

    // Check if the query looks like a tag search (starts with # or tag:)
    const isTagSearch = query.startsWith('#') || query.toLowerCase().startsWith('tag:');
    let searchTerm = query;

    if (isTagSearch) {
      // Extract tag name without the prefix
      searchTerm = query.startsWith('#') ? query.substring(1) : query.substring(4);
      console.log(`searchVideos: Searching specifically for tag "${searchTerm}"`);

      // Filter videos specifically by tag with fuzzy matching
      const results = allVideos.filter(video =>
        video.tags &&
        video.tags.some(tag => {
          const normalizedTag = tag.toLowerCase().replace(/[-_\s]/g, '');
          return normalizedTag.includes(searchTerm.toLowerCase().replace(/[-_\s]/g, ''));
        })
      );

      console.log(`searchVideos: Found ${results.length} videos with tag matching "${searchTerm}"`);
      return results;
    } else {
      // Regular search across all fields with fuzzy matching
      const results = allVideos.filter(video => {
        // Include all relevant fields in the search
        const searchableFields = [
          video.title || '',
          video.description || '',
          video.category || '',
          video.subcategory || ''
        ];

        // Add normalized tags for fuzzy matching
        if (video.tags && video.tags.length > 0) {
          const normalizedTags = video.tags.map(tag => tag.toLowerCase().replace(/[-_\s]/g, ''));
          searchableFields.push(normalizedTags.join(' '));
        }

        // Create a normalized searchable text
        const normalizedSearchableText = searchableFields.join(' ').toLowerCase().replace(/[-_\s]/g, '');

        return normalizedSearchableText.includes(normalizedQuery);
      });

      console.log(`searchVideos: Found ${results.length} videos matching query "${searchTerm}" (normalized: "${normalizedQuery}")`);
      return results;
    }
  } catch (error) {
    console.error('Error searching videos:', error);
    throw new Error('Failed to search videos');
  }
};

export const refreshRemoteData = async (): Promise<ExtendedCategory[]> => {
  console.log('refreshRemoteData: Forcing refresh from remote source');

  try {
    console.log(`refreshRemoteData: Fetching from URL: ${CONTENTS_URL}`);
    const contents = await fetchContentWithCorsHandling(CONTENTS_URL);
    console.log('refreshRemoteData: Successfully retrieved data');

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

// Extract all unique tags from all videos
export const getAllTags = async (): Promise<{tag: string, count: number}[]> => {
  try {
    console.log('getAllTags: Collecting all tags from videos');
    const categories = await fetchCategories();

    // Map to count tag occurrences
    const tagCount = new Map<string, number>();

    // Process all videos in all categories and subcategories
    categories.forEach(category => {
      // Process main category videos
      if (category.videos) {
        category.videos.forEach(video => {
          if (video.tags && Array.isArray(video.tags)) {
            video.tags.forEach(tag => {
              const trimmedTag = tag.trim();
              if (trimmedTag) {
                tagCount.set(trimmedTag, (tagCount.get(trimmedTag) || 0) + 1);
              }
            });
          }
        });
      }

      // Process subcategory videos
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.videos) {
            subcategory.videos.forEach(video => {
              if (video.tags && Array.isArray(video.tags)) {
                video.tags.forEach(tag => {
                  const trimmedTag = tag.trim();
                  if (trimmedTag) {
                    tagCount.set(trimmedTag, (tagCount.get(trimmedTag) || 0) + 1);
                  }
                });
              }
            });
          }
        });
      }
    });

    // Convert map to array and sort by count (descending)
    const sortedTags = Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    console.log(`getAllTags: Found ${sortedTags.length} unique tags`);
    return sortedTags;
  } catch (error) {
    console.error('Error collecting tags:', error);
    throw new Error('Failed to collect tags');
  }
};

// Get all videos that have a specific tag
export const getVideosByTag = async (tag: string): Promise<VideoResource[]> => {
  try {
    console.log(`getVideosByTag: Finding videos with tag "${tag}"`);
    const categories = await fetchCategories();

    // Collect all videos from all categories and subcategories
    const allVideos: VideoResource[] = [];

    categories.forEach(category => {
      // Process main category videos
      if (category.videos) {
        category.videos.forEach(video => {
          if (video.tags && Array.isArray(video.tags) &&
              video.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
            allVideos.push({
              ...video,
              category: category.name,
              subcategory: undefined,
              thumbnail: undefined,
              duration: undefined,
              date: undefined,
              tags: video.tags
            });
          }
        });
      }

      // Process subcategory videos
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.videos) {
            subcategory.videos.forEach(video => {
              if (video.tags && Array.isArray(video.tags) &&
                  video.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
                allVideos.push({
                  ...video,
                  category: category.name,
                  subcategory: subcategory.name,
                  thumbnail: undefined,
                  duration: undefined,
                  date: undefined,
                  tags: video.tags
                });
              }
            });
          }
        });
      }
    });

    console.log(`getVideosByTag: Found ${allVideos.length} videos with tag "${tag}"`);
    return allVideos;
  } catch (error) {
    console.error(`Error getting videos by tag "${tag}":`, error);
    throw new Error('Failed to get videos by tag');
  }
};

// Define an interface for the category stats
interface CategoryStats {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  directVideoCount: number;
  totalVideoCount: number;
  subcategoryCount: number;
  subcategories: {
    name: string;
    slug: string;
    videoCount: number;
    description: string;
  }[];
  tags: string[];
  tagCount: number;
}

// Get detailed stats for all categories
export const getCategoriesWithStats = async (): Promise<CategoryStats[]> => {
  try {
    console.log('getCategoriesWithStats: Collecting category statistics');
    const categories = await fetchCategories();

    const statsArray = categories.map(category => {
      // Calculate direct video count (not in subcategories)
      const directVideoCount = category.videos?.length || 0;

      // Calculate subcategory stats
      const subcategoryStats = category.subcategories?.map(subcategory => ({
        name: subcategory.name,
        slug: subcategory.slug,
        videoCount: subcategory.videos?.length || 0,
        description: subcategory.description || '',
      })) || [];

      // Calculate total video count (including subcategories)
      const totalVideoCount = directVideoCount +
        subcategoryStats.reduce((sum, sub) => sum + sub.videoCount, 0);

      // Extract all unique tags from this category
      const tagSet = new Set<string>();

      // Add tags from main category videos
      if (category.videos) {
        category.videos.forEach(video => {
          if (video.tags && Array.isArray(video.tags)) {
            video.tags.forEach(tag => {
              if (tag.trim()) tagSet.add(tag.trim());
            });
          }
        });
      }

      // Add tags from subcategory videos
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.videos) {
            subcategory.videos.forEach(video => {
              if (video.tags && Array.isArray(video.tags)) {
                video.tags.forEach(tag => {
                  if (tag.trim()) tagSet.add(tag.trim());
                });
              }
            });
          }
        });
      }

      // Convert tag set to array
      const tags = Array.from(tagSet);

      return {
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageUrl: category.imageUrl,
        directVideoCount,
        totalVideoCount,
        subcategoryCount: category.subcategories?.length || 0,
        subcategories: subcategoryStats,
        tags,
        tagCount: tags.length
      };
    });

    console.log(`getCategoriesWithStats: Collected stats for ${statsArray.length} categories`);
    return statsArray;
  } catch (error) {
    console.error('Error collecting category stats:', error);
    throw new Error('Failed to collect category statistics');
  }
};

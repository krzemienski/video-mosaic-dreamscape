import { Category } from '@/components/ui/CategoryCard';

// Extend the Category interface to include missing properties
export interface ExtendedCategory extends Category {
  imageUrl: string;
  videos?: {
    id: string;
    title: string;
    url: string;
    description: string;
    tags?: string[];
  }[];
  subcategories?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    videos?: {
      id: string;
      title: string;
      url: string;
      description: string;
      tags?: string[];
    }[];
  }[];
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  date?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
}

// Define interfaces for the awesome-video data
interface AwesomeVideoItem {
  name: string;
  description: string;
  url: string;
  category?: string;
  subcategory?: string;
}

interface AwesomeVideoCategory {
  name: string;
  description?: string;
  subcategories?: AwesomeVideoCategory[];
  items?: AwesomeVideoItem[];
}

interface AwesomeVideoContents {
  categories: AwesomeVideoCategory[];
}

let awesomeVideoCache: ExtendedCategory[] | null = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let lastFetchTime = 0;

// Use the direct URL to the contents.json
const CONTENTS_URL = 'https://raw.githubusercontent.com/krzemienski/awesome-video/refs/heads/master/contents.json';

// Function to convert awesome-video data to our ExtendedCategory format
const transformAwesomeVideoData = (contents: AwesomeVideoContents): ExtendedCategory[] => {
  return contents.categories.map((category, catIndex) => {
    const videos = category.items?.map((item, itemIndex) => ({
      id: `${catIndex}-item-${itemIndex}`,
      title: item.name,
      url: item.url,
      description: item.description || '',
      tags: item.category ? [item.category] : [],
    })) || [];

    const subcategories = category.subcategories?.map((subcat, subIndex) => {
      const subVideos = subcat.items?.map((item, itemIndex) => ({
        id: `${catIndex}-${subIndex}-item-${itemIndex}`,
        title: item.name,
        url: item.url,
        description: item.description || '',
        tags: item.category ? [item.category] : [],
      })) || [];

      return {
        id: `${catIndex}-sub-${subIndex}`,
        name: subcat.name,
        slug: subcat.name.toLowerCase().replace(/\s+/g, '-'),
        description: subcat.description,
        videos: subVideos,
      };
    }) || [];

    return {
      id: `cat-${catIndex}`,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      description: category.description || `Resources related to ${category.name}`,
      imageUrl: `/images/category-${catIndex}.jpg`, // Default placeholder
      videos,
      subcategories,
    };
  });
};

export const fetchCategories = async (): Promise<ExtendedCategory[]> => {
  const currentTime = Date.now();
  
  // Return cached data if it's fresh
  if (awesomeVideoCache && (currentTime - lastFetchTime < CACHE_DURATION)) {
    return awesomeVideoCache;
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
    awesomeVideoCache = transformedData;
    lastFetchTime = currentTime;
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching awesome-video data:', error);
    
    // Fall back to demo data if fetch fails
    return fallbackCategories();
  }
};

// Fallback function to return demo data when API fails
const fallbackCategories = (): ExtendedCategory[] => {
  return [
    {
      id: '1',
      name: 'Web Development',
      slug: 'web-development',
      description: 'Learn about web development technologies.',
      imageUrl: '/images/category-web-dev.jpg',
      videos: [
        {
          id: '101',
          title: 'React Tutorial',
          url: 'https://example.com/react-tutorial',
          description: 'A comprehensive React tutorial for beginners.',
          tags: ['react', 'javascript', 'frontend'],
        },
        {
          id: '102',
          title: 'Node.js Crash Course',
          url: 'https://example.com/node-crash-course',
          description: 'Get started with Node.js in this crash course.',
          tags: ['node.js', 'javascript', 'backend'],
        },
      ],
      subcategories: [
        {
          id: '11',
          name: 'Frontend Frameworks',
          slug: 'frontend-frameworks',
          description: 'Explore different frontend frameworks.',
          videos: [
            {
              id: '111',
              title: 'Angular Basics',
              url: 'https://example.com/angular-basics',
              description: 'Learn the basics of Angular framework.',
              tags: ['angular', 'typescript', 'frontend'],
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Discover mobile app development techniques.',
      imageUrl: '/images/category-mobile-dev.jpg',
      videos: [
        {
          id: '201',
          title: 'React Native Guide',
          url: 'https://example.com/react-native-guide',
          description: 'Build native apps with React Native.',
          tags: ['react native', 'javascript', 'mobile'],
        },
      ],
    },
    {
      id: '3',
      name: 'Data Science',
      slug: 'data-science',
      description: 'Explore data analysis and machine learning.',
      imageUrl: '/images/category-data-science.jpg',
      videos: [],
    },
    {
      id: '4',
      name: 'Game Development',
      slug: 'game-development',
      description: 'Create your own games with these tutorials.',
      imageUrl: '/images/category-game-dev.jpg',
      videos: [],
    },
    {
      id: '5',
      name: 'Cloud Computing',
      slug: 'cloud-computing',
      description: 'Learn about cloud platforms and services.',
      imageUrl: '/images/category-cloud.jpg',
      videos: [],
    },
    {
      id: '6',
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Protect systems and networks from cyber threats.',
      imageUrl: '/images/category-cybersecurity.jpg',
      videos: [],
    },
  ];
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

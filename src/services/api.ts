
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
  tags?: string[];
  subcategory?: string;
}

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchCategories = async (): Promise<ExtendedCategory[]> => {
  // In a real application, this would call an API endpoint
  // For now, we'll simulate by returning some dummy data
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyCategories: ExtendedCategory[] = [
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
      resolve(dummyCategories);
    }, 500);
  });
};

export const fetchCategory = async (categorySlug: string): Promise<ExtendedCategory | undefined> => {
  // In a real application, this would call an API endpoint
  // For now, we'll simulate by filtering from the dummy data
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
        subcategory: undefined
      }));
      videos.push(...mainVideos);
    }
    
    // Add videos from subcategories if no specific subcategory is requested
    if (category.subcategories && (!subcategorySlug || subcategorySlug === '')) {
      category.subcategories.forEach(sub => {
        if (sub.videos) {
          const subVideos = sub.videos.map(video => ({
            ...video,
            subcategory: sub.name
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
          subcategory: subcategory.name
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

export const searchVideos = async (query: string) => {
  // In a real application, this would call an API endpoint
  // For now, we'll simulate by fetching all data and filtering locally
  try {
    const categories = await fetchCategories();
    
    // Collect all videos from all categories and subcategories
    const allVideos: VideoResource[] = [];
    
    categories.forEach(category => {
      if (category.videos) {
        allVideos.push(...category.videos);
      }
      
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.videos) {
            allVideos.push(...subcategory.videos);
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

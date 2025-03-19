
import { VideoResource } from '@/components/ui/VideoCard';
import { Category } from '@/components/ui/CategoryCard';

// In a real app, these would be actual API endpoints
const SCHEMA_URL = 'https://api.example.com/schema.json';
const CONTENT_URL = 'https://api.example.com/content.json';

// For the demo, we'll use mock data
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Programming',
    slug: 'programming',
    description: 'Programming tutorials and courses',
    count: 15,
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000'
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX and graphic design resources',
    count: 8,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000'
  },
  {
    id: '3',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Digital marketing strategies and tips',
    count: 10,
    thumbnail: 'https://images.unsplash.com/photo-1533750516855-5d9cb7b03f9f?q=80&w=1000'
  },
  {
    id: '4',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Big data, machine learning, and analytics',
    count: 12,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'
  },
  {
    id: '5',
    name: 'Business',
    slug: 'business',
    description: 'Entrepreneurship and business strategy',
    count: 6,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000'
  },
  {
    id: '6',
    name: 'Photography',
    slug: 'photography',
    description: 'Photography techniques and tutorials',
    count: 9,
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000'
  }
];

export const mockVideos: VideoResource[] = [
  {
    id: '1',
    title: 'React Fundamentals: Building User Interfaces',
    description: 'Learn the core concepts of React and how to build dynamic user interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000',
    url: 'https://example.com/video1',
    duration: '45:20',
    date: '2023-10-15',
    category: 'programming',
    subcategory: 'react'
  },
  {
    id: '2',
    title: 'Advanced CSS Techniques',
    description: 'Master modern CSS features for creating stunning web designs',
    thumbnail: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?q=80&w=1000',
    url: 'https://example.com/video2',
    duration: '38:15',
    date: '2023-09-22',
    category: 'programming',
    subcategory: 'css'
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'Essential principles for creating user-friendly and beautiful interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1000',
    url: 'https://example.com/video3',
    duration: '52:40',
    date: '2023-11-05',
    category: 'design',
    subcategory: 'ui-ux'
  },
  {
    id: '4',
    title: 'Social Media Marketing Strategies',
    description: 'Effective strategies for growing your brand on social media platforms',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000',
    url: 'https://example.com/video4',
    duration: '40:10',
    date: '2023-08-18',
    category: 'marketing',
    subcategory: 'social-media'
  },
  {
    id: '5',
    title: 'Data Visualization with D3.js',
    description: 'Create interactive and dynamic data visualizations using D3.js',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
    url: 'https://example.com/video5',
    duration: '58:30',
    date: '2023-07-29',
    category: 'data-science',
    subcategory: 'visualization'
  },
  {
    id: '6',
    title: 'Python for Data Analysis',
    description: 'Learn how to use Python and pandas for data manipulation and analysis',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000',
    url: 'https://example.com/video6',
    duration: '1:05:45',
    date: '2023-10-02',
    category: 'programming',
    subcategory: 'python'
  },
  {
    id: '7',
    title: 'Building a Startup from Scratch',
    description: 'Step-by-step guide to launching your own tech startup',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1000',
    url: 'https://example.com/video7',
    duration: '48:20',
    date: '2023-11-12',
    category: 'business',
    subcategory: 'startup'
  },
  {
    id: '8',
    title: 'Portrait Photography Masterclass',
    description: 'Advanced techniques for capturing stunning portrait photographs',
    thumbnail: 'https://images.unsplash.com/photo-1585071320161-1637e549dcba?q=80&w=1000',
    url: 'https://example.com/video8',
    duration: '1:22:15',
    date: '2023-06-14',
    category: 'photography',
    subcategory: 'portrait'
  },
  {
    id: '9',
    title: 'JavaScript ES6+ Features Explained',
    description: 'Comprehensive guide to modern JavaScript features and best practices',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000',
    url: 'https://example.com/video9',
    duration: '35:50',
    date: '2023-09-08',
    category: 'programming',
    subcategory: 'javascript'
  },
  {
    id: '10',
    title: 'Introduction to Machine Learning',
    description: 'Fundamentals of machine learning algorithms and applications',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000',
    url: 'https://example.com/video10',
    duration: '1:12:30',
    date: '2023-08-25',
    category: 'data-science',
    subcategory: 'machine-learning'
  },
  {
    id: '11',
    title: 'Digital Marketing Analytics',
    description: 'How to measure and optimize your marketing campaigns',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1000',
    url: 'https://example.com/video11',
    duration: '42:15',
    date: '2023-07-17',
    category: 'marketing',
    subcategory: 'analytics'
  },
  {
    id: '12',
    title: 'Logo Design: Principles and Process',
    description: 'Creating memorable and effective logos for brands',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000',
    url: 'https://example.com/video12',
    duration: '55:40',
    date: '2023-10-30',
    category: 'design',
    subcategory: 'graphic-design'
  }
];

// Simulate API fetching with a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    // In a real app, this would fetch from SCHEMA_URL
    await delay(800); // Simulate network delay
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchVideos = async (
  categorySlug?: string,
  subcategorySlug?: string
): Promise<VideoResource[]> => {
  try {
    // In a real app, this would fetch from CONTENT_URL
    await delay(1000); // Simulate network delay
    
    let filteredVideos = [...mockVideos];
    
    if (categorySlug) {
      filteredVideos = filteredVideos.filter(v => v.category === categorySlug);
      
      if (subcategorySlug) {
        filteredVideos = filteredVideos.filter(v => v.subcategory === subcategorySlug);
      }
    }
    
    return filteredVideos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category | undefined> => {
  try {
    await delay(600); // Simulate network delay
    return mockCategories.find(c => c.slug === slug);
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};


import { ExtendedCategory } from '@/types/video';

// Fallback function to return demo data when API fails
export const fallbackCategories = (): ExtendedCategory[] => {
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


import { AwesomeVideoContents, ExtendedCategory } from '@/types/video';

// Function to convert awesome-video data to our ExtendedCategory format
export const transformAwesomeVideoData = (contents: AwesomeVideoContents): ExtendedCategory[] => {
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

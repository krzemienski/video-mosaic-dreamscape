
import { AwesomeVideoContents, ExtendedCategory } from '@/types/video';

// Function to convert awesome-video data to our ExtendedCategory format
export const transformAwesomeVideoData = (contents: any): ExtendedCategory[] => {
  console.log('Starting data transformation');
  console.log('Raw contents:', JSON.stringify(contents).substring(0, 500) + '...');
  
  if (!contents || !contents.categories) {
    console.error('Invalid contents structure:', contents);
    return [];
  }
  
  // Log categories from contents
  console.log(`Found ${contents.categories.length} categories in contents`);
  
  // Extract categories from the contents
  const categories = contents.categories.map((category: any, catIndex: number) => {
    console.log(`Processing category ${catIndex}: ${category.title || category.name || 'Unnamed category'}`);
    console.log('Category data:', JSON.stringify(category).substring(0, 200) + '...');
    
    // For proper naming and availability
    const categoryName = category.title || category.name || `Category ${catIndex}`;
    const categoryDescription = category.description || `Resources related to ${categoryName}`;
    
    // Find items belonging to this category
    const categoryItems = Array.isArray(contents.items) ? 
      contents.items.filter((item: any) => {
        const belongsToCategory = item.category === category.id || 
               item.category === categoryName ||
               item.categories?.includes(category.name) ||
               item.categories?.includes(category.id) || 
               !item.category; // Items without a category are assigned to the first category
        
        if (belongsToCategory) {
          console.log(`Found item for category "${categoryName}":`, item.name || item.title);
        }
        
        return belongsToCategory;
      }) : [];
    
    console.log(`Category "${categoryName}" has ${categoryItems.length} direct items`);
    
    // Map items to our VideoItem format
    const videos = categoryItems.map((item: any, itemIndex: number) => {
      console.log(`Processing item ${itemIndex} in category "${categoryName}": ${item.name || item.title}`);
      return {
        id: `${catIndex}-item-${itemIndex}`,
        title: item.name || item.title || `Resource ${itemIndex}`,
        url: item.url || '',
        description: item.description || '',
        tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : []),
      };
    });
    
    // Handle subcategories if present
    let subcategories: any[] = [];
    
    // Check if subcategories can be derived from other categories with this as parent
    if (contents.categories) {
      const childCategories = contents.categories.filter((childCat: any) => 
        childCat.parent === category.id
      );
      
      console.log(`Found ${childCategories.length} child categories for "${categoryName}"`);
      
      subcategories = childCategories.map((subcat: any, subIndex: number) => {
        const subcatName = subcat.title || subcat.name || `Subcategory ${subIndex}`;
        const subcatDescription = subcat.description || `Resources related to ${subcatName}`;
        
        // Find items for this subcategory
        const subcatItems = Array.isArray(contents.items) ? 
          contents.items.filter((item: any) => {
            const belongsToSubcat = item.category === subcat.id || 
                  item.category === subcatName ||
                  item.categories?.includes(subcatName) ||
                  item.categories?.includes(subcat.id);
            
            if (belongsToSubcat) {
              console.log(`Found item for subcategory "${subcatName}":`, item.name || item.title);
            }
            
            return belongsToSubcat;
          }) : [];
        
        console.log(`Subcategory "${subcatName}" has ${subcatItems.length} items`);
        
        // Map subcategory items to our VideoItem format
        const subVideos = subcatItems.map((item: any, itemIndex: number) => ({
          id: `${catIndex}-${subIndex}-item-${itemIndex}`,
          title: item.name || item.title || `Resource ${itemIndex}`,
          url: item.url || '',
          description: item.description || '',
          tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : []),
        }));
        
        return {
          id: `${catIndex}-sub-${subIndex}`,
          name: subcatName,
          slug: subcatName.toLowerCase().replace(/\s+/g, '-'),
          description: subcatDescription,
          videos: subVideos,
        };
      });
    }
    
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    console.log(`Completed processing category "${categoryName}" with slug "${slug}" and ${videos.length} videos`);
    
    return {
      id: category.id || `cat-${catIndex}`,
      name: categoryName,
      slug,
      description: categoryDescription,
      imageUrl: `/images/category-${catIndex % 6 + 1}.jpg`, // Cycle through 6 placeholder images
      videos,
      subcategories,
    };
  });
  
  console.log(`Transformation completed. Generated ${categories.length} categories.`);
  return categories;
};

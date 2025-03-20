
import { AwesomeVideoContents, ExtendedCategory } from '@/types/video';

// Function to convert awesome-video data to our ExtendedCategory format
export const transformAwesomeVideoData = (contents: any): ExtendedCategory[] => {
  console.log('Starting data transformation');
  
  // Print exactly what the contents structure looks like
  console.log('Raw contents structure:', JSON.stringify(contents, null, 2).substring(0, 1000) + '...');
  
  if (!contents) {
    console.error('Contents is null or undefined');
    return [];
  }
  
  if (!contents.categories && !Array.isArray(contents.categories)) {
    console.error('Invalid or missing categories array in contents:', contents);
    
    // Try to extract categories from a different structure that might exist
    let extractedCategories = [];
    
    // Check if contents has a different structure than expected
    if (Array.isArray(contents)) {
      console.log('Contents is an array, trying to extract categories directly');
      extractedCategories = contents;
    } else if (typeof contents === 'object') {
      // Look for any array that might contain categories
      for (const key in contents) {
        if (Array.isArray(contents[key])) {
          console.log(`Found array in contents["${key}"], trying to use this as categories`);
          extractedCategories = contents[key];
          break;
        }
      }
    }
    
    if (extractedCategories.length > 0) {
      console.log(`Found ${extractedCategories.length} possible categories through extraction`);
      contents = { categories: extractedCategories };
    } else {
      return [];
    }
  }
  
  // Log categories from contents
  console.log(`Processing ${contents.categories.length} categories in contents`);
  
  // Extract categories from the contents
  const categories = contents.categories.map((category: any, catIndex: number) => {
    const categoryTitle = category.title || category.name || category.category;
    console.log(`Processing category ${catIndex}: ${categoryTitle || 'Unnamed category'}`);
    console.log('Category data:', JSON.stringify(category).substring(0, 200) + '...');
    
    // For proper naming and availability
    const categoryName = categoryTitle || `Category ${catIndex}`;
    const categoryDescription = category.description || `Resources related to ${categoryName}`;
    
    // Find items belonging to this category
    const categoryItems = Array.isArray(contents.items) ? 
      contents.items.filter((item: any) => {
        // Check all possible ways an item could be related to this category
        const itemCategory = item.category || '';
        const categoryId = category.id || '';
        
        const belongsToCategory = 
          itemCategory === categoryId || 
          itemCategory === categoryName ||
          itemCategory.toLowerCase() === categoryName.toLowerCase() ||
          (Array.isArray(item.categories) && (
            item.categories.includes(categoryName) ||
            item.categories.includes(categoryId)
          )) ||
          (!item.category && catIndex === 0); // Items without a category are assigned to the first category
        
        if (belongsToCategory) {
          console.log(`Found item for category "${categoryName}":`, item.name || item.title);
        }
        
        return belongsToCategory;
      }) : [];
    
    // If no category items were found in the standard way, look for items in the category itself
    let videos = [];
    
    if (categoryItems.length === 0 && Array.isArray(category.items)) {
      console.log(`No items found via standard method, but category has ${category.items.length} direct items`);
      videos = category.items.map((item: any, itemIndex: number) => ({
        id: `${catIndex}-item-${itemIndex}`,
        title: item.name || item.title || `Resource ${itemIndex}`,
        url: item.url || item.link || '',
        description: item.description || '',
        tags: Array.isArray(item.tags) ? item.tags : [categoryName],
      }));
    } else {
      console.log(`Category "${categoryName}" has ${categoryItems.length} direct items`);
      
      // Map items to our VideoItem format
      videos = categoryItems.map((item: any, itemIndex: number) => ({
        id: `${catIndex}-item-${itemIndex}`,
        title: item.name || item.title || `Resource ${itemIndex}`,
        url: item.url || item.link || '',
        description: item.description || '',
        tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : []),
      }));
    }
    
    // Handle subcategories if present
    let subcategories: any[] = [];
    
    // Check for explicitly defined subcategories in the category
    if (Array.isArray(category.subcategories)) {
      console.log(`Category "${categoryName}" has ${category.subcategories.length} explicit subcategories`);
      subcategories = category.subcategories.map((subcat: any, subIndex: number) => {
        const subcatName = subcat.title || subcat.name || `Subcategory ${subIndex}`;
        return {
          id: `${catIndex}-sub-${subIndex}`,
          name: subcatName,
          slug: subcatName.toLowerCase().replace(/\s+/g, '-'),
          description: subcat.description || `Resources related to ${subcatName}`,
          videos: (Array.isArray(subcat.items) ? subcat.items : []).map((item: any, itemIndex: number) => ({
            id: `${catIndex}-${subIndex}-item-${itemIndex}`,
            title: item.name || item.title || `Resource ${itemIndex}`,
            url: item.url || item.link || '',
            description: item.description || '',
            tags: Array.isArray(item.tags) ? item.tags : [subcatName],
          })),
        };
      });
    }
    // Check if subcategories can be derived from other categories with this as parent
    else if (contents.categories) {
      const childCategories = contents.categories.filter((childCat: any) => 
        childCat.parent === category.id || 
        childCat.parent === categoryName ||
        childCat.parentCategory === category.id ||
        childCat.parentCategory === categoryName
      );
      
      console.log(`Found ${childCategories.length} child categories for "${categoryName}"`);
      
      subcategories = childCategories.map((subcat: any, subIndex: number) => {
        const subcatName = subcat.title || subcat.name || `Subcategory ${subIndex}`;
        const subcatDescription = subcat.description || `Resources related to ${subcatName}`;
        
        // Find items for this subcategory
        const subcatItems = Array.isArray(contents.items) ? 
          contents.items.filter((item: any) => {
            const itemCategory = item.category || '';
            const subcatId = subcat.id || '';
            
            const belongsToSubcat = 
              itemCategory === subcatId || 
              itemCategory === subcatName ||
              itemCategory.toLowerCase() === subcatName.toLowerCase() ||
              (Array.isArray(item.categories) && (
                item.categories.includes(subcatName) ||
                item.categories.includes(subcatId)
              ));
            
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
          url: item.url || item.link || '',
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
  console.log('First category sample:', JSON.stringify(categories[0] || {}, null, 2).substring(0, 300) + '...');
  
  return categories;
};

// Helper function to examine and debug the URL content
export const examineUrlContent = async (url: string): Promise<any> => {
  try {
    console.log(`Examining content from URL: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const text = await response.text();
    console.log(`Received ${text.length} bytes of data`);
    console.log('Raw content preview:', text.substring(0, 500) + '...');
    
    try {
      const json = JSON.parse(text);
      console.log('Content structure keys:', Object.keys(json).join(', '));
      return json;
    } catch (e) {
      console.error('Not valid JSON:', e);
      return { text: text.substring(0, 1000) + '...' };
    }
  } catch (error) {
    console.error('Error examining URL:', error);
    throw error;
  }
};

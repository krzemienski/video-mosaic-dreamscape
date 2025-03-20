// Re-export from videoApi.ts
export {
  fetchCategories,
  fetchCategory,
  fetchVideos,
  searchVideos,
  refreshRemoteData
} from './videoApi';

// Re-export types from types/video.ts
export type {
  ExtendedCategory,
  VideoResource,
  VideoItem,
  Subcategory
} from '@/types/video';

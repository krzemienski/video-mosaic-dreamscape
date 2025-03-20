
import { Category } from '@/components/ui/CategoryCard';

// Extend the Category interface to include missing properties
export interface ExtendedCategory extends Category {
  imageUrl: string;
  videos?: VideoItem[];
  subcategories?: Subcategory[];
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags?: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  videos?: VideoItem[];
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
export interface AwesomeVideoItem {
  name: string;
  description: string;
  url: string;
  category?: string;
  subcategory?: string;
}

export interface AwesomeVideoCategory {
  name: string;
  description?: string;
  subcategories?: AwesomeVideoCategory[];
  items?: AwesomeVideoItem[];
}

export interface AwesomeVideoContents {
  categories: AwesomeVideoCategory[];
}

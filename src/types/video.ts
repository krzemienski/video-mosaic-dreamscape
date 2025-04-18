import { Category } from '@/components/ui/CategoryCard';

// Extend the Category interface to include missing properties
export interface ExtendedCategory extends Category {
  imageUrl: string;
  videos?: VideoItem[];
  subcategories?: Subcategory[];
  count?: number;
  videoCount?: number;
  subcategoryCount?: number;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;										
  description: string;
  tags?: string[];
  category?: string;
  categories?: string[];
  subcategory?: string;
  subcategories?: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  videos?: VideoItem[];
  count?: number;
  subcategories?: Subcategory[];
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

// Define interfaces that better match the GitHub awesome-video data structure
export interface AwesomeVideoItem {
  name?: string;
  title?: string;
  description?: string;
  url: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
}

export interface AwesomeVideoCategory {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  parent?: string;
  subcategories?: AwesomeVideoCategory[];
  items?: AwesomeVideoItem[];
}

export interface AwesomeVideoContents {
  title?: string;
  categories: AwesomeVideoCategory[];
  items?: AwesomeVideoItem[];
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, BookOpen, Code, FileText, Package, Archive, Radio, 
  Film, Library, Video, Monitor, Server, Cloud, Database, Tv, 
  Cpu, Layers, Settings, Clock, Network, PlaySquare, Compass, 
  Presentation, Cast, Codepen, Youtube, Twitch, Rss, Music, Zap,
  Headphones, PenTool, Aperture, Camera, Mail, MessageCircle 
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  count?: number;
}

interface CategoryCardProps {
  category: Category;
}

// Map category names to appropriate icons - expanded to support more categories from recategorized data
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  // Media/Video specific categories
  if (name.includes('codec') || name.includes('compression')) {
    return <Archive size={48} className="text-primary/70" />;
  } else if (name.includes('encoding') || name.includes('transcoding')) {
    return <Code size={48} className="text-primary/70" />;
  } else if (name.includes('stream') || name.includes('broadcast') || name.includes('rtmp')) {
    return <Radio size={48} className="text-primary/70" />;
  } else if (name.includes('player') || name.includes('playback')) {
    return <PlaySquare size={48} className="text-primary/70" />;
  } else if (name.includes('video')) {
    return <Video size={48} className="text-primary/70" />;
  } else if (name.includes('movie') || name.includes('film')) {
    return <Film size={48} className="text-primary/70" />;
  } else if (name.includes('tv') || name.includes('television')) {
    return <Tv size={48} className="text-primary/70" />;
  } else if (name.includes('presentation')) {
    return <Presentation size={48} className="text-primary/70" />;
  } else if (name.includes('cast') || name.includes('streaming service')) {
    return <Cast size={48} className="text-primary/70" />;
  } else if (name.includes('youtube')) {
    return <Youtube size={48} className="text-primary/70" />;
  } else if (name.includes('twitch')) {
    return <Twitch size={48} className="text-primary/70" />;
  } else if (name.includes('podcast') || name.includes('rss')) {
    return <Rss size={48} className="text-primary/70" />;
  } else if (name.includes('audio') || name.includes('sound')) {
    return <Music size={48} className="text-primary/70" />;
  } else if (name.includes('headphone') || name.includes('listening')) {
    return <Headphones size={48} className="text-primary/70" />;
  }
  
  // Documentation and resources 
  else if (name.includes('docs') || name.includes('resources') || name.includes('guide')) {
    return <BookOpen size={48} className="text-primary/70" />;
  } else if (name.includes('reference') || name.includes('specifications')) {
    return <FileText size={48} className="text-primary/70" />;
  }
  
  // Tools and software 
  else if (name.includes('tool') || name.includes('software') || name.includes('app')) {
    return <Package size={48} className="text-primary/70" />;
  } else if (name.includes('editor') || name.includes('editing')) {
    return <PenTool size={48} className="text-primary/70" />;
  } else if (name.includes('camera') || name.includes('capture')) {
    return <Camera size={48} className="text-primary/70" />;
  } else if (name.includes('api') || name.includes('sdk')) {
    return <Zap size={48} className="text-primary/70" />;
  }
  
  // Technology infrastructure
  else if (name.includes('web')) {
    return <Monitor size={48} className="text-primary/70" />;
  } else if (name.includes('server')) {
    return <Server size={48} className="text-primary/70" />;
  } else if (name.includes('cloud') || name.includes('saas')) {
    return <Cloud size={48} className="text-primary/70" />;
  } else if (name.includes('network') || name.includes('streaming platform')) {
    return <Network size={48} className="text-primary/70" />;
  } else if (name.includes('database') || name.includes('storage')) {
    return <Database size={48} className="text-primary/70" />;
  } else if (name.includes('embedded') || name.includes('hardware')) {
    return <Cpu size={48} className="text-primary/70" />;
  } 
  
  // Other categories
  else if (name.includes('layer') || name.includes('format') || name.includes('protocol')) {
    return <Layers size={48} className="text-primary/70" />;
  } else if (name.includes('configuration') || name.includes('setup')) {
    return <Settings size={48} className="text-primary/70" />;
  } else if (name.includes('latency') || name.includes('performance')) {
    return <Clock size={48} className="text-primary/70" />;
  } else if (name.includes('community') || name.includes('social')) {
    return <MessageCircle size={48} className="text-primary/70" />;
  } else if (name.includes('analytics') || name.includes('measurement')) {
    return <Compass size={48} className="text-primary/70" />;
  } else if (name.includes('codecs') || name.includes('processing')) {
    return <Codepen size={48} className="text-primary/70" />;
  } else if (name.includes('photography') || name.includes('image')) {
    return <Aperture size={48} className="text-primary/70" />;
  } else if (name.includes('newsletter') || name.includes('email')) {
    return <Mail size={48} className="text-primary/70" />;
  } else {
    return <Library size={48} className="text-primary/70" />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in group"
    >
      <div className="relative">
        <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden flex items-center justify-center">
          {category.thumbnail ? (
            <img 
              src={category.thumbnail} 
              alt={category.name} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getCategoryIcon(category.name)}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{category.name}</h3>
          {category.count !== undefined && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
              {category.count} resources
            </span>
          )}
        </div>
        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
        )}
        <div className="flex items-center justify-end text-sm font-medium text-primary group-hover:underline transition-all">
          View resources <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

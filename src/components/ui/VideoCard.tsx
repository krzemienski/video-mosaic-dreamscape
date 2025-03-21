import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Github, BookOpen, Code, FileText } from 'lucide-react';
import { VideoResource } from '@/services/api';

interface VideoCardProps {
  video: VideoResource;
  view: 'grid' | 'list' | 'masonry';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, view }) => {
  // Determine icon based on URL pattern
  const getResourceIcon = () => {
    const url = video.url.toLowerCase();
    if (url.includes('github.com')) {
      return <Github size={14} />;
    } else if (url.includes('docs') || url.includes('documentation')) {
      return <BookOpen size={14} />;
    } else if (url.includes('tutorial') || url.includes('guide')) {
      return <FileText size={14} />;
    } else if (url.includes('api') || url.includes('sdk')) {
      return <Code size={14} />;
    } else {
      return <ExternalLink size={14} />;
    }
  };
  
  // Track when user clicks on a resource
  const trackResourceClick = () => {
    window.gtag?.('event', 'resource_click', {
      event_category: 'engagement',
      event_label: video.title,
      resource_url: video.url,
      resource_category: video.category,
      resource_subcategory: video.subcategory || 'none'
    });
  };

  if (view === 'list') {
    return (
      <div className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in">
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/3 relative">
            <div className="aspect-video md:h-full w-full bg-muted/30 overflow-hidden">
              {video.thumbnail ? (
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <span className="text-muted-foreground">No thumbnail</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 md:p-6 flex flex-col flex-1">
            <h3 className="text-lg font-medium mb-2 text-balance">{video.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-auto">
              {video.date && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{video.date}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
                {video.subcategory || video.category}
              </div>
              <a 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-all"
                onClick={trackResourceClick}
              >
                Explore {getResourceIcon()}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Masonry View (most compact, make this the default)
  if (view === 'masonry' || view === 'grid') {
    return (
      <div className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in">
        <div className="p-3 flex flex-col h-full">
          <h3 className="text-sm font-medium mb-1 line-clamp-2 text-balance">{video.title}</h3>
          {video.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between">
            <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/70 text-accent-foreground">
              {video.subcategory || video.category}
            </div>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
              onClick={trackResourceClick}
            >
              Explore {getResourceIcon()}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid View - This will now be more compact too, but we keep it for compatibility
  return (
    <div className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col animate-scale-in">
      <div className="p-3 flex flex-col h-full">
        <h3 className="text-sm font-medium mb-1 line-clamp-2 text-balance">{video.title}</h3>
        {video.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/70 text-accent-foreground">
            {video.subcategory || video.category}
          </div>
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
            onClick={trackResourceClick}
          >
            Explore {getResourceIcon()}
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

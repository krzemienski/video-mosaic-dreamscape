
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
  duration?: string;
  date?: string;
  category: string;
  subcategory?: string;
}

interface VideoCardProps {
  video: VideoResource;
  view: 'grid' | 'list' | 'masonry';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, view }) => {
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
              {video.duration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{video.duration}</span>
                </div>
              )}
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
              >
                Watch <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col animate-scale-in">
        <div className="relative">
          <div className="aspect-video w-full bg-muted/30 overflow-hidden">
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
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-md font-medium mb-2 line-clamp-2 text-balance">{video.title}</h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-auto">
            {video.duration && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{video.duration}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
              {video.subcategory || video.category}
            </div>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
            >
              Watch <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Masonry View
  return (
    <div className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col animate-scale-in">
      <div className="relative">
        <div className="aspect-video w-full bg-muted/30 overflow-hidden">
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
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-md font-medium mb-2 text-balance">{video.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{video.description}</p>
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all self-end"
        >
          Watch <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default VideoCard;

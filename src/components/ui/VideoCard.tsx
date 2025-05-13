import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Github, BookOpen, Code, FileText } from 'lucide-react';
import { VideoResource } from '@/services/api';
import useAnalytics from '@/hooks/useAnalytics';

interface VideoCardProps {
  video: VideoResource;
  view: 'grid' | 'list' | 'masonry';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, view }) => {
  const { trackResourceClick, trackTagClick } = useAnalytics();

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

  // Track when user clicks on a resource with enhanced analytics
  const handleResourceClick = () => {
    trackResourceClick(
      video.title,
      video.url,
      video.category,
      video.subcategory,
      video.tags,
      view // Add the view type to know which layout users prefer
    );
  };

  // Track when user clicks on a tag
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    trackTagClick(tag, `video_card_${video.id}`);
  };

  // Render tags if they exist
  const renderTags = () => {
    if (!video.tags || video.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {video.tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="text-xs bg-secondary/70 text-secondary-foreground px-2 py-0.5 rounded cursor-pointer hover:bg-secondary"
            onClick={(e) => handleTagClick(tag, e)}
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  // Render different card layouts based on view type
  if (view === 'list') {
    return (
      <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={handleResourceClick} className="glass-card block p-4 hover:shadow-md transition-shadow duration-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getResourceIcon()}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium mb-1">{video.title}</h3>
            {video.description && (
              <p className="text-muted-foreground text-sm mb-2">{video.description}</p>
            )}
            <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-3 gap-y-1">
              {video.category && (
                <span className="whitespace-nowrap">
                  {video.category}{video.subcategory ? ` › ${video.subcategory}` : ''}
                </span>
              )}
            </div>
            {renderTags()}
          </div>
        </div>
      </a>
    );
  } else if (view === 'masonry') {
    return (
      <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={handleResourceClick} className="glass-card block p-4 mb-6 hover:shadow-md transition-shadow duration-200 rounded-lg break-inside-avoid">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium mb-2">{video.title}</h3>
          {video.description && (
            <p className="text-muted-foreground text-sm mb-3">{video.description}</p>
          )}
          <div className="flex items-center text-xs text-muted-foreground gap-2 mt-auto">
            {getResourceIcon()}
            {video.category && (
              <span>
                {video.category}{video.subcategory ? ` › ${video.subcategory}` : ''}
              </span>
            )}
          </div>
          {renderTags()}
        </div>
      </a>
    );
  }

  // Default grid view
  return (
    <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={handleResourceClick} className="glass-card block h-full p-4 hover:shadow-md transition-shadow duration-200 rounded-lg">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-medium mb-2">{video.title}</h3>
        {video.description && (
          <p className="text-muted-foreground text-sm mb-3">{video.description}</p>
        )}
        <div className="flex items-center text-xs text-muted-foreground gap-2 mt-auto">
          {getResourceIcon()}
          {video.category && (
            <span>
              {video.category}{video.subcategory ? ` › ${video.subcategory}` : ''}
            </span>
          )}
        </div>
        {renderTags()}
      </div>
    </a>
  );
};

export default VideoCard;

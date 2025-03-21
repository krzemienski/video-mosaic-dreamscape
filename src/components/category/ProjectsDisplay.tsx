
import React from 'react';
import VideoCard from '@/components/ui/VideoCard';
import { VideoResource } from '@/types/video';
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsDisplayProps {
  projects: VideoResource[];
  isLoading: boolean;
  view: 'grid' | 'list' | 'masonry';
  onRetry: () => void;
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projects, isLoading, view, onRetry }) => {
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-muted/40 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-full mb-1"></div>
          <div className="h-4 bg-muted/30 rounded w-2/3"></div>
          <div className="flex justify-between mt-4">
            <div className="h-5 bg-muted/40 rounded w-16"></div>
            <div className="h-5 bg-muted/40 rounded w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        view === 'list' 
          ? 'grid-cols-1' 
          : view === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {renderSkeletons()}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/10 rounded-lg border border-border/40 animate-fade-in">
        <p className="text-muted-foreground">No projects found in this category.</p>
        <button 
          onClick={onRetry} 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      view === 'list' 
        ? 'grid-cols-1' 
        : view === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {projects.map((project) => (
        <VideoCard key={project.id} video={project} view={view} />
      ))}
    </div>
  );
};

export default ProjectsDisplay;

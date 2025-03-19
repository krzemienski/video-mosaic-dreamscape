
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ErrorState from '@/components/ui/ErrorState';
import { searchVideos } from '@/services/api';
import VideoCard from '@/components/ui/VideoCard';
import useViewState from '@/hooks/useViewState';
import ViewToggle from '@/components/ui/ViewToggle';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [view, setView] = useViewState();
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await searchVideos(query);
        setResults(data);
      } catch (err) {
        setError("Failed to search videos. Please try again.");
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-video w-full bg-muted/30"></div>
        <div className="p-4">
          <div className="h-6 bg-muted/40 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/30 rounded w-full mb-1"></div>
          <div className="h-4 bg-muted/30 rounded w-2/3"></div>
        </div>
      </div>
    ));
  };

  const renderResults = () => {
    if (results.length === 0 && !isLoading) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try different keywords or browse categories
          </p>
        </div>
      );
    }

    return (
      <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
        view === 'list' ? 'grid-cols-1' : 
        'columns-1 md:columns-2 lg:columns-3 space-y-6'}`}>
        {results.map((video) => (
          <VideoCard key={video.id} video={video} view={view} />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold mb-2">Search Results: "{query}"</h1>
          <p className="text-muted-foreground">
            {!isLoading && `Found ${results.length} results`}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <ViewToggle view={view} onChange={setView} />
        </div>

        {error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : (
          <div className="min-h-[50vh]">
            {isLoading ? renderSkeletons() : renderResults()}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;

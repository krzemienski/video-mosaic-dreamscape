import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ErrorState from '@/components/ui/ErrorState';
import { searchVideos } from '@/services/api';
import VideoCard from '@/components/ui/VideoCard';
import useViewState from '@/hooks/useViewState';
import ViewToggle from '@/components/ui/ViewToggle';
import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useAnalytics from '@/hooks/useAnalytics';

const SearchPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [view, setView] = useViewState();
  const { trackSearch, trackEvent, trackUIInteraction } = useAnalytics();

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastQuery = useRef<string>('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchStartTimeRef = useRef<number>(0);
  const normalizedQueryRef = useRef<string>('');

  useEffect(() => {
    // Clear any pending search when unmounting
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Skip search if query is too short or the same as last search
    if (!query || query.trim().length <= 1 || query === lastQuery.current) {
      return;
    }

    // Add a slight delay to prevent rapid state updates
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      lastQuery.current = query;
      searchStartTimeRef.current = Date.now();
      normalizedQueryRef.current = query.toLowerCase().replace(/[^a-z0-9]/g, '');

      const fetchResults = async () => {
        try {
          setIsLoading(true);
          setError(null);
          console.log(`Executing search for query: "${query}"`);

          const data = await searchVideos(query);
          setResults(data);

          // Calculate search duration in milliseconds
          const searchDuration = Date.now() - searchStartTimeRef.current;

          // Track search query, results count, and performance with analytics
          trackSearch(
            query,
            data.length,
            'search_page'
          );

          // Track extended search analytics
          trackEvent(
            'search_completed',
            'search',
            query,
            data.length,
            {
              normalized_term: normalizedQueryRef.current,
              term_length: query.length,
              search_duration_ms: searchDuration,
              has_results: data.length > 0,
              results_count: data.length
            }
          );

          // Track zero results specifically
          if (data.length === 0) {
            trackEvent(
              'search_zero_results',
              'search',
              query,
              0,
              {
                normalized_term: normalizedQueryRef.current
              }
            );
          }

          console.log(`Search completed: found ${data.length} results for "${query}" in ${searchDuration}ms`);
        } catch (err) {
          setError("Failed to search resources. Please try again.");
          console.error('Search error:', err);

          // Track search error
          trackEvent(
            'search_error',
            'error',
            query,
            undefined,
            {
              error_message: err instanceof Error ? err.message : 'Unknown error'
            }
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchResults();
    }, 50); // Maintain quick response time for the search page

  }, [query, trackSearch, trackEvent]);

  // Handler for view toggle to track UI interaction
  const handleViewChange = (newView: 'grid' | 'list' | 'masonry') => {
    setView(newView);
    trackUIInteraction('view_toggle', newView, 'search_results');
  };

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="glass-card rounded-lg overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
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
        {results.map((resource) => (
          <VideoCard key={resource.id} video={resource} view={view} />
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
            {isLoading ? (
              <span className="flex items-center">
                <Loader size={14} className="animate-spin mr-2" />
                Searching resources...
              </span>
            ) : `Found ${results.length} resources`}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <ViewToggle view={view} onChange={handleViewChange} />
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

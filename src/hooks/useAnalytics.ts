// Custom hook for Google Analytics tracking
export const useAnalytics = () => {
  // Page view tracking
  const trackPageView = (title: string, path: string) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked page view - ${title}`);
    }
  };

  // Event tracking with improved properties
  const trackEvent = (
    eventName: string,
    category: string,
    label?: string,
    value?: number,
    additionalParams?: Record<string, any>
  ) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID,
        timestamp: new Date().toISOString(),
        ...additionalParams
      });
      console.log(`Analytics: Tracked event - ${eventName} in category ${category}`);
    }
  };

  // Resource click tracking with more detailed information
  const trackResourceClick = (
    title: string,
    url: string,
    category?: string,
    subcategory?: string,
    tags?: string[],
    viewMode?: 'grid' | 'list' | 'masonry'
  ) => {
    if (window.gtag) {
      const urlDomain = new URL(url).hostname;

      window.gtag('event', 'resource_click', {
        event_category: 'engagement',
        event_label: title,
        resource_url: url,
        resource_domain: urlDomain,
        resource_category: category || 'unknown',
        resource_subcategory: subcategory || 'none',
        resource_tags: tags || [],
        view_mode: viewMode || 'unknown',
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked resource click - ${title} (${category}/${subcategory}) in ${viewMode} view`);
    }
  };

  // Search tracking with improved data
  const trackSearch = (query: string, resultsCount: number, searchMethod?: string) => {
    if (window.gtag) {
      // Create normalized versions of the search term for analytics
      const normalizedTerm = query.toLowerCase().replace(/[^a-z0-9]/g, '');
      const termWithoutSpecialChars = query.toLowerCase().replace(/[-_\s]/g, '');

      window.gtag('event', 'search', {
        search_term: query,
        normalized_search_term: normalizedTerm,
        basic_normalized_term: termWithoutSpecialChars,
        results_count: resultsCount,
        has_results: resultsCount > 0,
        search_method: searchMethod || 'direct',
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked search - "${query}" with ${resultsCount} results`);
    }
  };

  // Category view tracking with more details
  const trackCategoryView = (categoryName: string, resourceCount: number) => {
    if (window.gtag) {
      window.gtag('event', 'category_view', {
        event_category: 'navigation',
        event_label: categoryName,
        value: resourceCount,
        has_resources: resourceCount > 0,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked category view - ${categoryName} with ${resourceCount} resources`);
    }
  };

  // Track filter usage
  const trackFilterUsage = (filterType: string, filterValue: string) => {
    if (window.gtag) {
      window.gtag('event', 'filter_usage', {
        event_category: 'interaction',
        event_label: filterType,
        filter_type: filterType,
        filter_value: filterValue,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked filter usage - ${filterType}: ${filterValue}`);
    }
  };

  // Track user sessions
  const trackSessionStart = () => {
    if (window.gtag) {
      window.gtag('event', 'session_start', {
        event_category: 'session',
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log('Analytics: Tracked session start');
    }
  };

  // Track scroll depth
  const trackScrollDepth = (percentage: number, path: string) => {
    if (window.gtag) {
      window.gtag('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: path,
        value: percentage,
        page_path: path,
        page_title: document.title,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked scroll depth - ${percentage}% on ${path}`);
    }
  };

  // Track tag click
  const trackTagClick = (tag: string, origin: string) => {
    if (window.gtag) {
      window.gtag('event', 'tag_click', {
        event_category: 'interaction',
        event_label: tag,
        tag_name: tag,
        origin: origin,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked tag click - ${tag} from ${origin}`);
    }
  };

  // Track download
  const trackDownload = (resourceName: string, resourceType: string, resourcePath: string) => {
    if (window.gtag) {
      window.gtag('event', 'download', {
        event_category: 'engagement',
        event_label: resourceName,
        resource_name: resourceName,
        resource_type: resourceType,
        resource_path: resourcePath,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked download - ${resourceName} (${resourceType})`);
    }
  };

  // Track time spent on page
  const trackTimeSpent = (seconds: number, path: string) => {
    if (window.gtag) {
      window.gtag('event', 'time_spent', {
        event_category: 'engagement',
        event_label: path,
        value: seconds,
        page_path: path,
        page_title: document.title,
        seconds: seconds,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked time spent - ${seconds}s on ${path}`);
    }
  };

  // Track UI interactions (buttons, navigation, etc.)
  const trackUIInteraction = (
    elementType: string,
    elementLabel: string,
    context: string
  ) => {
    if (window.gtag) {
      window.gtag('event', 'ui_interaction', {
        event_category: 'interaction',
        event_label: elementLabel,
        element_type: elementType,
        element_label: elementLabel,
        interaction_context: context,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked UI interaction - ${elementType}: ${elementLabel} in ${context}`);
    }
  };

  return {
    trackPageView,
    trackEvent,
    trackResourceClick,
    trackSearch,
    trackCategoryView,
    trackFilterUsage,
    trackSessionStart,
    trackScrollDepth,
    trackTagClick,
    trackDownload,
    trackTimeSpent,
    trackUIInteraction
  };
};

export default useAnalytics;


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
    subcategory?: string
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
        timestamp: new Date().toISOString(),
        send_to: import.meta.env.VITE_GA_MEASUREMENT_ID
      });
      console.log(`Analytics: Tracked resource click - ${title} (${category}/${subcategory})`);
    }
  };

  // Search tracking with improved data
  const trackSearch = (query: string, resultsCount: number) => {
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        normalized_search_term: query.toLowerCase().replace(/[-_\s]/g, ''),
        results_count: resultsCount,
        has_results: resultsCount > 0,
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

  // New function to track filter usage
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

  // New function to track user sessions
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

  return {
    trackPageView,
    trackEvent,
    trackResourceClick,
    trackSearch,
    trackCategoryView,
    trackFilterUsage,
    trackSessionStart
  };
};

export default useAnalytics;

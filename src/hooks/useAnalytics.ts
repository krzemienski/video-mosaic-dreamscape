
// Custom hook for Google Analytics tracking
export const useAnalytics = () => {
  // Page view tracking
  const trackPageView = (title: string, path: string) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
      });
    }
  };

  // Event tracking
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
        ...additionalParams
      });
    }
  };

  // Resource click tracking
  const trackResourceClick = (
    title: string,
    url: string,
    category?: string,
    subcategory?: string
  ) => {
    if (window.gtag) {
      window.gtag('event', 'resource_click', {
        event_category: 'engagement',
        event_label: title,
        resource_url: url,
        resource_category: category || 'unknown',
        resource_subcategory: subcategory || 'none'
      });
    }
  };

  // Search tracking
  const trackSearch = (query: string, resultsCount: number) => {
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount
      });
    }
  };

  // Category view tracking
  const trackCategoryView = (categoryName: string, resourceCount: number) => {
    if (window.gtag) {
      window.gtag('event', 'category_view', {
        event_category: 'navigation',
        event_label: categoryName,
        value: resourceCount
      });
    }
  };

  return {
    trackPageView,
    trackEvent,
    trackResourceClick,
    trackSearch,
    trackCategoryView
  };
};

export default useAnalytics;

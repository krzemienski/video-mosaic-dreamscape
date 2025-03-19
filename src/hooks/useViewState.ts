
import { useState, useEffect } from 'react';

type ViewType = 'grid' | 'list' | 'masonry';

const useViewState = (initialView: ViewType = 'grid'): [ViewType, (view: ViewType) => void] => {
  const [view, setView] = useState<ViewType>(initialView);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage on first mount
    if (!isInitialized) {
      const savedView = localStorage.getItem('preferredView');
      if (savedView && (savedView === 'grid' || savedView === 'list' || savedView === 'masonry')) {
        setView(savedView as ViewType);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const setViewAndSave = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem('preferredView', newView);
  };

  return [view, setViewAndSave];
};

export default useViewState;

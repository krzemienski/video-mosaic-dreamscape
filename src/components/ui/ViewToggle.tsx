
import React, { useEffect, useState } from 'react';
import { GridIcon, List, Rows3 } from 'lucide-react';

type ViewType = 'grid' | 'list' | 'masonry';

interface ViewToggleProps {
  view: ViewType;
  onChange: (view: ViewType) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-1 bg-muted/30 p-1 rounded-lg">
      <button
        className={`p-2 rounded-md transition-all ${
          view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'
        }`}
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List size={18} />
      </button>
      <button
        className={`p-2 rounded-md transition-all ${
          view === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'
        }`}
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <GridIcon size={18} />
      </button>
      <button
        className={`p-2 rounded-md transition-all ${
          view === 'masonry' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'
        }`}
        onClick={() => onChange('masonry')}
        aria-label="Masonry view"
      >
        <Rows3 size={18} />
      </button>
    </div>
  );
};

export default ViewToggle;

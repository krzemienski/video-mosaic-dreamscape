
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "We apologize, but there seems to be a problem retrieving the video resources at the moment.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <AlertCircle size={48} className="text-destructive mb-4" />
      <h2 className="text-xl font-medium mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold mb-4 opacity-10">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

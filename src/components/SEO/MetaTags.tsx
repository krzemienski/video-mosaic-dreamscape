import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  image?: string;
  keywords?: string[];
}

/**
 * Component for managing dynamic meta tags for SEO
 */
const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'Awesome Video',
  description = 'Discover a curated collection of high-quality video resources across various categories. Find the best video content for learning, entertainment, and inspiration.',
  canonicalUrl = 'https://awesome.video/',
  ogType = 'website',
  image = 'https://awesome.video/og-image.png',
  keywords = ['video resources', 'curated videos', 'video collections'],
}) => {
  // Ensure title has site name
  const fullTitle = title === 'Awesome Video' ? title : `${title} | Awesome Video`;
  
  // Format keywords
  const keywordsString = keywords.join(', ');
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Awesome Video" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* JSON-LD Structured Data for Video Platform */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Awesome Video',
          url: 'https://awesome.video/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://awesome.video/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
};

export default MetaTags;

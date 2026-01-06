import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  structuredData?: object;
}

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://errorlytic.com').replace(/\/$/, '');
const defaultOgImage = `${siteUrl}/og-image.png`;

const SEO: React.FC<SEOProps> = ({
  title = 'Errorlytic - AI-Powered Automotive Diagnostics Platform',
  description = 'Transform VCDS diagnostic files into actionable insights with AI. Errorlytic helps mechanics, workshops, and automotive professionals diagnose vehicle issues faster and more accurately.',
  keywords = 'automotive diagnostics, VCDS analysis, vehicle diagnostics, AI diagnostics, car repair, automotive AI, diagnostic tool, vehicle analysis, mechanic software, auto workshop',
  ogImage = defaultOgImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl = `${siteUrl}/`,
  structuredData,
}) => {
  const fullTitle = title.includes('Errorlytic') ? title : `${title} | Errorlytic`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Errorlytic" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  image = '/opengraph.jpg',
  type = 'website',
  publishedTime
}: SEOProps) {
  const siteName = 'CookieLite';
  const domain = 'https://cookielite.eu';
  const fullUrl = canonicalUrl ? `${domain}${canonicalUrl}` : domain;
  const imageUrl = image.startsWith('http') ? image : `${domain}${image}`;
  const fullTitle = title.includes('CookieLite') ? title : `${title} | CookieLite`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebApplication',
    ...(type === 'article'
      ? {
          headline: title,
          description,
          url: fullUrl,
          image: imageUrl,
          ...(publishedTime ? { datePublished: publishedTime } : {}),
        }
      : {
          name: siteName,
          description,
          url: fullUrl,
          image: imageUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '7',
            priceCurrency: 'EUR',
            description: 'Monthly subscription for GDPR cookie consent banner',
          },
        }),
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@cookielite" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

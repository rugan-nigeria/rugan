import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  type = 'website', 
  url, 
  image, 
  keywords,
  author 
}) {
  const siteName = 'RUGAN';
  const siteUrl = 'https://rugan.org';
  const defaultDescription = 'RUGAN empowers rural girl-children through education, mentorship, and advocacy.';
  const defaultImage = `${siteUrl}/images/homepage/Hero.jpg`;

  const pageTitle = title ? `${title} | ${siteName}` : `${siteName} | Empowering Rural Girls`;
  const pageDescription = description || defaultDescription;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;
  const pageImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={pageTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
    </Helmet>
  );
}

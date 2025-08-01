import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noindex?: boolean
  structuredData?: Record<string, any>
}

export function generateSEOMetadata({
  title = 'LLM Grounding Agent - AI Brand Strategist',
  description = 'Transform generic AI responses into actionable insights using Qloo\'s cultural intelligence',
  keywords = ['AI', 'brand strategy', 'cultural intelligence', 'Qloo', 'LLM', 'grounding'],
  canonical,
  ogImage = '/og-image.jpg',
  noindex = false,
  structuredData
}: SEOProps = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const fullTitle = title.includes('LLM Grounding Agent') ? title : `${title} | LLM Grounding Agent`
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'LLM Grounding Agent Team' }],
    creator: 'LLM Grounding Agent',
    publisher: 'LLM Grounding Agent',
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      type: 'website',
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: 'LLM Grounding Agent',
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${baseUrl}${ogImage}`],
      creator: '@llmgrounding',
      site: '@llmgrounding',
    },
    other: structuredData ? {
      'application/ld+json': JSON.stringify(structuredData)
    } : undefined,
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  }
}

export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LLM Grounding Agent',
    description: 'Transform generic AI responses into actionable insights using Qloo\'s cultural intelligence',
    url: baseUrl,
    logo: `${baseUrl}/icons/icon-512x512.png`,
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
  }
}

export function generateWebApplicationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LLM Grounding Agent',
    description: 'Transform generic AI responses into actionable insights using Qloo\'s cultural intelligence',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    screenshot: `${baseUrl}/screenshots/app-screenshot.jpg`,
  }
}

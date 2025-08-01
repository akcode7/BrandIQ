import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/auth/AuthProvider'
import Header from '@/components/layout/Header'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/Theme'
import { ToastProvider } from '@/components/Toast'
import { LoadingProvider } from '@/components/Loading'
import { SkipLink } from '@/components/Accessibility'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Grounding Agent - AI Brand Strategist',
  description: 'Transform generic AI responses into actionable insights using Qloo\'s cultural intelligence',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Grounding Agent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="application-name" content="LLM Grounding Agent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Grounding Agent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
        <SkipLink />
        <ErrorBoundary>
          <ThemeProvider>
            <LoadingProvider>
              <ToastProvider>
                <AuthProvider>
                  <Header />
                  <main id="main-content" className="min-h-screen">
                    {children}
                  </main>
                  <PerformanceOptimizer />
                </AuthProvider>
              </ToastProvider>
            </LoadingProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

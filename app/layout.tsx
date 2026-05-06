import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Konfido — The CFO's Robin",
  description:
    'Agentic intelligence for treasury. The numbers run themselves. You run the company.',
  metadataBase: new URL('https://usekonfido.com'),
  openGraph: {
    title: "Konfido — The CFO's Robin",
    description:
      'Agentic intelligence for treasury. The numbers run themselves. You run the company.',
    url: 'https://usekonfido.com',
    siteName: 'Konfido',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A1F5F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-lang="en" className={inter.variable}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

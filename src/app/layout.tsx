import type { Metadata, Viewport } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { META, PERSON } from '@/data/portfolio';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  authors: [{ name: PERSON.fullName }],
  keywords: [
    'Full Stack AI Engineer', 'Agentic AI', 'RAG', 'Multi-Agent Systems', 'LangGraph', 'LangChain',
    'Next.js', 'FastAPI', 'AI ERP', 'AI CRM', 'Lahore', 'Pakistan', 'UAE',
  ],
  openGraph: {
    type: 'website',
    title: META.title,
    description: META.description,
    siteName: PERSON.fullName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: META.title,
    description: META.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

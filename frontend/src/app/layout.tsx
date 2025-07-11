import './globals.css';
import { Providers } from './providers';
import { NavWrapper } from '@/components/NavWrapper';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { FooterWrapper } from '@/components/FooterWrapper';

export const metadata: Metadata = {
  title: 'Quickly',
  description: 'Job marketplace platform',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavWrapper />
                <Toaster position="top-right" />
          {children}
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
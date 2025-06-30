import './globals.css';
import { Providers } from './providers';
import { NavWrapper } from '@/components/NavWrapper';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavWrapper />
                <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
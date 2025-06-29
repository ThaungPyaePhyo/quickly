import './globals.css';
import { Providers } from './providers';
import { NavWrapper } from '@/components/NavWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
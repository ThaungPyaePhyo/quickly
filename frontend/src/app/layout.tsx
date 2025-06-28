import { AuthGuard } from '@/components/AuthGuard';
import './globals.css';
import { Providers } from './providers';
import { NavWrapper } from '@/components/NavWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthGuard>
          <NavWrapper />
          {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
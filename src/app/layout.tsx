import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/highlight-theme.css';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { AuthProvider } from '@/domain/auth/providers/auth-provider';
import StyledComponentsRegistry from '@/styles/registry';
import Header from '@/domain/layout/header';
import Footer from '@/domain/layout/footer';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blend',
  description: 'Developer Blog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistMono.variable}`}>
      <body suppressHydrationWarning className="bg-background text-foreground antialiased">
        <StyledComponentsRegistry>
          <ThemeProvider attribute="class">
            <AuthProvider>
              <Header />
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

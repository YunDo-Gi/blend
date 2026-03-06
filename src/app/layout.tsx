import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Geist_Mono, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import '@/styles/highlight-theme.css';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { AuthProvider } from '@/domain/auth/providers/auth-provider';
import QueryProvider from '@/shared/lib/query-provider';
import StyledComponentsRegistry from '@/styles/registry';
import Header from '@/domain/layout/header';
import Footer from '@/domain/layout/footer';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
  const fontVariables = {
    '--font-serif': spaceGrotesk.style.fontFamily,
    '--font-heading': spaceGrotesk.style.fontFamily,
  } as CSSProperties;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${spaceGrotesk.variable}`}
      style={fontVariables}
    >
      <body suppressHydrationWarning className="bg-background text-foreground antialiased">
        <StyledComponentsRegistry>
          <QueryProvider>
            <ThemeProvider attribute="class">
              <AuthProvider>
                <Header />
                <div className="flex min-h-screen flex-col">
                  <main className="flex-1">{children}</main>
                </div>
                <Footer />
                <Toaster position="bottom-right" richColors />
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

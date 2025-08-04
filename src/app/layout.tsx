import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import StyledComponentsRegistry from '@/styles/registry';
import Header from '@/domain/layout/header';
import Footer from '@/domain/layout/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
        style={{
          transitionProperty: 'color, background-color, border-color',
          transitionDuration: 'var(--animation-duration-toggle-theme)',
          transitionTimingFunction: 'var(--easing-toggle-theme)'
        }}
      >
        <StyledComponentsRegistry>
          <ThemeProvider attribute="class">
            <Header />
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
            <Footer />
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

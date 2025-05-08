
import type { Metadata } from 'next';
// Correct named imports for Geist fonts
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// The following lines were causing the TypeError:
// const geistSans = GeistSans({
//   variable: '--font-geist-sans',
// });
// const geistMono = GeistMono({
//   variable: '--font-geist-mono',
// });
// GeistSans and GeistMono (the imports) are already the configured font objects.
// Their `.variable` property provides the CSS variable name (e.g., '--font-geist-sans').

export const metadata: Metadata = {
  title: 'FlashLearnAI',
  description: 'AI-powered flashcard learning application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the CSS variable classes from Geist fonts to the <html> element.
    // This makes the CSS variables (--font-geist-sans, --font-geist-mono) available globally.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/*
        The `font-sans` class from Tailwind will apply its default sans-serif stack.
        The rule in `globals.css` (body { font-family: var(--font-geist-sans), ...; })
        will then apply GeistSans to the body, taking precedence.
        `antialiased` is a Tailwind utility for font smoothing.
      */}
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

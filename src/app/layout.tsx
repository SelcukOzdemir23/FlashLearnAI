
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans({
  variable: '--font-geist-sans',
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
});

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

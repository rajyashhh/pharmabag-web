import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PharmaBag - B2B Pharma Platform',
  description: 'India\'s Only Trusted B2B Pharma Platform for Wholesalers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

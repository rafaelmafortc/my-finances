import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
  title: 'MyFinances',
  description: 'powered by Rafael Mafort',
  icons: {
    icon: '/piggy-bank.svg',
  },
};

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`antialiased ${geist.className}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

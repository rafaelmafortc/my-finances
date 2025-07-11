import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'MyFinances',
    description: 'powered by Rafael Mafort Coimbra',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={poppins.className}>{children}</body>
        </html>
    );
}

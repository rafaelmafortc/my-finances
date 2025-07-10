import type { Metadata } from 'next';

import '@/styles/globals.css';

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
            <body>{children}</body>
        </html>
    );
}

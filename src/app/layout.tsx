import type { Metadata } from 'next';

import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'My Finances',
    description: 'powered by Rafael Mafort Coimbra',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}

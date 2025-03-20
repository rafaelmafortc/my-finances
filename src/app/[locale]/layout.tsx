import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/provider/theme-provider';

export const metadata: Metadata = {
    title: 'My Finances',
    description: 'powered by raslow',
    icons: '/piggy-bank.svg',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/piggy-bank.svg" type="image/x-icon" />
                <link
                    rel="shortcut icon"
                    href="/piggy-bank.svg"
                    type="image/x-icon"
                />
            </head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

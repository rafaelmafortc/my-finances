import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/provider/theme-provider';

import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'MyFinances',
    description: 'powered by raslow',
    icons: '/piggy-bank.svg',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const lang = cookieStore.get('MF_LANGUAGE')?.value || 'en';

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <link rel="icon" href="/piggy-bank.svg" type="image/x-icon" />
                <link
                    rel="shortcut icon"
                    href="/piggy-bank.svg"
                    type="image/x-icon"
                />
            </head>
            <body>
                <NextIntlClientProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem={true}
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

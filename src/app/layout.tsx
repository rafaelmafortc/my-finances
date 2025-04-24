import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';

import { ThemeProvider } from '@/providers/theme-provider';

import '@/styles/globals.css';
import { CurrencyProvider } from '@/providers/currency-provider';

export const metadata: Metadata = {
    title: 'MyFinances',
    description: 'powered by Rafael Mafort Coimbra',
    icons: '/favicon.ico',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const lang = cookieStore.get('language')?.value || 'pt-BR';

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                    type="image/x-icon"
                />
            </head>
            <body>
                <CurrencyProvider>
                    <NextIntlClientProvider locale={lang}>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </CurrencyProvider>
            </body>
        </html>
    );
}

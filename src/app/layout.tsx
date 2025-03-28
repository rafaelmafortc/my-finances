import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';

import { ThemeProvider } from '@/provider/theme-provider';
import { AuthProvider } from '@/provider/auth-provider';

import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'MyFinances',
    description: 'powered by raslow',
    icons: '/favicon.ico',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const lang = cookieStore.get('language')?.value || 'en';

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
                <AuthProvider>
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
                </AuthProvider>
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { SelectedDateProvider } from '@/providers/selected-date-provider';
import { SessionProvider } from '@/providers/session-provider';
import { UserProvider } from '@/providers/user-provider';

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
            <body className={poppins.className}>
                <SessionProvider>
                    <UserProvider>
                        <SelectedDateProvider>{children}</SelectedDateProvider>
                    </UserProvider>
                </SessionProvider>
                <Toaster
                    toastOptions={{
                        classNames: {
                            success: '!text-lime',
                            warning: '!text-yellow',
                            error: '!text-red',
                        },
                    }}
                />
            </body>
        </html>
    );
}

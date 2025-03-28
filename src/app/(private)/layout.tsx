'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { useAuth } from '@/provider/auth-provider';

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const t = useTranslations('login');

    if (loading || !user?.uid) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="sm:ml-16 p-4 flex-1 overflow-hidden flex flex-col">
                <div className="mb-4 text-sm text-muted-foreground">
                    {t('welcome')}, {user?.displayName}
                </div>
                {children}
            </div>
        </div>
    );
}

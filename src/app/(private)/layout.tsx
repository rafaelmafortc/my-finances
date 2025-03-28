'use client';

import { Navbar } from '@/components/navbar';
import { useAuth } from '@/provider/auth-provider';
import { Loader, Loader2 } from 'lucide-react';

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-2 text-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="sm:ml-16 p-4">
                {user?.displayName && (
                    <div className="mb-4 text-lg">
                        Bem-vindo, {user.displayName}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

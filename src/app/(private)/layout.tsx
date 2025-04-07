'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    if (user === undefined) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="sm:ml-16 p-4 flex-1 flex flex-col">{children}</div>
        </div>
    );
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { type DefaultSession } from 'next-auth';

interface UserContextType {
    user: DefaultSession['user'] | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<DefaultSession['user'] | undefined>(
        undefined
    );
    const { data: session } = useSession();

    useEffect(() => {
        const userSession = session?.user ?? undefined;
        setUser(userSession);
    }, [session]);

    return (
        <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

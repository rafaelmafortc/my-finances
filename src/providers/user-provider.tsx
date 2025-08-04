'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { type DefaultSession } from 'next-auth';

interface UserContextType {
    user: DefaultSession['user'] | undefined;
    firstName: string;
    lastName: string;
    initials: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { data: session } = useSession();
    const [user, setUser] = useState<DefaultSession['user'] | undefined>(
        undefined
    );
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [initials, setInitials] = useState('');

    useEffect(() => {
        const userSession = session?.user ?? undefined;
        setUser(userSession);

        const fullName = userSession?.name ?? '';
        const nameParts = fullName.trim().split(' ');

        const firstName = nameParts[0] ?? '';
        const lastName = nameParts.length
            ? nameParts[nameParts.length - 1]
            : '';
        const initials = firstName.length
            ? `${firstName[0]}${lastName[0]}`
            : '';

        setFirstName(firstName);
        setLastName(lastName);
        setInitials(initials);
    }, [session]);

    return (
        <UserContext.Provider value={{ user, firstName, lastName, initials }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { type DefaultSession } from 'next-auth';

interface UserContextType {
    user: DefaultSession['user'] | undefined;
    firstName: string;
    lastName: string;
    initials: string;
    avatarColor: string;
    setAvatarColor: (color: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { data: session } = useSession();
    const [user, setUser] = useState<DefaultSession['user']>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [initials, setInitials] = useState('');
    const [avatarColor, setAvatarColor] = useState<string>('');

    useEffect(() => {
        const userSession = session?.user ?? undefined;
        setUser(userSession);

        const fullName = userSession?.name ?? '';
        const nameParts = fullName.trim().split(' ');
        const first = nameParts[0] ?? '';
        const last =
            nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
        const initials = first && last ? `${first[0]}${last[0]}` : '';

        setFirstName(first);
        setLastName(last);
        setInitials(initials);
    }, [session]);

    useEffect(() => {
        const fetchColor = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await fetch('/api/user/color');
                const data = await res.json();
                console.log('data -> ', data);
                setAvatarColor(data?.color ?? 'purple');
            } catch (error) {
                setAvatarColor('purple');
            }
        };

        fetchColor();
    }, [session]);

    return (
        <UserContext.Provider
            value={{
                user,
                firstName,
                lastName,
                initials,
                avatarColor,
                setAvatarColor,
            }}
        >
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

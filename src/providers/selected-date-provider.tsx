'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type SelectedDateContextType = {
    date: Date | null;
    month: string | undefined;
    setSelectedDate: (d: Date) => void;
};

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(
    undefined
);

export function SelectedDateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [date, setDate] = React.useState<Date>(() => new Date());
    const month = React.useMemo(() => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    }, [date]);

    const setSelectedDate = (d: Date) => {
        const norm = new Date(d.getFullYear(), d.getMonth(), 1);
        setDate(norm);
    };

    return (
        <SelectedDateContext.Provider value={{ date, month, setSelectedDate }}>
            {children}
        </SelectedDateContext.Provider>
    );
}

export function useSelectedDate() {
    const ctx = useContext(SelectedDateContext);
    if (!ctx)
        throw new Error(
            'useSelectedDate must be used inside SelectedDateProvider'
        );
    return ctx;
}

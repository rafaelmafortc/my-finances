import { useMemo } from 'react';

import { useTransactions } from '@/hooks/use-transactions';

export type Period = {
    key: string;
    label: string;
    startDate: string;
    endDate: string;
};

type Mode = 'month' | 'year';

function formatPeriod(date: Date, mode: Mode) {
    if (mode === 'month') {
        const fmt = new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
        });
        const parts = fmt.formatToParts(date);
        const m = parts.find((p) => p.type === 'month')?.value ?? '';
        const y = parts.find((p) => p.type === 'year')?.value ?? '';
        return `${m.charAt(0).toUpperCase() + m.slice(1)}/${y}`;
    }
    return String(date.getUTCFullYear());
}

export function useAvailablePeriods(mode: Mode = 'month') {
    const { transactions, isLoading, isError } = useTransactions();

    const periods: Period[] = useMemo(() => {
        const map = new Map<string, Period>();

        for (const t of transactions ?? []) {
            const d = new Date(t.date);
            if (mode === 'month') {
                const y = d.getUTCFullYear();
                const m = d.getUTCMonth();
                const key = `${y}-${String(m + 1).padStart(2, '0')}`;
                if (!map.has(key)) {
                    const start = new Date(Date.UTC(y, m, 1));
                    const end = new Date(Date.UTC(y, m + 1, 1));
                    map.set(key, {
                        key,
                        label: formatPeriod(start, 'month'),
                        startDate: start.toISOString(),
                        endDate: end.toISOString(),
                    });
                }
            } else {
                const y = d.getUTCFullYear();
                const key = `${y}`;
                if (!map.has(key)) {
                    const start = new Date(Date.UTC(y, 0, 1));
                    const end = new Date(Date.UTC(y + 1, 0, 1));
                    map.set(key, {
                        key,
                        label: formatPeriod(start, 'year'),
                        startDate: start.toISOString(),
                        endDate: end.toISOString(),
                    });
                }
            }
        }

        return Array.from(map.values()).sort((a, b) =>
            a.startDate > b.startDate ? 1 : -1
        );
    }, [transactions, mode]);

    return { periods, isLoading, isError };
}

'use client';

import { useCurrency } from '@/providers/currency-provider';
import { currencyFormatter } from '@/lib/formatCurrency';

interface PieFooterCardProps {
    name: string;
    value: number;
}

export function PieFooterCard({ name, value }: PieFooterCardProps) {
    const { currency } = useCurrency();

    return (
        <div className=" flex items-center space-x-4 rounded-md border p-4 lg:w-1/4 w-full">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <p>{currencyFormatter(value, currency)}</p>
        </div>
    );
}

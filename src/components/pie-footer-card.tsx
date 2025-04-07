'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';

import { useCurrency } from '@/providers/currency-provider';
import { currencyFormatter } from '@/lib/formatCurrency';
import { Button } from '@/components/ui/button';
import { convertCurrency } from '@/lib/convertCurrency';

interface PieFooterCardProps {
    name: string;
    value: number;
    currency: string;
    onClick?: () => void;
}

export function PieFooterCard({
    name,
    value,
    currency,
    onClick,
}: PieFooterCardProps) {
    const { currency: globalCurrency } = useCurrency();
    const [convertedValue, setConvertedValue] = useState<number | null>(null);

    useEffect(() => {
        if (globalCurrency !== currency) {
            convertCurrency(value, currency, globalCurrency)
                .then((res) => setConvertedValue(res))
                .catch((err) => {
                    console.error('Erro na conversão de moeda:', err);
                    setConvertedValue(null);
                });
        }
    }, [value, currency, globalCurrency]);

    return (
        <div className="flex items-center bg-sidebar space-x-4 rounded-md border p-4 lg:w-1/4 w-full h-16">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <div className="flex items-center gap-2">
                {globalCurrency !== currency && convertedValue !== null && (
                    <p>({currencyFormatter(convertedValue, globalCurrency)})</p>
                )}
                <p>{currencyFormatter(value, currency)}</p>
                <Button variant="ghost" size="icon" onClick={onClick}>
                    <Pencil />
                </Button>
            </div>
        </div>
    );
}

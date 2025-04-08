'use client';

import { useEffect, useState } from 'react';
import { Pencil, ArrowRight } from 'lucide-react';

import { useCurrency } from '@/providers/currency-provider';
import { currencyFormatter } from '@/lib/formatCurrency';
import { Button } from '@/components/ui/button';
import { convertCurrency } from '@/lib/convertCurrency';

interface EditableCardProps {
    name: string;
    value: number;
    currency: string;
    onEdit?: () => void;
    onNavigate?: () => void;
}

export function EditableCard({
    name,
    value,
    currency,
    onEdit,
    onNavigate,
}: EditableCardProps) {
    const { currency: globalCurrency } = useCurrency();
    const [convertedValue, setConvertedValue] = useState<number | null>(null);

    const shouldShowConverted =
        onEdit !== undefined && currency !== globalCurrency;

    useEffect(() => {
        if (shouldShowConverted) {
            convertCurrency(value, currency, globalCurrency)
                .then((res) => setConvertedValue(res))
                .catch((err) => {
                    console.error('Erro na conversão de moeda:', err);
                    setConvertedValue(null);
                });
        } else {
            setConvertedValue(null);
        }
    }, [value, currency, globalCurrency, shouldShowConverted]);

    return (
        <div className="flex items-center bg-sidebar space-x-4 rounded-md border p-4 lg:w-1/4 w-full h-16">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <div className="flex items-center gap-2">
                {convertedValue !== null && (
                    <p className="text-xs text-muted-foreground">
                        ({currencyFormatter(convertedValue, globalCurrency)})
                    </p>
                )}
                <p>{currencyFormatter(value, currency)}</p>

                {onEdit && (
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {onNavigate && (
                    <Button variant="ghost" size="icon" onClick={onNavigate}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useCurrency } from '@/providers/currency-provider';

interface CurrencyToggleProps {
    hasText?: boolean;
}

export function CurrencyToggle({ hasText = false }: CurrencyToggleProps) {
    const t = useTranslations('navbar');

    const { currency, setCurrency } = useCurrency();

    const handleCurrency = () => {
        setCurrency(currency === 'BRL' ? 'USD' : 'BRL');
    };

    return (
        <Button
            onClick={handleCurrency}
            variant="static"
            className="p-2 group flex justify-start w-full"
        >
            <div className="flex items-center gap-4 text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="w-5 h-5">
                    {currency === 'BRL' ? 'R$' : '$'}
                </span>
                {hasText && (
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('change_currency')}
                    </span>
                )}
            </div>
        </Button>
    );
}

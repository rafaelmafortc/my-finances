import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export const TypeBadge = ({ type }: { type: 'INCOME' | 'EXPENSE' }) => {
    const isIncome = type === 'INCOME';
    const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;
    const label = isIncome ? 'Receita' : 'Despesa';

    return (
        <Badge variant="secondary">
            <Icon className={isIncome ? 'text-lime' : 'text-red'} />
            {label}
        </Badge>
    );
};

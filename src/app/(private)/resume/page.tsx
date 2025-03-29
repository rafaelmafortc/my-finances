'use client';

import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { PieFooterCard } from '@/components/pie-footer-card';
import { currencyFormatter } from '@/lib/formatCurrency';
import { useCurrency } from '@/providers/currency-provider';

const data = [
    { value: 1048, name: 'income', color: '#91CC75' },
    { value: 735, name: 'expense', color: '#EE6666' },
];

export default function Resume() {
    const t = useTranslations('navbar');
    const { currency } = useCurrency();

    const balance = data[0].value - data[1].value;

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('resume')}>
                <PieChart
                    title={currencyFormatter(balance, currency)}
                    data={data}
                />
                <CardFooter className="flex flex-col gap-2">
                    {data.map(({ value, name }) => {
                        return (
                            <PieFooterCard
                                key={name}
                                value={value}
                                name={t(name)}
                            />
                        );
                    })}
                </CardFooter>
            </PageLayout>
        </main>
    );
}

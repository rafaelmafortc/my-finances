import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { PieFooterCard } from '@/components/pie-footer-card';

const data = [
    { value: 1048, name: 'income', color: '#91CC75', currency: 'BRL' },
    { value: 735, name: 'expense', color: '#EE6666', currency: 'BRL' },
];

export default function Resume() {
    const t = useTranslations('navbar');

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('resume')}>
                <PieChart data={data} />
                <CardFooter className="flex flex-col gap-2">
                    {data.map(({ value, name, currency }) => {
                        return (
                            <PieFooterCard
                                key={name}
                                value={value}
                                name={t(name)}
                                currency={currency}
                            />
                        );
                    })}
                </CardFooter>
            </PageLayout>
        </main>
    );
}

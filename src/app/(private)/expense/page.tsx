import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';
import { PieChartComponent } from '@/components/pie-chart';

export default function Expense() {
    const t = useTranslations('navbar');

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('expense')}>
                <PieChartComponent />
            </PageLayout>
        </main>
    );
}

import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';

export default function Resume() {
    const t = useTranslations('navbar');

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('resume')}>
                <PieChart />
            </PageLayout>
        </main>
    );
}

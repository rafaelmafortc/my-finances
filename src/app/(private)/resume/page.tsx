import { PieChartComponent } from '@/components/pie-chart';
import { useTranslations } from 'next-intl';

export default function Resume() {
    const t = useTranslations('navbar');

    return (
        <main className="min-h-full">
            <PieChartComponent title={t('resume')} />
        </main>
    );
}

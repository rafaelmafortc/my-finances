import { PieChartComponent } from '@/components/pie-chart';
import { useTranslations } from 'next-intl';

export default function Resume() {
    const t = useTranslations('navbar');

    return (
        <main className="flex-1 flex flex-col">
            <PieChartComponent title={t('resume')} />
        </main>
    );
}

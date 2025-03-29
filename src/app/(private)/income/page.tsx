import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';

export default function Income() {
    const t = useTranslations('navbar');

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('income')}>
                <div></div>
            </PageLayout>
        </main>
    );
}

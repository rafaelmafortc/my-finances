import { useTranslations } from 'next-intl';

export default function Resume() {
    const t = useTranslations('navbar');

    return (
        <main>
            <div>{t('resume')}</div>
        </main>
    );
}

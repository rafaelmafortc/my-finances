import { useTranslations } from 'next-intl';

export default function Income() {
    const t = useTranslations('navbar');

    return (
        <main>
            <div>{t('income')}</div>
        </main>
    );
}

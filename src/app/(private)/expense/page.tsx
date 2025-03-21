import { useTranslations } from 'next-intl';

export default function Expense() {
    const t = useTranslations('navbar');

    return (
        <main>
            <div>{t('expense')}</div>
        </main>
    );
}

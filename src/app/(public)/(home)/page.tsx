import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslations } from 'next-intl';
import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function SignIn() {
    const t = useTranslations('home');

    return (
        <main className="flex items-center justify-center h-screen w-screen p-4">
            <div className="flex flex-col lg:w-1/2 w-full xl:h-1/3 h-1/2 px-4 py-8 gap-4 border-2 shadow-lg border-s-foreground">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <PiggyBank className={'h-12 w-12 '} />
                        <h1 className="text-3xl">MyFinances</h1>
                    </div>
                    <h2 className="text-xl">{t('description')}</h2>
                </div>
                <div className="flex place-content-between items-center gap-2 mt-auto">
                    <Link href="/resume" prefetch={false}>
                        <Button variant={'secondary'}>
                            {t('get_started')}
                        </Button>
                    </Link>
                    <div>
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </main>
    );
}

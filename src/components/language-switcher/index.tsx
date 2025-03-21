'use client';

import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
    const router = useRouter();

    function handleLocaleChange() {
        const cookieLang = document.cookie
            .split('; ')
            .find((row) => row.startsWith('MF_LANGUAGE='))
            ?.split('=')[1];

        let newLocale;
        if (cookieLang === 'en') {
            newLocale = 'pt-BR';
        } else {
            newLocale = 'en';
        }

        console.log('newLocale', newLocale);

        document.cookie = `MF_LANGUAGE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        router.refresh();
    }

    return (
        <Button
            onClick={handleLocaleChange}
            variant={'static'}
            className="p-2 group"
        >
            <div className="flex items-center gap-5 text-primary">
                <Globe className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
        </Button>
    );
}

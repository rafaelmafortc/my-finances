'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
    hasText?: boolean;
}

export function LanguageSwitcher({ hasText = false }: LanguageSwitcherProps) {
    const t = useTranslations('navbar');
    const router = useRouter();
    const [locale, setLocale] = useState<'pt-BR' | 'en' | null>(null);

    useEffect(() => {
        const cookieLang = document.cookie
            .split('; ')
            .find((row) => row.startsWith('MF_LANGUAGE='))
            ?.split('=')[1] as 'pt-BR' | 'en' | undefined;

        if (cookieLang === 'en' || cookieLang === 'pt-BR') {
            setLocale(cookieLang);
        } else {
            setLocale('en');
        }
    }, []);

    function handleLocaleChange() {
        const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
        document.cookie = `MF_LANGUAGE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        setLocale(newLocale);
        router.refresh();
    }

    const flagSrc =
        locale === 'pt-BR' ? '/assets/flags/br.svg' : '/assets/flags/us.svg';

    return (
        <Button
            onClick={handleLocaleChange}
            variant={'static'}
            className="p-2 group flex justify-start w-full"
        >
            <div className="flex items-center gap-4 text-primary">
                {locale ? (
                    <Image
                        className="text-muted-foreground group-hover:text-foreground"
                        src={flagSrc}
                        alt="us / br flag"
                        width={20}
                        height={15}
                        style={{ height: 'auto' }}
                    />
                ) : (
                    <div className="w-[20px] h-[20px]" />
                )}
                {hasText && (
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('change_lang')}
                    </span>
                )}
            </div>
        </Button>
    );
}

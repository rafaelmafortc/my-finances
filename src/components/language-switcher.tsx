'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
    hasText?: boolean;
}

export function LanguageSwitcher({ hasText = false }: LanguageSwitcherProps) {
    const t = useTranslations('navbar');
    const router = useRouter();
    const locale = useLocale();

    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    const flagSrc =
        locale === 'pt-BR' ? '/assets/flags/br.svg' : '/assets/flags/us.svg';

    function handleLocaleChange() {
        document.cookie = `language=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        router.refresh();
    }

    return (
        <Button
            onClick={handleLocaleChange}
            variant="static"
            className="p-2 group flex justify-start w-full"
        >
            <div className="flex items-center gap-4 text-primary">
                <Image
                    className="text-muted-foreground group-hover:text-foreground"
                    src={flagSrc}
                    alt="us / br flag"
                    width={20}
                    height={15}
                    style={{ height: 'auto' }}
                />
                {hasText && (
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('change_lang')}
                    </span>
                )}
            </div>
        </Button>
    );
}

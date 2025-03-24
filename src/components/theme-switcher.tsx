'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
    hasText?: boolean;
}

export function ThemeSwitcher({ hasText = false }: ThemeSwitcherProps) {
    const t = useTranslations('navbar');
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            onClick={handleTheme}
            variant={'static'}
            className="p-2 group flex justify-start w-full"
        >
            <div className="flex items-center gap-5 text-primary">
                {isMounted ? (
                    resolvedTheme === 'light' ? (
                        <Sun className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                        <Moon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    )
                ) : (
                    <div className="w-[20px] h-[20px]" />
                )}
                {hasText && (
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {t('change_theme')}
                    </span>
                )}
            </div>
        </Button>
    );
}

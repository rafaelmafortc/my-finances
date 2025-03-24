'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
interface ThemeToggleProps {
    hasText?: boolean;
}

export function ThemeToggle({ hasText = false }: ThemeToggleProps) {
    const t = useTranslations('navbar');

    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button
            onClick={handleTheme}
            variant={'static'}
            className="flex justify-start w-full gap-6.5 text-muted-foreground group-hover:text-foreground transition-colors"
        >
            <div className="relative flex items-center justify-center">
                <Sun className="absolute w-5 h-5 scale-100 dark:scale-0" />
                <Moon className="absolute w-5 h-5 scale-0 dark:scale-100" />
            </div>

            {hasText && (
                <span className="text-sm font-medium">{t('change_theme')}</span>
            )}
        </Button>
    );
}

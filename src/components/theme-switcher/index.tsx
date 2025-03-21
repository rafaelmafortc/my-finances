'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

interface ThemeSwitcherProps {
    hasText?: boolean;
}

export function ThemeSwitcher({ hasText = false }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <Button onClick={handleTheme} variant={'static'} className="p-2 group">
            <div className="flex items-center gap-5 text-primary">
                {theme === 'light' ? (
                    <Sun className="text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                    <Moon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
                {hasText && (
                    <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Alterar tema
                    </span>
                )}
            </div>
        </Button>
    );
}

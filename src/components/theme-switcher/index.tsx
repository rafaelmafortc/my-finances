'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

interface ModeToggleProps {
    hasText?: boolean;
}

export function ModeToggle({ hasText = false }: ModeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <Button onClick={handleTheme} variant={'ghost'} className="p-2">
            <div className="flex items-center gap-4 text-primary hover:text-foreground">
                {theme === 'light' ? (
                    <Sun className="text-primary" />
                ) : (
                    <Moon className="text-primary" />
                )}
                {hasText && <span>Alterar tema</span>}
            </div>
        </Button>
    );
}

'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const handleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <Button onClick={handleTheme} variant={'ghost'}>
            {theme === 'light' ? (
                <Sun className="text-primary" />
            ) : (
                <Moon className="text-primary" />
            )}
        </Button>
    );
}

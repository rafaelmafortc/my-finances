'use client';

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOutIcon, Menu, PiggyBank } from 'lucide-react';
import { navbarItems } from '@/lib/navbar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../language-switcher';

export function Navbar() {
    const pathname = usePathname();
    const t = useTranslations('navbar');

    return (
        <div className="flex w-full flex-col bg-muted/40">
            {/* PC */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
                <div className="flex flex-col items-center p-2">
                    <PiggyBank className={'h-8 w-8 '} />
                </div>
                <nav className="flex flex-col items-center gap-5 px-2 py-5 flex-1 justify-center">
                    <TooltipProvider>
                        {navbarItems.map(({ id, title, href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Tooltip key={id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={href}
                                            key={id}
                                            className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
                                            prefetch={false}
                                        >
                                            <div
                                                className={`h-9 w-9 flex items-center justify-center transition-all ${
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground rounded-full p-2'
                                                        : ''
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-5 w-5 transition-all`}
                                                />
                                            </div>
                                            <span className="sr-only">
                                                {t(title)}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {t(title)}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-5 px-2 py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <LanguageSwitcher />
                                    <span className="sr-only">
                                        Alterar tema
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Alterar tema
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <ThemeSwitcher />
                                    <span className="sr-only">
                                        Alterar tema
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Alterar tema
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" prefetch={false}>
                                    <Button
                                        variant={'static'}
                                        className="p-2 group"
                                    >
                                        <LogOutIcon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="sr-only">Sair</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Sair</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header
                    className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static 
                sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
                >
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="sm:hidden"
                            >
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">
                                    abrir / fechar menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-x" side="left">
                            <SheetTitle className="flex items-center gap-1 p-2 px-2.5 text-2xl ">
                                <PiggyBank className={'h-8 w-8'} />
                                MyFinances
                            </SheetTitle>
                            <nav className="grid gap-6 text-lg font-medium">
                                {navbarItems.map(
                                    ({ id, title, href, icon: Icon }) => {
                                        const isActive = pathname === href;
                                        return (
                                            <Link
                                                key={id}
                                                href={href}
                                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                                prefetch={false}
                                            >
                                                <div
                                                    className={`h-9 w-9 flex items-center justify-center transition-all ${
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground rounded-full p-2'
                                                            : ''
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`h-5 w-5 transition-all`}
                                                    />
                                                </div>
                                                <span
                                                    className={`transition-all ${
                                                        isActive
                                                            ? 'text-foreground '
                                                            : ''
                                                    }`}
                                                >
                                                    {t(title)}
                                                </span>
                                            </Link>
                                        );
                                    }
                                )}
                            </nav>
                            <nav className="mt-auto flex flex-col gap-4 px-2 py-5 text-lg font-medium">
                                <div>
                                    <ThemeSwitcher hasText />
                                </div>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <LogOutIcon className="h-5 w-5 transition-all" />
                                    Sair
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    );
}

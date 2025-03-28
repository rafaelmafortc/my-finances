'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { LogOutIcon, Menu, PiggyBank, Settings } from 'lucide-react';
import { signOut } from 'firebase/auth';

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { navbarItems } from '@/lib/navbar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('navbar');

    const [open, setOpen] = useState(false);

    const logout = async () => {
        try {
            await signOut(auth);

            router.push('/login');
        } catch (err) {
            console.error('error logout function', err);
        }
    };

    return (
        <div className="flex w-full flex-col bg-muted/40">
            {/* PC */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-sidebar sm:flex flex-col">
                <div className="flex flex-col items-center p-2">
                    <Link href="/" prefetch={false}>
                        <PiggyBank className={'h-8 w-8 '} />
                    </Link>
                    <span className="sr-only">MyFinances</span>
                </div>
                <nav className="absolute inset-0 m-auto h-1/2 flex flex-col items-center gap-5 px-2 py-5 flex-1 justify-center">
                    <TooltipProvider>
                        {navbarItems.map(
                            ({ id, title, href, color, icon: Icon }) => {
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
                                                        className={`h-5 w-5 ${!isActive ? color : ''}`}
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
                            }
                        )}
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-5 px-2 py-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Settings
                                className={
                                    'h-5 w-5 text-muted-foreground hover:text-foreground transition-all'
                                }
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" side="top">
                            <DropdownMenuLabel>
                                {t('settings')}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <LanguageSwitcher hasText />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ThemeToggle hasText />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button
                                        onClick={logout}
                                        variant={'static'}
                                        className="p-2 group w-full flex justify-start"
                                    >
                                        <div className="flex items-center gap-5 text-primary">
                                            <LogOutIcon className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                                {t('logout')}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </aside>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header
                    className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static 
                sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
                >
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <div className="flex justify-between w-100">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="sm:hidden"
                                    onClick={() => setOpen(true)}
                                >
                                    <Menu className="w-5 h-5" />
                                    <span className="sr-only">
                                        {t('open_close')}
                                    </span>
                                </Button>
                                <div>
                                    <Link href="/" prefetch={false}>
                                        <PiggyBank className={'h-8 w-8 '} />
                                    </Link>
                                    <span className="sr-only">MyFinances</span>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent
                            className="sm:max-w-x bg-sidebar"
                            side="left"
                        >
                            <SheetTitle></SheetTitle>
                            <SheetDescription className="hidden"></SheetDescription>
                            <nav className="grid gap-6">
                                {navbarItems.map(
                                    ({
                                        id,
                                        title,
                                        href,
                                        color,
                                        icon: Icon,
                                    }) => {
                                        const isActive = pathname === href;
                                        return (
                                            <Link
                                                key={id}
                                                href={href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 px-2.5 text-muted-foreground hover:text-foreground"
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
                                                        className={`h-5 w-5 ${!isActive ? color : ''}`}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-base font-medium transition-all ${
                                                        isActive
                                                            ? 'text-foreground font-bold'
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <div
                                                className={`h-9 w-9 flex items-center justify-center transition-all`}
                                            >
                                                <Settings
                                                    className={`h-5 w-5`}
                                                />
                                            </div>
                                            <span
                                                className={`text-base font-medium transition-all`}
                                            >
                                                {t('settings')}
                                            </span>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        side="top"
                                        align="start"
                                    >
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <LanguageSwitcher hasText />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ThemeToggle hasText />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Button
                                                    onClick={logout}
                                                    variant={'static'}
                                                    className="p-2 group flex justify-start w-full"
                                                >
                                                    <div className="flex items-center gap-5 text-muted-foreground group-hover:text-foreground transition-colors">
                                                        <LogOutIcon />
                                                        <span
                                                            className={`text-sm font-medium`}
                                                        >
                                                            {t('logout')}
                                                        </span>
                                                    </div>
                                                </Button>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    );
}

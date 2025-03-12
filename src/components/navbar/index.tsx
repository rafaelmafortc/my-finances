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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOutIcon, Menu } from 'lucide-react';
import { navbarItems } from '@/utils/navbar';
import { ModeToggle } from '@/components/theme-switcher';

export function Navbar() {
    return (
        <div className="flex w-full flex-col bg-muted/40">
            {/* PC */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-5 px-2 py-5">
                    <TooltipProvider>
                        {navbarItems.map(
                            ({ id, title, href, icon: Icon, color }) => (
                                <Tooltip key={id}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={href}
                                            key={id}
                                            className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
                                            prefetch={false}
                                        >
                                            <Icon
                                                className={`h-5 w-5 transition-all ${color}`}
                                            />
                                            <span className="sr-only">
                                                {title}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {title}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        )}
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-5 px-2 py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <ModeToggle />
                                    <span className="sr-only">
                                        Alterar tema
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Alterar tema
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
                                    prefetch={false}
                                >
                                    <LogOutIcon className="h-5 w-5 transition-all" />
                                    <span className="sr-only">Sair</span>
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
                            <SheetTitle className="p-2 px-2.5 text-2xl text-blue-800">
                                MyFinances
                            </SheetTitle>
                            <nav className="grid gap-6 text-lg font-medium">
                                {navbarItems.map(
                                    ({
                                        id,
                                        title,
                                        href,
                                        icon: Icon,
                                        color,
                                    }) => (
                                        <Link
                                            key={id}
                                            href={href}
                                            className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
                                            prefetch={false}
                                        >
                                            <Icon
                                                className={`h-5 w-5 transition-all ${color}`}
                                            />
                                            {title}
                                        </Link>
                                    )
                                )}
                            </nav>
                            <nav className="mt-auto flex flex-col gap-4 px-2 py-5">
                                <div>
                                    <ModeToggle hasText />
                                </div>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-primary hover:text-foreground"
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

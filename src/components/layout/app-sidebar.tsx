'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogOut, PiggyBank, User } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userLabel = session?.user?.email ?? session?.user?.name ?? 'Usuário';
  const initial = (userLabel.trim().charAt(0) || '?').toUpperCase();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-30 h-screen w-10 flex-col border-r border-border bg-card">
        <div className="p-1.5 pt-2">
          <Link
            prefetch
            href={'/'}
            className={
              'flex items-center justify-center rounded-md transition-colors text-muted-foreground'
            }
          >
            <PiggyBank className="text-foreground size-5" />
            <span className="sr-only">myFinances</span>
          </Link>
        </div>

        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-1 flex-col items-center justify-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      prefetch
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center rounded-md transition-colors p-2',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      )}
                    >
                      <item.icon className="size-4" />
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>

        <div className="p-1.5 pb-4">
          <DropdownMenu modal={false}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Avatar className="size-7 rounded-lg border-none">
                    <AvatarFallback className="rounded-lg bg-primary/20 font-semibold text-primary text-sm">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Conta</TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={4}
              className="min-w-56 rounded-lg"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg border-none">
                    <AvatarFallback className="rounded-lg bg-primary/20 font-semibold text-primary text-sm">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-smaller">{userLabel}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                variant="destructive"
              >
                <LogOut />
                Deslogar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-card p-2 shadow-lg"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              prefetch
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <item.icon className="size-4" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground">
              <User className="size-4" />
              <span className="text-xs">Conta</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            sideOffset={4}
            className="min-w-56 rounded-lg mb-2"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg border-none">
                  <AvatarFallback className="rounded-lg bg-primary/20 font-semibold text-primary text-sm">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-smaller">{userLabel}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="destructive"
            >
              <LogOut />
              Deslogar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}

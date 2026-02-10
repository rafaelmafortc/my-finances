'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogOut, PiggyBank } from 'lucide-react';

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
          <Link
            prefetch
            href={'/login'}
            className={
              'flex items-center justify-center rounded-md transition-colors text-muted-foreground'
            }
          >
            <LogOut className="text-destructive size-4" />
            <span className="sr-only">Sair</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-border bg-card px-2">
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
        <Link
          prefetch
          key="logout"
          href={'/login'}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <LogOut className="size-4" />
          <span className="text-xs">Sair</span>
        </Link>
      </nav>
    </>
  );
}

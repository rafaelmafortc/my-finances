'use client';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, subtitle, actions, children }: Props) {
  return (
    <div className="flex-1 w-full min-w-0">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 w-full">
        <header className="mb-6 sm:mb-8 flex flex-col gap-4 sm:items-start md:flex-row md:items-center md:justify-between">
          <div className="w-full sm:w-auto min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight break-words">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto md:gap-3">
              {actions}
            </div>
          )}
        </header>

        <main className="flex-1 space-y-4 sm:space-y-6 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

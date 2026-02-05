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
    <div className="flex-1">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {actions}
            </div>
          )}
        </header>

        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}

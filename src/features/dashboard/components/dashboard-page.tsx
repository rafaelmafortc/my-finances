'use client';

import { useMemo } from 'react';

import { PeriodFilter } from '@/components/layout/period-filter';
import { PageShell } from '@/components/layout/page-shell';
import { usePeriodFilter } from '@/hooks/use-period-filter';
import type { Transaction } from '@/features/statement';

import { EmergencyReserveCard } from './emergency-reserve-card';
import { ExpensesByCategory } from './expenses-by-category';
import { PeriodSummary } from './period-summary';

type DashboardPageProps = {
  transactions: Transaction[];
};

export function DashboardPage({ transactions }: DashboardPageProps) {
  const { month, year, setMonth, setYear } = usePeriodFilter();

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    for (const t of transactions) {
      const d = new Date(t.date);
      if (!Number.isNaN(d.getTime())) {
        years.add(d.getFullYear());
      }
    }

    if (years.size === 0) {
      years.add(new Date().getFullYear());
    }

    return Array.from(years).sort((a, b) => a - b);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const y = Number(year);
    const m = Number(month);

    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [transactions, year, month]);

  const actions = (
    <PeriodFilter
      month={month}
      year={year}
      availableYears={availableYears}
      onMonthChange={setMonth}
      onYearChange={setYear}
    />
  );

  return (
    <PageShell
      title="Dashboard"
      subtitle="Visão geral das suas finanças"
      actions={actions}
    >
      <PeriodSummary transactions={filteredTransactions} />
      <EmergencyReserveCard transactions={transactions} />
      <ExpensesByCategory transactions={filteredTransactions} />
    </PageShell>
  );
}

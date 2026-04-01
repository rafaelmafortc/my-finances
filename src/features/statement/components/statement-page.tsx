'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { PeriodFilter } from '@/components/layout/period-filter';
import { PageShell } from '@/components/layout/page-shell';
import { usePeriodFilter } from '@/hooks/use-period-filter';
import type { Category } from '@/features/categories';

import { getDayChecks } from '../actions/day-check';
import type { DayCheck } from '../types/day-check';
import type { Transaction } from '../types/transaction';
import { TransactionsTable } from './transactions-table';

type StatementPageProps = {
  transactions: Transaction[];
  categories: Category[];
  initialDayChecks: DayCheck[];
};

export function StatementPage({
  transactions,
  categories,
  initialDayChecks,
}: StatementPageProps) {
  const { month, year, setMonth, setYear } = usePeriodFilter();
  const [dayChecks, setDayChecks] = useState<DayCheck[]>(initialDayChecks);

  const refreshDayChecks = useCallback(async () => {
    const checks = await getDayChecks(Number(year), Number(month));
    setDayChecks(checks);
  }, [year, month]);

  useEffect(() => {
    refreshDayChecks();
  }, [refreshDayChecks]);

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
      title="Extrato"
      subtitle="Acompanhe suas receitas e despesas mensais"
      actions={actions}
    >
      <TransactionsTable
        transactions={filteredTransactions}
        categories={categories}
        selectedMonth={month}
        selectedYear={year}
        dayChecks={dayChecks}
        onDayCheckToggled={refreshDayChecks}
      />
    </PageShell>
  );
}

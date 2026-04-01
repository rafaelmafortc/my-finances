'use client';

import { useMemo, useState } from 'react';

import { PageShell } from '@/components/layout/page-shell';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MONTHS } from '@/constants/months';
import type { Transaction } from '@/features/statement';

import { EmergencyReserveCard } from './emergency-reserve-card';
import { ExpensesByCategory } from './expenses-by-category';
import { PeriodSummary } from './period-summary';

type DashboardPageProps = {
  transactions: Transaction[];
};

function getLatestTransactionDate(transactions: Transaction[]): Date | null {
  if (transactions.length === 0) return null;

  return transactions.reduce((latest, current) => {
    const latestDate = new Date(latest.date);
    const currentDate = new Date(current.date);
    return currentDate > latestDate ? current : latest;
  }).date;
}

export function DashboardPage({ transactions }: DashboardPageProps) {
  const now = new Date();

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    for (const t of transactions) {
      const d = new Date(t.date);
      if (!Number.isNaN(d.getTime())) {
        years.add(d.getFullYear());
      }
    }

    if (years.size === 0) {
      years.add(now.getFullYear());
    }

    return Array.from(years).sort((a, b) => a - b);
  }, [transactions, now]);

  const latestDate = useMemo(
    () => getLatestTransactionDate(transactions) ?? now,
    [transactions, now]
  );

  const [selectedYear, setSelectedYear] = useState(
    latestDate.getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    latestDate.getMonth().toString()
  );

  const filteredTransactions = useMemo(() => {
    const year = Number(selectedYear);
    const month = Number(selectedMonth);

    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, selectedYear, selectedMonth]);

  const actions = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <Select
        value={selectedMonth}
        onValueChange={(value) => setSelectedMonth(value)}
      >
        <SelectTrigger size="sm" className="w-full sm:w-auto">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedYear}
        onValueChange={(value) => setSelectedYear(value)}
      >
        <SelectTrigger size="sm" className="w-full sm:w-auto">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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

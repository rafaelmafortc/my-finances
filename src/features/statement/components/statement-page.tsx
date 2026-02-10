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
import type { Category } from '@/features/categories';

import type { Transaction } from '../types/transaction';
import { ExpensesByCategory } from './expenses-by-category';
import { PeriodSummary } from './period-summary';
import { TransactionsTable } from './transactions-table';

const MONTHS = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
] as const;

type StatementPageProps = {
  transactions: Transaction[];
  categories: Category[];
};

function getLatestTransactionDate(transactions: Transaction[]): Date | null {
  if (transactions.length === 0) return null;

  return transactions.reduce((latest, current) => {
    const latestDate = new Date(latest.date);
    const currentDate = new Date(current.date);
    return currentDate > latestDate ? current : latest;
  }).date;
}

export function StatementPage({
  transactions,
  categories,
}: StatementPageProps) {
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
      title="Extrato"
      subtitle="Acompanhe suas receitas e despesas mensais"
      actions={actions}
    >
      <PeriodSummary transactions={filteredTransactions} />
      <ExpensesByCategory
        transactions={filteredTransactions}
        categories={categories}
      />
      <TransactionsTable
        transactions={filteredTransactions}
        categories={categories}
        currentYear={Number(selectedYear)}
        currentMonth={Number(selectedMonth)}
      />
    </PageShell>
  );
}

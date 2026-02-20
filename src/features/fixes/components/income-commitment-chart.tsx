'use client';

import { useMemo } from 'react';

import { HalfDonutChart } from '@/components/charts/half-donut-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyBR } from '@/utils/format';

import type { FixedTransaction } from '../types/fixed-transaction';

type IncomeCommitmentChartProps = {
  fixedTransactions: FixedTransaction[];
};

export function IncomeCommitmentChart({
  fixedTransactions,
}: IncomeCommitmentChartProps) {
  const { totalIncome, totalExpenses, percentage, available } = useMemo(() => {
    const income = fixedTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + Number(t.value), 0);

    const expenses = fixedTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + Number(t.value), 0);

    const total = income;
    const pct = total > 0 ? (expenses / total) * 100 : 0;
    const avail = income - expenses;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      percentage: pct,
      available: avail,
    };
  }, [fixedTransactions]);

  const chartData = useMemo(() => {
    return [
      {
        name: 'Despesas',
        value: totalExpenses,
        color: 'var(--destructive)',
      },
      {
        name: 'Receitas',
        value: available,
        color: 'var(--success)',
      },
    ].filter((d) => d.value > 0);
  }, [totalExpenses, available]);

  if (totalIncome === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comprometimento de Renda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[280px] items-center justify-center text-muted-foreground">
            Nenhuma receita fixa cadastrada
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprometimento de Renda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <HalfDonutChart
            data={chartData}
            total={totalIncome}
            centerLabel={() => `${percentage.toFixed(0)}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

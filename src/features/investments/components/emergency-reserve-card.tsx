'use client';

import { useMemo } from 'react';

import { FileOutput, Shield } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/features/statement';
import { formatCurrencyBR } from '@/utils/format';

type MonthlyExpense = {
  month: number;
  year: number;
  total: number;
};

function getLast3MonthsExpenses(transactions: Transaction[]): MonthlyExpense[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const months: MonthlyExpense[] = [];
  for (let i = 1; i <= 3; i++) {
    let month = currentMonth - i;
    let year = currentYear;

    if (month < 0) {
      month += 12;
      year -= 1;
    }

    months.push({ month, year, total: 0 });
  }

  const expenses = transactions.filter((t) => t.type === 'EXPENSE');

  for (const expense of expenses) {
    const date = new Date(expense.date);
    const expenseMonth = date.getMonth();
    const expenseYear = date.getFullYear();

    const monthIndex = months.findIndex(
      (m) => m.month === expenseMonth && m.year === expenseYear
    );

    if (monthIndex !== -1) {
      months[monthIndex].total += Number(expense.value);
    }
  }

  return months.reverse();
}

export function EmergencyReserveCard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const monthlyExpenses = useMemo(
    () => getLast3MonthsExpenses(transactions),
    [transactions]
  );

  const monthsWithExpenses = monthlyExpenses.filter((m) => m.total > 0);

  const averageExpense =
    monthsWithExpenses.length > 0
      ? monthsWithExpenses.reduce((acc, m) => acc + m.total, 0) /
        monthsWithExpenses.length
      : 0;

  const idealReserve = averageExpense * 6;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserva de Emergência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <FileOutput className="size-4 text-destructive" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Gastos Médios (3 Meses)
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums">
                R$ {formatCurrencyBR(averageExpense)}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {monthlyExpenses.map((month) => (
                  <span
                    key={`${month.year}-${month.month}`}
                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    R$ {formatCurrencyBR(month.total)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-success/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Shield className="size-4 text-success" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Reserva Ideal (6X)
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums text-success">
                R$ {formatCurrencyBR(idealReserve)}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                6 x R$ {formatCurrencyBR(averageExpense)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

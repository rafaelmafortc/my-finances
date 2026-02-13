'use client';

import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrencyBR } from '@/lib/format';

import type { Transaction } from '../types/transaction';

function sumByType(transactions: Transaction[], type: 'INCOME' | 'EXPENSE') {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + Number(t.value), 0);
}

export function PeriodSummary({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const totalIncome = sumByType(transactions, 'INCOME');
  const totalExpenses = sumByType(transactions, 'EXPENSE');
  const result = totalIncome - totalExpenses;

  let incomePct = 0;
  let expensePct = 0;
  let rawExpensePct = 0;

  if (totalIncome > 0) {
    rawExpensePct = (totalExpenses / totalIncome) * 100;
    const clampedExpensePct =
      rawExpensePct < 0 ? 0 : rawExpensePct > 100 ? 100 : rawExpensePct;
    expensePct = clampedExpensePct;
    incomePct = 100 - clampedExpensePct;
  } else if (totalExpenses > 0) {
    expensePct = 100;
    incomePct = 0;
    rawExpensePct = 100;
  }

  const showHighExpenseWarning = expensePct > 75;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Período</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <ArrowUpCircle className="size-4 text-success" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Receitas
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums">
                R$ {formatCurrencyBR(totalIncome)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <ArrowDownCircle
                className="size-4 text-destructive"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Despesas
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums">
                R$ {formatCurrencyBR(totalExpenses)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                result >= 0 ? 'bg-success/10' : 'bg-destructive/10'
              }`}
            >
              <TrendingUp
                className={`size-4 ${result >= 0 ? 'text-success' : 'text-destructive'}`}
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Resultado
              </span>
              <span
                className={`mt-0.5 block text-base font-semibold tabular-nums ${
                  result >= 0 ? 'text-success' : 'text-destructive'
                }`}
              >
                R$ {formatCurrencyBR(result)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="bg-muted flex h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-success transition-[width]"
              style={{ width: `${incomePct}%` }}
              role="progressbar"
              aria-valuenow={incomePct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            <div
              className="bg-destructive transition-[width]"
              style={{ width: `${expensePct}%` }}
              role="progressbar"
              aria-valuenow={expensePct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex gap-3 justify-between text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5">
              <span className="bg-success size-1.5 rounded-full" />
              {incomePct.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-destructive size-1.5 rounded-full" />
              {expensePct.toFixed(1)}%
            </span>
          </div>
          {showHighExpenseWarning && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 mt-4 text-xs text-warning">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <div className="flex-1">
                <span className="font-medium block sm:inline">
                  Despesas em nível de alerta.{' '}
                </span>
                <span className="font-base">
                  Idealmente, tente manter suas despesas abaixo de 75% das
                  receitas para ter margem para investimentos e imprevistos.
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

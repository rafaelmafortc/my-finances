'use client';

import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const total = totalIncome + totalExpenses;
  const incomePct = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePct = total > 0 ? (totalExpenses / total) * 100 : 0;

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
              <span className="mt-0.5 block text-base font-semibold tabular-nums text-destructive">
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
        </div>
      </CardContent>
    </Card>
  );
}

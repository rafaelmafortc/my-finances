'use client';

import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyBR } from '@/utils/format';

import type { FixedTransaction } from '../types/fixed-transaction';

function sumByType(
  fixedTransactions: FixedTransaction[],
  type: 'INCOME' | 'EXPENSE',
) {
  return fixedTransactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + Number(t.value), 0);
}

export function FixedSummary({
  fixedTransactions,
}: {
  fixedTransactions: FixedTransaction[];
}) {
  const totalIncome = sumByType(fixedTransactions, 'INCOME');
  const totalExpenses = sumByType(fixedTransactions, 'EXPENSE');
  
  // Meta: 30% da renda para saídas fixas
  const targetExpensePercentage = 0.3;
  const targetExpenses = totalIncome * targetExpensePercentage;
  
  // Margem para saída: quanto pode adicionar para chegar a 30%
  const marginForExpenses = targetExpenses - totalExpenses;
  
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const showHighCommitmentWarning = expensePercentage > 30;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo dos Fixos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-success/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <ArrowUpCircle className="size-4 text-success" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Entrada
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
                Saída
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums">
                R$ {formatCurrencyBR(totalExpenses)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Wallet className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                Margem para saída (30%)
              </span>
              <span className="mt-0.5 block text-base font-semibold tabular-nums">
                R${' '}
                {formatCurrencyBR(marginForExpenses >= 0 ? marginForExpenses : 0)}
              </span>
            </div>
          </div>
        </div>

        {showHighCommitmentWarning && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            <div className="flex-1">
              <span className="font-medium block sm:inline">
                Comprometimento de renda elevado.{' '}
              </span>
              <span className="font-base">
                Idealmente, tente manter seus gastos fixos abaixo de 30% da
                sua renda para ter margem suficiente para investimentos, lazer
                e imprevistos.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

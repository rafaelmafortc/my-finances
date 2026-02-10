'use client';

import { useMemo, useState } from 'react';

import { ArrowLeft, Plus } from 'lucide-react';

import {
  PieChart,
  type PieChartDataItem,
  getPieChartColor,
} from '@/components/charts/pie-chart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { Category } from '../types/category';
import type { Transaction } from '../types/transaction';

type CategoryExpense = PieChartDataItem & {
  subcategories?: PieChartDataItem[];
};

function buildExpensesData(transactions: Transaction[]): CategoryExpense[] {
  const expenses = transactions.filter((t) => t.type === 'EXPENSE');
  const byCategory = new Map<
    string,
    { value: number; items: { name: string; value: number }[] }
  >();

  for (const t of expenses) {
    const name = t.categoryName || 'Outros';
    const value = Number(t.value);
    const existing = byCategory.get(name);
    if (existing) {
      existing.value += value;
      existing.items.push({ name: t.description, value });
    } else {
      byCategory.set(name, {
        value,
        items: [{ name: t.description, value }],
      });
    }
  }

  return Array.from(byCategory.entries()).map(([name, { value, items }]) => ({
    name,
    value,
    subcategories: items,
  }));
}

export function ExpensesByCategory({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryExpense | null>(null);

  const expensesData = useMemo(
    () => buildExpensesData(transactions),
    [transactions]
  );

  const currentData = selectedCategory?.subcategories ?? expensesData;
  const total = currentData.reduce((acc, exp) => acc + exp.value, 0);

  const handleItemClick = (item: PieChartDataItem, index: number) => {
    if (!selectedCategory) {
      const category = expensesData[index];
      if (
        category &&
        category.subcategories &&
        category.subcategories.length > 0
      ) {
        setSelectedCategory(category);
      }
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (expensesData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between h-4">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleBack}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 size-4" />
              Voltar
            </Button>
          )}
          <CardTitle>
            {selectedCategory ? selectedCategory.name : 'Gastos por Categoria'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <PieChart
              data={currentData}
              total={total}
              onSegmentClick={selectedCategory ? undefined : handleItemClick}
            />
          </div>

          <div className="flex flex-col justify-center space-y-0">
            {currentData.map((expense, index) => {
              const isCategory =
                !selectedCategory &&
                expensesData[index]?.subcategories &&
                (expensesData[index].subcategories?.length ?? 0) > 0;

              return (
                <div
                  key={`${expense.name}-${index}`}
                  className={`flex items-center justify-between border-b border-border py-2 last:border-0 ${
                    isCategory
                      ? '-mx-2 cursor-pointer rounded px-2 transition-colors hover:bg-muted/30'
                      : ''
                  }`}
                  onClick={() => isCategory && handleItemClick(expense, index)}
                  onKeyDown={(e) => {
                    if (isCategory && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleItemClick(expense, index);
                    }
                  }}
                  role={isCategory ? 'button' : undefined}
                  tabIndex={isCategory ? 0 : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor: getPieChartColor(index),
                      }}
                    />
                    <span className="text-sm text-foreground">
                      {expense.name}
                    </span>
                    {!selectedCategory &&
                      expensesData[index]?.subcategories && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {expensesData[index].subcategories?.length} itens
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">
                      R$ {expense.value.toLocaleString('pt-BR')}
                    </span>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {total > 0
                        ? ((expense.value / total) * 100).toFixed(1)
                        : '0'}
                      %
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="text-sm font-semibold text-foreground">
                R$ {total.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

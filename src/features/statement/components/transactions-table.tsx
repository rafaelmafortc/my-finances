'use client';

import { Fragment, useMemo, useState } from 'react';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Category } from '@/features/categories';
import { cn } from '@/lib/utils';
import { formatCurrencyWithSign } from '@/utils/format';

import { toggleDayCheck } from '../actions/day-check';
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../actions/transaction';
import type { DayCheck } from '../types/day-check';
import type { Transaction } from '../types/transaction';
import { TransactionDialog } from './transaction-dialog';

function getDateKey(d: Date): string {
  const x = new Date(d);
  return `${x.getUTCFullYear()}-${String(x.getUTCMonth() + 1).padStart(2, '0')}-${String(x.getUTCDate()).padStart(2, '0')}`;
}

function formatGroupDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

type DateGroup = {
  dateKey: string;
  label: string;
  transactions: Transaction[];
  isChecked: boolean;
};

export function TransactionsTable({
  transactions,
  categories,
  selectedMonth,
  selectedYear,
  dayChecks,
  onDayCheckToggled,
}: {
  transactions: Transaction[];
  categories: Category[];
  selectedMonth: string;
  selectedYear: string;
  dayChecks: DayCheck[];
  onDayCheckToggled: () => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<
    string | null
  >(null);
  const [applyingFixes, setApplyingFixes] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set()
  );

  const checkedDateKeys = useMemo(() => {
    return new Set(dayChecks.map((dc) => dc.date));
  }, [dayChecks]);

  const dateGroups = useMemo<DateGroup[]>(() => {
    const groupMap = new Map<string, Transaction[]>();

    for (const t of transactions) {
      const key = getDateKey(t.date);
      const group = groupMap.get(key) || [];
      group.push(t);
      groupMap.set(key, group);
    }

    return Array.from(groupMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, txns]) => ({
        dateKey,
        label: formatGroupDate(dateKey),
        transactions: txns,
        isChecked: checkedDateKeys.has(dateKey),
      }));
  }, [transactions, checkedDateKeys]);

  const toggleGroup = (dateKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  const handleToggleDayCheck = async (dateKey: string) => {
    try {
      await toggleDayCheck(dateKey);
      onDayCheckToggled();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao salvar';
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDeleteId) {
      try {
        await deleteTransaction(transactionToDeleteId);
        setDeleteDialogOpen(false);
        setTransactionToDeleteId(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro ao excluir transação';
        toast.error(errorMessage);
      }
    }
  };

  const handleApplyFixes = async () => {
    setApplyingFixes(true);
    try {
      const { applyFixedTransactionsToMonth } = await import(
        '@/features/fixes/actions/fixed-transaction'
      );
      await applyFixedTransactionsToMonth(
        Number(selectedYear),
        Number(selectedMonth)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro ao aplicar transações fixas';
      toast.error(errorMessage);
    } finally {
      setApplyingFixes(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Transações</CardTitle>
        {transactions.length > 0 && (
          <CardAction>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                size="sm"
                variant="ghost"
                icon={Calendar}
                onClick={handleApplyFixes}
                isLoading={applyingFixes}
                className="w-full sm:w-auto"
              >
                Cadastrar fixos
              </Button>
              <TransactionDialog
                categories={categories}
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Plus}
                    className="w-full sm:w-auto"
                  >
                    Nova transação
                  </Button>
                }
                onSubmit={async (data) => {
                  await createTransaction(data);
                }}
              />
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nenhuma transação</EmptyTitle>
              <EmptyDescription>
                Cadastre sua primeira transação para acompanhar receitas e
                despesas.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Calendar}
                  onClick={handleApplyFixes}
                  isLoading={applyingFixes}
                  className="w-full sm:w-auto"
                >
                  Cadastrar fixos
                </Button>
                <TransactionDialog
                  categories={categories}
                  trigger={
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Plus}
                      className="w-full sm:w-auto"
                    >
                      Nova transação
                    </Button>
                  }
                  onSubmit={async (data) => {
                    await createTransaction(data);
                  }}
                />
              </div>
            </EmptyContent>
          </Empty>
        ) : (
          <>
            {/* Mobile Grouped View */}
            <div className="md:hidden space-y-3 w-full">
              {dateGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.dateKey);
                return (
                  <div key={group.dateKey} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.dateKey)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                        group.isChecked
                          ? 'border-l-2 border-l-emerald-500 bg-emerald-500/5'
                          : 'border-border bg-muted/40 hover:bg-muted/60'
                      )}
                    >
                      <div
                        role="presentation"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            e.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={group.isChecked}
                          onCheckedChange={() =>
                            handleToggleDayCheck(group.dateKey)
                          }
                        />
                      </div>
                      <ChevronRight
                        className={cn(
                          'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                      <span
                        className={cn(
                          'flex-1 text-sm font-medium',
                          group.isChecked && 'text-muted-foreground'
                        )}
                      >
                        {group.label}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {group.transactions.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 pl-2">
                        {group.transactions.map((t) => (
                          <div
                            key={t.id}
                            className="rounded-lg border border-border bg-card p-3 space-y-3 w-full min-w-0"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {t.description}
                                </p>
                              </div>
                              <div
                                className={`text-right font-semibold shrink-0 text-sm ${
                                  t.type === 'INCOME'
                                    ? 'text-success'
                                    : 'text-destructive'
                                }`}
                              >
                                {formatCurrencyWithSign(
                                  t.value,
                                  t.type === 'INCOME'
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-muted-foreground">
                                {t.categoryName}
                              </span>
                              <span className="text-muted-foreground">·</span>
                              {t.type === 'INCOME' ? (
                                <span className="inline-flex items-center gap-1 text-success">
                                  <ArrowUpCircle className="size-3" />
                                  Entrada
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-destructive">
                                  <ArrowDownCircle className="size-3" />
                                  Saída
                                </span>
                              )}
                              {t.isFixed && (
                                <>
                                  <span className="text-muted-foreground">
                                    ·
                                  </span>
                                  <span className="text-muted-foreground">
                                    Fixo
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                              <TransactionDialog
                                categories={categories}
                                editTransaction={{
                                  id: t.id,
                                  date: new Date(t.date).toISOString(),
                                  description: t.description,
                                  categoryId: t.categoryId,
                                  type: t.type,
                                  value: String(t.value),
                                }}
                                onSubmit={async (data) => {
                                  await updateTransaction({
                                    ...data,
                                    id: t.id,
                                  });
                                }}
                                trigger={
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    <Pencil className="size-4 mr-2" />
                                    Editar
                                  </Button>
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="flex-1 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setTransactionToDeleteId(t.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="size-4 mr-2" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Grouped Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fixo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dateGroups.map((group) => {
                    const isExpanded = expandedGroups.has(group.dateKey);
                    return (
                      <Fragment key={group.dateKey}>
                        <TableRow
                          className={cn(
                            'cursor-pointer transition-colors',
                            group.isChecked
                              ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                              : 'bg-muted/40 hover:bg-muted/60'
                          )}
                          onClick={() => toggleGroup(group.dateKey)}
                        >
                          <TableCell colSpan={6} className="py-2.5">
                            <div className="flex items-center gap-3">
                              <div
                                role="presentation"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ')
                                    e.stopPropagation();
                                }}
                              >
                                <Checkbox
                                  checked={group.isChecked}
                                  onCheckedChange={() =>
                                    handleToggleDayCheck(group.dateKey)
                                  }
                                />
                              </div>
                              <ChevronRight
                                className={cn(
                                  'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                  isExpanded && 'rotate-90'
                                )}
                              />
                              <span
                                className={cn(
                                  'font-medium text-sm',
                                  group.isChecked && 'text-muted-foreground'
                                )}
                              >
                                {group.label}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                                {group.transactions.length}{' '}
                                {group.transactions.length === 1
                                  ? 'transação'
                                  : 'transações'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded &&
                          group.transactions.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{t.description}</TableCell>
                              <TableCell>{t.categoryName}</TableCell>
                              <TableCell>
                                {t.type === 'INCOME' ? (
                                  <span className="inline-flex items-center gap-1.5 text-success">
                                    <ArrowUpCircle className="size-4" />
                                    Entrada
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-destructive">
                                    <ArrowDownCircle className="size-4" />
                                    Saída
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {t.isFixed ? (
                                  <span className="text-xs text-muted-foreground">
                                    Sim
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                className={
                                  t.type === 'INCOME'
                                    ? 'text-success text-right'
                                    : 'text-destructive text-right'
                                }
                              >
                                {formatCurrencyWithSign(
                                  t.value,
                                  t.type === 'INCOME'
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <TransactionDialog
                                    categories={categories}
                                    editTransaction={{
                                      id: t.id,
                                      date: new Date(t.date).toISOString(),
                                      description: t.description,
                                      categoryId: t.categoryId,
                                      type: t.type,
                                      value: String(t.value),
                                    }}
                                    onSubmit={async (data) => {
                                      await updateTransaction({
                                        ...data,
                                        id: t.id,
                                      });
                                    }}
                                    trigger={
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label="Editar"
                                      >
                                        <Pencil className="size-4" />
                                      </Button>
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                      setTransactionToDeleteId(t.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="size-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

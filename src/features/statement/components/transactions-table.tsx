'use client';

import { useState } from 'react';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Pencil,
  Plus,
  Receipt,
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
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
import { formatCurrencyWithSign, formatDateBR } from '@/lib/format';

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../actions/transaction';
import type { Transaction } from '../types/transaction';
import { TransactionDialog } from './transaction-dialog';

export function TransactionsTable({
  transactions,
  categories,
  currentYear,
  currentMonth,
}: {
  transactions: Transaction[];
  categories: Category[];
  currentYear: number;
  currentMonth: number;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<
    string | null
  >(null);

  const [applyingFixes, setApplyingFixes] = useState(false);

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
      const { applyFixedTransactionsToMonth } =
        await import('@/features/fixes/actions/fixed-transaction');
      await applyFixedTransactionsToMonth(currentYear, currentMonth);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao aplicar transações fixas';
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
                  <Button size="sm" variant="outline" icon={Plus} className="w-full sm:w-auto">
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
                    <Button size="sm" variant="outline" icon={Plus} className="w-full sm:w-auto">
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
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 w-full">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-border bg-card p-3 sm:p-4 space-y-3 w-full min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateBR(t.date)}
                      </p>
                    </div>
                    <div
                      className={`text-right font-semibold shrink-0 ${
                        t.type === 'INCOME' ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {formatCurrencyWithSign(t.value, t.type === 'INCOME')}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{t.categoryName}</span>
                    <span className="text-muted-foreground">•</span>
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
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">Fixo</span>
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
                        await updateTransaction({ ...data, id: t.id });
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
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fixo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{formatDateBR(t.date)}</TableCell>
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
                          <span className="text-xs text-muted-foreground">Sim</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          t.type === 'INCOME'
                            ? 'text-success text-right'
                            : 'text-destructive text-right'
                        }
                      >
                        {formatCurrencyWithSign(t.value, t.type === 'INCOME')}
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
                              await updateTransaction({ ...data, id: t.id });
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

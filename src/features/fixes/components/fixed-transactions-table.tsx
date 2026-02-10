'use client';

import { useState } from 'react';

import {
  ArrowDownCircle,
  ArrowUpCircle,
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
import { formatCurrencyWithSign } from '@/lib/format';

import {
  deleteFixedTransaction,
  updateFixedTransaction,
} from '../actions/fixed-transaction';
import type { FixedTransaction } from '../types/fixed-transaction';
import { FixedTransactionDialog } from './fixed-transaction-dialog';

type FixedTransactionsTableProps = {
  fixedTransactions: FixedTransaction[];
  categories: Category[];
};

export function FixedTransactionsTable({
  fixedTransactions,
  categories,
}: FixedTransactionsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<
    string | null
  >(null);

  const handleConfirmDelete = async () => {
    if (transactionToDeleteId) {
      try {
        await deleteFixedTransaction(transactionToDeleteId);
        setDeleteDialogOpen(false);
        setTransactionToDeleteId(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao excluir transação fixa';
        toast.error(errorMessage);
      }
    }
  };

  const totalIncome = fixedTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + Number(t.value), 0);

  const totalExpenses = fixedTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.value), 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Transações Fixas</CardTitle>
        {fixedTransactions.length > 0 && (
          <CardAction>
            <FixedTransactionDialog
              categories={categories}
              trigger={
                <Button size="sm" variant="outline" icon={Plus} className="w-full sm:w-auto">
                  Nova fixa
                </Button>
              }
              onSubmit={async (data) => {
                const { createFixedTransaction } =
                  await import('../actions/fixed-transaction');
                await createFixedTransaction(data);
              }}
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {fixedTransactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nenhuma transação fixa</EmptyTitle>
              <EmptyDescription>
                Cadastre suas transações fixas para acompanhar seu
                comprometimento de renda.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <FixedTransactionDialog
                categories={categories}
                trigger={
                  <Button size="sm" variant="outline" icon={Plus}>
                    Nova fixa
                  </Button>
                }
                onSubmit={async (data) => {
                  const { createFixedTransaction } =
                    await import('../actions/fixed-transaction');
                  await createFixedTransaction(data);
                }}
              />
            </EmptyContent>
          </Empty>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 w-full">
              {fixedTransactions.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-border bg-card p-3 sm:p-4 space-y-3 w-full min-w-0"
                >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{t.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.categoryName}
                    </p>
                  </div>
                  <div
                    className={`text-right font-semibold ${
                      t.type === 'INCOME' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {formatCurrencyWithSign(t.value, t.type === 'INCOME')}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
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
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    Dia {t.dayOfMonth}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <FixedTransactionDialog
                    categories={categories}
                    editTransaction={{
                      id: t.id,
                      description: t.description,
                      categoryId: t.categoryId,
                      type: t.type,
                      value: String(t.value),
                      dayOfMonth: t.dayOfMonth,
                    }}
                    onSubmit={async (data) => {
                      await updateFixedTransaction({ ...data, id: t.id });
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
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Dia do Mês</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedTransactions.map((t) => (
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
                  <TableCell>{t.dayOfMonth}</TableCell>
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
                      <FixedTransactionDialog
                        categories={categories}
                        editTransaction={{
                          id: t.id,
                          description: t.description,
                          categoryId: t.categoryId,
                          type: t.type,
                          value: String(t.value),
                          dayOfMonth: t.dayOfMonth,
                        }}
                        onSubmit={async (data) => {
                          await updateFixedTransaction({ ...data, id: t.id });
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
            <AlertDialogTitle>Excluir transação fixa</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação fixa será removida
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

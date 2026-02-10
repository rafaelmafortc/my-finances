'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Pencil,
  Plus,
  Receipt,
  Trash2,
} from 'lucide-react';

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
import { formatCurrencyWithSign, formatDateBR } from '@/lib/format';

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../actions/transaction';
import type { Category } from '@/features/categories';
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
          error instanceof Error
            ? error.message
            : 'Erro ao excluir transação';
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações</CardTitle>
        {transactions.length > 0 && (
          <CardAction>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                icon={Calendar}
                onClick={handleApplyFixes}
                isLoading={applyingFixes}
              >
                Cadastrar fixos
              </Button>
              <TransactionDialog
                categories={categories}
                trigger={
                  <Button size="sm" variant="outline" icon={Plus}>
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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Calendar}
                  onClick={handleApplyFixes}
                  isLoading={applyingFixes}
                >
                  Cadastrar fixos
                </Button>
                <TransactionDialog
                  categories={categories}
                  trigger={
                    <Button size="sm" variant="outline" icon={Plus}>
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

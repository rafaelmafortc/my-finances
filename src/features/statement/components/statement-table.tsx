'use client';

import { useState } from 'react';

import {
  ArrowDownCircle,
  ArrowUpCircle,
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
import type { Category } from '../types/category';
import type { Transaction } from '../types/transaction';
import { TransactionDialog } from './transaction-dialog';

export function StatementTable({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<
    string | null
  >(null);

  const handleConfirmDelete = async () => {
    if (transactionToDeleteId) {
      await deleteTransaction(transactionToDeleteId);
      setDeleteDialogOpen(false);
      setTransactionToDeleteId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações</CardTitle>
        {transactions.length > 0 && (
          <CardAction>
            <TransactionDialog
              categories={categories}
              trigger={
                <Button size="sm" icon={Plus}>
                  Nova transação
                </Button>
              }
              onSubmit={async (data) => {
                await createTransaction(data);
              }}
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Receipt className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Nenhuma transação</EmptyTitle>
              <EmptyDescription>
                Cadastre sua primeira transação para acompanhar receitas e
                despesas.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <TransactionDialog
                categories={categories}
                trigger={
                  <Button size="sm" icon={Plus}>
                    Nova transação
                  </Button>
                }
                onSubmit={async (data) => {
                  await createTransaction(data);
                }}
              />
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
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
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
                  <TableCell
                    className={
                      t.type === 'INCOME'
                        ? 'text-emerald-600 dark:text-emerald-400 text-right'
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

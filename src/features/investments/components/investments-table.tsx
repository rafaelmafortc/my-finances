'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { AlertTriangle, Pencil, Plus, Trash2 } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { InvestmentClass } from '@/features/investment-classes';
import { formatCurrencyBR } from '@/lib/format';

import { deleteInvestment } from '../actions/investment';
import type { Investment } from '../types/investment';
import { InvestmentDialog } from './investment-dialog';

type InvestmentsTableProps = {
  investments: Investment[];
  investmentClasses: InvestmentClass[];
};

export function InvestmentsTable({
  investments,
  investmentClasses,
}: InvestmentsTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investmentToDeleteId, setInvestmentToDeleteId] = useState<
    string | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!investmentToDeleteId) return;

    setDeleteError(null);
    try {
      await deleteInvestment(investmentToDeleteId);
      setDeleteDialogOpen(false);
      setInvestmentToDeleteId(null);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao excluir investimento';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const totalPercentage = investments.reduce(
    (acc, inv) => acc + Number(inv.percentage),
    0
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Carteira</CardTitle>
          {investments.length > 0 && (
            <CardAction>
              <InvestmentDialog
                investmentClasses={investmentClasses}
                trigger={
                  <Button size="sm" variant="outline" icon={Plus} className="w-full sm:w-auto">
                    Novo investimento
                  </Button>
                }
              />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhum investimento</EmptyTitle>
                <EmptyDescription>
                  Cadastre seus investimentos para configurar sua carteira
                  ideal.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <InvestmentDialog
                  investmentClasses={investmentClasses}
                  trigger={
                    <Button size="sm" variant="outline" icon={Plus}>
                      Novo investimento
                    </Button>
                  }
                />
              </EmptyContent>
            </Empty>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden space-y-3 w-full">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="rounded-lg border border-border bg-card p-3 sm:p-4 space-y-3 w-full min-w-0"
                  >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{investment.product}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {investment.investmentClass?.name || 'Sem classe'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        R$ {formatCurrencyBR(Number(investment.value))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Number(investment.percentage).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <InvestmentDialog
                      investment={investment}
                      investmentClasses={investmentClasses}
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
                        setInvestmentToDeleteId(investment.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-border bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Total</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {totalPercentage.toFixed(2)}%
                    </span>
                    {Math.abs(totalPercentage - 100) > 0.01 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="size-4 text-warning" />
                        </TooltipTrigger>
                        <TooltipContent>
                          A carteira não está 100% alocada
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
              </div>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead className="text-right">%</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>{investment.product}</TableCell>
                        <TableCell>
                          {investment.investmentClass?.name || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(investment.percentage).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {formatCurrencyBR(Number(investment.value))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <InvestmentDialog
                              investment={investment}
                              investmentClasses={investmentClasses}
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
                                setInvestmentToDeleteId(investment.id);
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
                    <TableRow className="font-semibold bg-muted">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {totalPercentage.toFixed(2)}%
                          {Math.abs(totalPercentage - 100) > 0.01 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="size-4 text-warning" />
                              </TooltipTrigger>
                              <TooltipContent>
                                A carteira não está 100% alocada
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteError(null);
            setInvestmentToDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir investimento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O investimento será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-destructive text-sm px-6">{deleteError}</p>
          )}
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
    </>
  );
}

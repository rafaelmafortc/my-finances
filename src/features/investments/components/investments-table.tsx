'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { InvestmentClass } from '@/features/investment-classes';
import { formatCurrencyBR } from '@/lib/format';
import { maskCurrencyBR } from '@/lib/mask';
import { parseCurrencyBR } from '@/lib/parse';

import {
  deleteInvestment,
  getTotalPatrimony,
  updateTotalPatrimony,
} from '../actions/investment';
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
  const [totalPatrimony, setTotalPatrimony] = useState<string>('');
  const [isEditingPatrimony, setIsEditingPatrimony] = useState(false);
  const [patrimonyError, setPatrimonyError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatrimony = async () => {
      const patrimony = await getTotalPatrimony();
      if (patrimony !== null) {
        setTotalPatrimony(formatCurrencyBR(patrimony));
      }
    };
    loadPatrimony();
  }, []);

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

  const handleSavePatrimony = async () => {
    setPatrimonyError(null);
    const parsed = parseCurrencyBR(totalPatrimony);
    if (parsed < 0) {
      setPatrimonyError('Patrimônio não pode ser negativo');
      return;
    }

    try {
      await updateTotalPatrimony(parsed);
      setIsEditingPatrimony(false);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao atualizar patrimônio';
      setPatrimonyError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancelPatrimony = () => {
    setIsEditingPatrimony(false);
    setPatrimonyError(null);
    const loadPatrimony = async () => {
      const patrimony = await getTotalPatrimony();
      if (patrimony !== null) {
        setTotalPatrimony(formatCurrencyBR(patrimony));
      } else {
        setTotalPatrimony('');
      }
    };
    loadPatrimony();
  };

  const totalPercentage = investments.reduce(
    (acc, inv) => acc + Number(inv.percentage),
    0
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Carteira</CardTitle>
          <CardAction>
            <div className="flex items-center gap-2">
              {isEditingPatrimony ? (
                <>
                  <div className="flex items-center gap-2">
                    <Input
                      value={totalPatrimony}
                      onChange={(e) =>
                        setTotalPatrimony(maskCurrencyBR(e.target.value))
                      }
                      className="w-32"
                      placeholder="0,00"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSavePatrimony}
                    >
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelPatrimony}
                    >
                      Cancelar
                    </Button>
                  </div>
                  {patrimonyError && (
                    <p className="text-destructive text-xs">{patrimonyError}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Patrimônio Total:
                  </span>
                  <span className="text-sm font-medium">
                    R$ {totalPatrimony || '0,00'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsEditingPatrimony(true)}
                    aria-label="Editar patrimônio"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              )}
              <InvestmentDialog
                investmentClasses={investmentClasses}
                trigger={
                  <Button size="sm" variant="outline" icon={Plus}>
                    Novo investimento
                  </Button>
                }
              />
            </div>
          </CardAction>
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
                <TableRow className="font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    {totalPercentage.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    R${' '}
                    {formatCurrencyBR(
                      investments.reduce(
                        (acc, inv) => acc + Number(inv.value),
                        0
                      )
                    )}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
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

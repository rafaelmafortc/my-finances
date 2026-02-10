'use client';

import { useState } from 'react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { deleteInvestmentClass } from '../actions/investment-class';
import type { InvestmentClass } from '../types/investment-class';
import { InvestmentClassDialog } from './investment-class-dialog';

type InvestmentClassesTableProps = {
  investmentClasses: InvestmentClass[];
};

export function InvestmentClassesTable({
  investmentClasses,
}: InvestmentClassesTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDeleteId, setClassToDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!classToDeleteId) return;

    setDeleteError(null);
    try {
      await deleteInvestmentClass(classToDeleteId);
      setDeleteDialogOpen(false);
      setClassToDeleteId(null);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao excluir classe';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Classes de Investimento</CardTitle>
          {investmentClasses.length > 0 && (
            <CardAction>
              <InvestmentClassDialog
                trigger={
                  <Button size="sm" variant="outline" icon={Plus} className="w-full sm:w-auto">
                    Nova classe
                  </Button>
                }
              />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {investmentClasses.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma classe</EmptyTitle>
                <EmptyDescription>
                  Cadastre classes de investimento para organizar sua carteira.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <InvestmentClassDialog
                  trigger={
                    <Button size="sm" variant="outline" icon={Plus}>
                      Nova classe
                    </Button>
                  }
                />
              </EmptyContent>
            </Empty>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden space-y-3 w-full">
                {investmentClasses.map((investmentClass) => (
                  <div
                    key={investmentClass.id}
                    className="rounded-lg border border-border bg-card p-3 sm:p-4 w-full min-w-0"
                  >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{investmentClass.name}</p>
                    <div className="flex items-center gap-2">
                      <InvestmentClassDialog
                        investmentClass={investmentClass}
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
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
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setClassToDeleteId(investmentClass.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentClasses.map((investmentClass) => (
                  <TableRow key={investmentClass.id}>
                    <TableCell>{investmentClass.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <InvestmentClassDialog
                          investmentClass={investmentClass}
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
                            setClassToDeleteId(investmentClass.id);
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
      </Card>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteError(null);
            setClassToDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir classe</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A classe será removida
              permanentemente. Você só pode excluir classes que não estão sendo
              usadas em investimentos.
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

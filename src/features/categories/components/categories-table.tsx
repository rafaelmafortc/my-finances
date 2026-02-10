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

import { deleteCategory } from '../actions/category';
import type { Category } from '../types/category';
import { CategoryDialog } from './category-dialog';

type CategoriesTableProps = {
  categories: Category[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!categoryToDeleteId) return;

    setDeleteError(null);
    try {
      await deleteCategory(categoryToDeleteId);
      setDeleteDialogOpen(false);
      setCategoryToDeleteId(null);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao excluir categoria';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categorias</CardTitle>
          <CardAction>
            <CategoryDialog
              trigger={
                <Button size="sm" variant="outline" icon={Plus}>
                  Nova categoria
                </Button>
              }
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma categoria</EmptyTitle>
                <EmptyDescription>
                  Cadastre suas categorias para organizar suas transações.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CategoryDialog
                  trigger={
                    <Button size="sm" variant="outline" icon={Plus}>
                      Nova categoria
                    </Button>
                  }
                />
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CategoryDialog
                          category={category}
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
                            setCategoryToDeleteId(category.id);
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
      </Card>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteError(null);
            setCategoryToDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A categoria será removida
              permanentemente. Você só pode excluir categorias que não estão
              sendo usadas em transações ou transações fixas.
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

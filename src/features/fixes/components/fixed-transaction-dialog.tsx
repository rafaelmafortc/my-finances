'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check, CirclePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrencyBR } from '@/lib/format';
import { maskCurrencyBR } from '@/lib/mask';
import { parseCurrencyBR } from '@/lib/parse';

import { createCategory } from '@/features/statement/actions/categories';
import type { Category } from '@/features/statement/types/category';
import type {
  EditFixedTransactionForm,
  FixedTransactionFormSubmit,
  TransactionType,
} from '../types/fixed-transaction';

type Props = {
  categories: Category[];
  onSuccess?: () => void;
  trigger: React.ReactNode;
  defaultType?: TransactionType;
  editTransaction?: EditFixedTransactionForm;
  onSubmit: (data: FixedTransactionFormSubmit) => Promise<void>;
};

export function FixedTransactionDialog({
  categories,
  onSuccess,
  trigger,
  defaultType = 'EXPENSE',
  editTransaction,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState(
    editTransaction?.description ?? ''
  );
  const [categoryId, setCategoryId] = useState(
    editTransaction?.categoryId ?? categories[0]?.id ?? ''
  );
  const [type, setType] = useState<TransactionType>(
    editTransaction?.type ?? defaultType
  );
  const [value, setValue] = useState(
    editTransaction ? formatCurrencyBR(Number(editTransaction.value)) : '0,00'
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    editTransaction?.dayOfMonth?.toString() ?? '1'
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const router = useRouter();

  const isEdit = Boolean(editTransaction);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
      setIsAddingCategory(false);
    }
    if (isOpen) {
      if (editTransaction) {
        setDescription(editTransaction.description);
        setCategoryId(editTransaction.categoryId);
        setType(editTransaction.type);
        setValue(formatCurrencyBR(Number(editTransaction.value)));
        setDayOfMonth(editTransaction.dayOfMonth.toString());
      } else {
        setDescription('');
        setCategoryId(categories[0]?.id ?? '');
        setType(defaultType);
        setValue('0,00');
        setDayOfMonth('1');
        setNewCategoryName('');
        setIsAddingCategory(false);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const newId = await createCategory(newCategoryName.trim());
      setNewCategoryName('');
      setCategoryId(newId);
      setIsAddingCategory(false);
      router.refresh();
    } catch {
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError('Selecione ou cadastre uma categoria');
      return;
    }
    const day = parseInt(dayOfMonth, 10);
    if (Number.isNaN(day) || day < 1 || day > 28) {
      setError('Dia do mês deve estar entre 1 e 28');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        description,
        categoryId,
        type,
        value: String(parseCurrencyBR(value)),
        dayOfMonth: day,
      });
      if (!isEdit) {
        setDescription('');
        setCategoryId(categories[0]?.id ?? '');
        setType(defaultType);
        setValue('0,00');
        setDayOfMonth('1');
      }
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const dayOptions = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar transação fixa' : 'Nova Transação Fixa'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Dia do Mês</label>
            <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Escolha um dia entre 1 e 28 para garantir que a transação seja
              cadastrada em todos os meses
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input
              placeholder="Ex: Salário, Aluguel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoria</label>
            <div className="flex gap-2">
              {isAddingCategory ? (
                <Input
                  placeholder="Nome da categoria"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                    if (e.key === 'Escape') handleCancelAddCategory();
                  }}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <Select value={categoryId || undefined} onValueChange={setCategoryId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {isAddingCategory ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!newCategoryName.trim() || creatingCategory}
                    onClick={handleCreateCategory}
                    aria-label="Criar categoria"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCancelAddCategory}
                    aria-label="Cancelar"
                  >
                    <X className="size-4" />
                  </Button>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsAddingCategory(true)}
                      aria-label="Nova categoria"
                    >
                      <CirclePlus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nova Categoria</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as TransactionType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Valor</label>
            <Input
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(maskCurrencyBR(e.target.value))}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

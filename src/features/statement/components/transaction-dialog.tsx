'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { CalendarIcon, Check, CirclePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { formatCurrencyBR, formatDateBR } from '@/lib/format';
import { maskCurrencyBR, maskDDMMYYYY } from '@/lib/mask';
import { parseCurrencyBR, parseDDMMYYYY } from '@/lib/parse';

import { createCategory } from '@/features/categories';
import type { Category } from '@/features/categories';
import type {
  EditTransactionForm,
  TransactionFormSubmit,
  TransactionType,
} from '../types/transaction';

type Props = {
  categories: Category[];
  onSuccess?: () => void;
  trigger: React.ReactNode;
  defaultType?: TransactionType;
  editTransaction?: EditTransactionForm;
  onSubmit: (data: TransactionFormSubmit) => Promise<void>;
};

export function TransactionDialog({
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

  const todayDate = new Date();
  const todayStr = formatDateBR(todayDate);
  const initialDate = editTransaction
    ? new Date(editTransaction.date)
    : todayDate;
  const [dateValue, setDateValue] = useState<Date>(initialDate);
  const [dateInput, setDateInput] = useState(formatDateBR(initialDate));
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
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
        const d = new Date(editTransaction.date);
        setDateValue(d);
        setDateInput(formatDateBR(d));
        setDescription(editTransaction.description);
        setCategoryId(editTransaction.categoryId);
        setType(editTransaction.type);
        setValue(formatCurrencyBR(Number(editTransaction.value)));
      } else {
        setDateValue(todayDate);
        setDateInput(todayStr);
        setDescription('');
        setCategoryId(categories[0]?.id ?? '');
        setType(defaultType);
        setValue('0,00');
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
      // erro já tratado ou mostrar toast
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleDateInputChange = (value: string) => {
    const masked = maskDDMMYYYY(value);
    setDateInput(masked);
    const parsed = parseDDMMYYYY(masked);
    if (parsed) setDateValue(parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError('Selecione ou cadastre uma categoria');
      return;
    }
    const parsed = parseDDMMYYYY(dateInput);
    if (!parsed) {
      setError('Data inválida. Use DD/MM/AAAA');
      return;
    }
    setLoading(true);
    try {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      await onSubmit({
        date: `${y}-${m}-${day}`,
        description,
        categoryId,
        type,
        value: String(parseCurrencyBR(value)),
      });
      if (!isEdit) {
        setDateValue(todayDate);
        setDateInput(todayStr);
        setDescription('');
        setCategoryId(categories[0]?.id ?? '');
        setType(defaultType);
        setValue('0,00');
      }
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Data</label>
            <div className="flex gap-2">
              <Input
                placeholder="dd/mm/aaaa"
                value={dateInput}
                onChange={(e) => handleDateInputChange(e.target.value)}
                className="flex-1"
              />
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" size="icon">
                    <CalendarIcon className="size-4" />
                    <span className="sr-only">Abrir calendário</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(d) => {
                      if (d) {
                        setDateValue(d);
                        setDateInput(formatDateBR(d));
                        setDatePopoverOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                <Select
                  value={categoryId || undefined}
                  onValueChange={setCategoryId}
                >
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

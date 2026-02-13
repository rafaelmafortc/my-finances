'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Check, CirclePlus, X } from 'lucide-react';
import { toast } from 'sonner';

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
import {
  type InvestmentClass,
  createInvestmentClass,
} from '@/features/categories';

import { createInvestment, updateInvestment } from '../actions/investment';
import type { Investment } from '../types/investment';

type InvestmentDialogProps = {
  investment?: Investment;
  investmentClasses: InvestmentClass[];
  trigger: React.ReactNode;
  onSuccess?: () => void;
};

export function InvestmentDialog({
  investment,
  investmentClasses,
  trigger,
  onSuccess,
}: InvestmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState(investment?.product ?? '');
  const [percentage, setPercentage] = useState(
    investment?.percentage.toString() ?? ''
  );
  const [investmentClassId, setInvestmentClassId] = useState(
    investment?.investmentClassId ?? investmentClasses[0]?.id ?? ''
  );
  const [newClassName, setNewClassName] = useState('');
  const [creatingClass, setCreatingClass] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const router = useRouter();

  const isEdit = Boolean(investment);

  useEffect(() => {
    if (open && investment) {
      setProduct(investment.product);
      setPercentage(investment.percentage.toString());
      setInvestmentClassId(investment.investmentClassId);
    } else if (open && !isEdit) {
      setProduct('');
      setPercentage('');
      setInvestmentClassId(investmentClasses[0]?.id ?? '');
      setNewClassName('');
      setIsAddingClass(false);
    }
  }, [open, investment, isEdit]);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
      setIsAddingClass(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    setCreatingClass(true);
    try {
      const newId = await createInvestmentClass(newClassName.trim());
      setNewClassName('');
      setInvestmentClassId(newId);
      setIsAddingClass(false);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar classe';
      toast.error(errorMessage);
    } finally {
      setCreatingClass(false);
    }
  };

  const handleCancelAddClass = () => {
    setIsAddingClass(false);
    setNewClassName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!product.trim()) {
      setError('Produto é obrigatório');
      return;
    }

    if (!investmentClassId) {
      setError('Classe é obrigatória');
      return;
    }

    const percentageNum = parseFloat(percentage);
    if (
      Number.isNaN(percentageNum) ||
      percentageNum <= 0 ||
      percentageNum > 100
    ) {
      setError('Percentual deve estar entre 0 e 100');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && investment) {
        await updateInvestment({
          id: investment.id,
          product: product.trim(),
          percentage: percentageNum,
          investmentClassId,
        });
      } else {
        await createInvestment({
          product: product.trim(),
          percentage: percentageNum,
          investmentClassId,
        });
      }
      setOpen(false);
      setProduct('');
      setPercentage('');
      router.refresh();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao salvar';
      setError(errorMessage);
      toast.error(errorMessage);
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
            {isEdit ? 'Editar investimento' : 'Novo Investimento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Produto</label>
            <Input
              placeholder="Ex: SP500, QQQ, IBOV..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Classe</label>
            <div className="flex gap-2">
              {isAddingClass ? (
                <Input
                  placeholder="Nome da classe"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateClass();
                    }
                    if (e.key === 'Escape') handleCancelAddClass();
                  }}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <Select
                  value={investmentClassId || undefined}
                  onValueChange={setInvestmentClassId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentClasses.map((ic) => (
                      <SelectItem key={ic.id} value={ic.id}>
                        {ic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {isAddingClass ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!newClassName.trim() || creatingClass}
                    onClick={handleCreateClass}
                    aria-label="Criar classe"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCancelAddClass}
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
                      onClick={() => setIsAddingClass(true)}
                      aria-label="Nova classe"
                    >
                      <CirclePlus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nova Classe</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Percentual (%)</label>
            <Input
              type="number"
              placeholder="0"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              step="0.01"
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

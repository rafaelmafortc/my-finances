'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

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
  createInvestmentClass,
  updateInvestmentClass,
} from '../actions/investment-class';
import type { InvestmentClass } from '../types/investment-class';

type InvestmentClassDialogProps = {
  investmentClass?: InvestmentClass;
  trigger: React.ReactNode;
  onSuccess?: () => void;
};

export function InvestmentClassDialog({
  investmentClass,
  trigger,
  onSuccess,
}: InvestmentClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(investmentClass?.name ?? '');
  const router = useRouter();

  const isEdit = Boolean(investmentClass);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
    }
    if (isOpen && investmentClass) {
      setName(investmentClass.name);
    } else if (!isOpen && !isEdit) {
      setName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nome da classe é obrigatório');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && investmentClass) {
        await updateInvestmentClass(investmentClass.id, name.trim());
      } else {
        await createInvestmentClass(name.trim());
      }
      setOpen(false);
      setName('');
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
            {isEdit ? 'Editar classe' : 'Nova Classe de Investimento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
              placeholder="Ex: Renda Variável, Renda Fixa..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
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

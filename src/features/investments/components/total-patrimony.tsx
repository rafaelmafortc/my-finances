'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrencyBR } from '@/lib/format';
import { maskCurrencyBR } from '@/lib/mask';
import { parseCurrencyBR } from '@/lib/parse';

import { getTotalPatrimony, updateTotalPatrimony } from '../actions/investment';

export function TotalPatrimony() {
  const router = useRouter();
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

  return (
    <div className="flex items-center gap-2">
      {isEditingPatrimony ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Patrimônio Total:
            </span>
            <Input
              value={totalPatrimony}
              onChange={(e) => setTotalPatrimony(maskCurrencyBR(e.target.value))}
              className="w-32"
              placeholder="0,00"
            />
            <Button size="sm" variant="outline" onClick={handleSavePatrimony}>
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelPatrimony}>
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
    </div>
  );
}

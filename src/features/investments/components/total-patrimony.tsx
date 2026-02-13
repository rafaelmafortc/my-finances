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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      {isEditingPatrimony ? (
        <>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              Patrimônio Total:
            </span>
            <Input
              value={totalPatrimony}
              onChange={(e) =>
                setTotalPatrimony(maskCurrencyBR(e.target.value))
              }
              className="w-full sm:w-32"
              placeholder="0,00"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSavePatrimony}
                className="flex-1 sm:flex-none"
              >
                Salvar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelPatrimony}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            </div>
          </div>
          {patrimonyError && (
            <p className="text-destructive text-xs">{patrimonyError}</p>
          )}
        </>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Patrimônio Total:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium">
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
        </div>
      )}
    </div>
  );
}

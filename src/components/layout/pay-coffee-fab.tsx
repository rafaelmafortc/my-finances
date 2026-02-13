'use client';

import { useState } from 'react';

import { Coffee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PayCoffeeFab() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-6 z-40 rounded-full md:bottom-6"
          aria-label="Me pague um café"
        >
          <Coffee className="size-4" strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Me pague um café
          </DialogTitle>
          <DialogDescription className="text-sm">
            Projeto gratuito. Se quiser agradecer, escaneie o QR code com o app
            do seu banco.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-1">
          <div className="flex size-52 items-center justify-center rounded border border-border/50 bg-muted/20 p-2">
            <img
              src="/pix-key.jpg"
              alt="Chave PIX / QR code"
              className="size-full object-contain"
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Escaneie com o app do banco
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

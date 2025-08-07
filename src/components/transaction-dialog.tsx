import { useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';

export function TransactionDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button color="cian">
                <Plus />
                Adicionar transação
            </Button>
            <Dialog open={false}>
                <DialogContent className="w-full overflow-hidden p-0 gap-0 sm:max-w-1/2">
                    <div className="border-b py-2 px-4">
                        <DialogTitle className="text-lg font-semibold text-foreground">
                            Adicionar Transação
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        Adicionar ou editar uma transação
                    </DialogDescription>
                    <div className="flex h-full">
                        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                            <div></div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

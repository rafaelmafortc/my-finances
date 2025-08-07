'use client';

import React, { useState } from 'react';

import { Plus } from 'lucide-react';

import DatePicker from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function TransactionDialog() {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <Button color="cian" onClick={() => setOpen(!open)}>
                <Plus />
                Adicionar transação
            </Button>
            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent className="w-full sm:w-fit p-0 gap-0">
                    <div className="border-b py-2 px-4">
                        <DialogTitle className="text-lg font-semibold text-foreground">
                            Adicionar Transação
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        Adicionar ou editar uma transação
                    </DialogDescription>
                    <div className="flex w-full overflow-y-auto max-h-[85dvh]">
                        <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
                            <div>
                                <Label className="mb-2 block text-sm font-medium">
                                    Descrição
                                </Label>
                                <Input />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium">
                                    Valor
                                </Label>
                                <Input type="number" />
                            </div>
                            <div className="w-full">
                                <Label className="mb-2 block text-sm font-medium">
                                    Data
                                </Label>
                                <DatePicker />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium">
                                    Tipo de transação
                                </Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INCOME">
                                            Receita
                                        </SelectItem>
                                        <SelectItem value="EXPENSE">
                                            Despesa
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

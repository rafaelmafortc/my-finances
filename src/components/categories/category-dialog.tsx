'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { useCategories } from '@/hooks/use-categories';

const initialFormData: Category = {
    id: null,
    name: '',
    type: 'EXPENSE',
};

export function CategoryDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { postCategory } = useCategories();

    const [formData, setFormData] = useState<Category>(initialFormData);

    useEffect(() => {
        if (open) setFormData(initialFormData);
    }, [open]);

    const handleChangeFormData = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const submitCategory = async () => {
        if (!formData.name.trim()) {
            toast.warning('O nome é obrigatório');
            return;
        }

        try {
            await postCategory({
                name: formData.name,
                type: formData.type,
            });
            onOpenChange(false);
            toast.success('Sucesso ao salvar categoria');
        } catch {
            toast.error('Erro ao salvar categoria');
        }
    };

    return (
        <React.Fragment>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full lg:m-0 lg:max-w-1/3 p-0 gap-0">
                    <div className="border-b py-2 px-4">
                        <DialogTitle className="text-lg font-semibold text-foreground">
                            Adicionar categoria
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        Adicionar ou editar uma categoria
                    </DialogDescription>
                    <div className="flex w-full overflow-y-auto max-h-[80dvh]">
                        <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
                            <div className="w-full">
                                <Label className="mb-2 block text-sm font-medium">
                                    Descrição
                                </Label>
                                <Input
                                    value={formData?.name}
                                    onChange={(e) =>
                                        handleChangeFormData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="w-full">
                                <Label className="mb-2 block text-sm font-medium">
                                    Tipo de transação
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => {
                                        handleChangeFormData(
                                            'type',
                                            value as 'INCOME' | 'EXPENSE'
                                        );
                                    }}
                                >
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
                    <DialogFooter>
                        <div className="border-t py-2 px-4 w-full flex justify-end">
                            <Button
                                onClick={submitCategory}
                                className="text-primary bg-lime hover:bg-lime/80"
                            >
                                Salvar
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

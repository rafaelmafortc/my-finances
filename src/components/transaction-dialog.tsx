'use client';

import React, { useState } from 'react';

import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import DatePicker from '@/components/date-picker';
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

export function TransactionDialog() {
    const [open, setOpen] = useState(false);

    const { categories } = useCategories();
    const [formData, setFormData] = useState<Transaction>({
        id: null,
        description: '',
        amount: 0,
        date: new Date(),
        type: 'EXPENSE',
        isFixed: false,
        categoryId: null,
    });
    const filteredCategories = categories.filter(
        (category: Category) => category.type === formData.type
    );

    const [newCategoryName, setNewCategoryName] = useState('');

    const handleChangeFormData = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const submitTransaction = async () => {
        if (!formData.description.trim()) {
            toast.warning('A descrição é obrigatória');
            return;
        }

        if (Number(formData.amount) <= 0) {
            toast.warning('O valor deve ser maior que zero');
            return;
        }

        if (!formData.categoryId && !newCategoryName.trim()) {
            toast.warning('Selecione ou crie uma categoria');
            return;
        }

        const payload = {
            ...formData,
            newCategoryName:
                formData.categoryId === 'new' ? newCategoryName : undefined,
        };

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Erro ao criar transação');

            setFormData({
                id: null,
                description: '',
                amount: 0,
                date: new Date(),
                type: 'EXPENSE',
                isFixed: false,
                categoryId: null,
            });
            setNewCategoryName('');
            setOpen(false);
            toast.success('Sucesso ao salvar transação');
        } catch (err) {
            console.error(err);
            toast.error('Erro ao salvar transação');
        }
    };

    return (
        <React.Fragment>
            <Button
                className="text-primary bg-cian hover:bg-cian/80"
                onClick={() => setOpen(!open)}
            >
                <Plus />
                Adicionar transação
            </Button>
            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent className="w-full lg:m-0 sm:max-w-1/2 p-0 gap-0 my-2">
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
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="w-full">
                                    <Label className="mb-2 block text-sm font-medium">
                                        Descrição
                                    </Label>
                                    <Input
                                        value={formData?.description}
                                        onChange={(e) =>
                                            handleChangeFormData(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="w-full">
                                    <Label className="mb-2 block text-sm font-medium">
                                        Valor
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData?.amount}
                                        min={0}
                                        onChange={(e) =>
                                            handleChangeFormData(
                                                'amount',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="w-full">
                                    <Label className="mb-2 block text-sm font-medium">
                                        Tipo de transação
                                    </Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) =>
                                            handleChangeFormData(
                                                'type',
                                                value as 'INCOME' | 'EXPENSE'
                                            )
                                        }
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
                                <div className="w-full">
                                    <Label className="mb-2 block text-sm font-medium">
                                        Categoria
                                    </Label>
                                    {formData.categoryId === 'new' ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Digite a nova categoria"
                                                value={newCategoryName}
                                                onChange={(e) =>
                                                    setNewCategoryName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                onClick={() => {
                                                    handleChangeFormData(
                                                        'categoryId',
                                                        null
                                                    );
                                                    setNewCategoryName('');
                                                }}
                                                variant="outline"
                                            >
                                                <X className="text-red" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.categoryId ?? ''}
                                            onValueChange={(value) => {
                                                handleChangeFormData(
                                                    'categoryId',
                                                    value
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {!!filteredCategories.length &&
                                                    filteredCategories.map(
                                                        (
                                                            category: Category
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id ||
                                                                    ''
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                {!!filteredCategories.length && (
                                                    <div className="border-t my-1" />
                                                )}
                                                <SelectItem value="new">
                                                    <Plus />
                                                    Criar nova categoria
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <div className="w-full">
                                <Label className="mb-2 block text-sm font-medium">
                                    Data
                                </Label>
                                <DatePicker
                                    selected={formData?.date}
                                    onSelect={(date) =>
                                        handleChangeFormData('date', date)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="border-t py-2 px-4 w-full flex justify-end">
                            <Button
                                onClick={submitTransaction}
                                className="text-primary bg-cian hover:bg-cian/80"
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

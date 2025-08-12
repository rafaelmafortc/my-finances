'use client';

import React, { useEffect, useState } from 'react';

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
import { useTransactions } from '@/hooks/use-transactions';

const EMPTY_TRANSACTION: Transaction = {
    id: null,
    description: '',
    amount: 0,
    date: new Date(),
    type: 'EXPENSE',
    isFixed: false,
    categoryId: null,
};

export function TransactionDialog({
    open,
    onOpenChange,
    transaction,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction?: Transaction | null;
}) {
    const { postCategory, categories } = useCategories();
    const { putTransaction, postTransaction } = useTransactions();

    const [formData, setFormData] = useState<Transaction>(EMPTY_TRANSACTION);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!open) return;
        setFormData(transaction ? { ...transaction } : EMPTY_TRANSACTION);
    }, [open, transaction]);

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

        if (
            (formData.categoryId === 'new' || !formData.categoryId) &&
            !newCategoryName.trim()
        ) {
            toast.warning('Selecione ou crie uma categoria');
            return;
        }

        try {
            setLoading(true);
            let payload = { ...formData };

            if (formData.categoryId === 'new') {
                const newCategory = await postCategory({
                    name: newCategoryName,
                    type: formData.type,
                });

                payload = { ...payload, categoryId: newCategory.id };
            }

            if (formData.id) {
                await putTransaction(formData.id as string, payload);
            } else {
                await postTransaction(payload);
            }
            setNewCategoryName('');
            onOpenChange(false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full lg:m-0 sm:max-w-1/2 p-0 gap-0">
                <div className="border-b py-2 px-4">
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        {!!formData.id
                            ? 'Editar transação'
                            : 'Adicionar transação'}
                    </DialogTitle>
                </div>
                <DialogDescription className="sr-only">
                    Adicionar ou editar uma transação
                </DialogDescription>
                <div className="flex w-full overflow-y-auto max-h-[80dvh]">
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
                                    onValueChange={(value) => {
                                        handleChangeFormData(
                                            'type',
                                            value as 'INCOME' | 'EXPENSE'
                                        );
                                        handleChangeFormData(
                                            'categoryId',
                                            null
                                        );
                                        setNewCategoryName('');
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
                                                    (category: Category) => (
                                                        <SelectItem
                                                            key={category.id}
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
                            loading={loading}
                        >
                            Salvar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

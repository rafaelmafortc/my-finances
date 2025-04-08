'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/providers/currency-provider';

interface TransactionFormData {
    name: string;
    value: number;
    currency: string;
    category?: string;
}

interface TransactionDialogProps {
    type: 'income' | 'expense';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: TransactionFormData;
    onSubmit: (form: TransactionFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export function TransactionDialog({
    type,
    open,
    onOpenChange,
    initialData,
    onSubmit,
    onDelete,
}: TransactionDialogProps) {
    const t = useTranslations('dialog');
    const { currency } = useCurrency();

    const [formData, setFormData] = useState<TransactionFormData>({
        name: '',
        value: 0,
        currency,
        category: '',
    });

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                currency: initialData.currency || currency,
                category: initialData.category || '',
            });
        } else {
            setFormData({ name: '', value: 0, currency, category: '' });
        }
    }, [initialData, currency]);

    useEffect(() => {
        if (!open && !initialData) {
            setFormData({
                name: '',
                value: 0,
                currency,
                category: '',
            });
        }
    }, [open, initialData]);

    const handleChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCurrencyToggle = () => {
        setFormData((prev) => ({
            ...prev,
            currency: prev.currency === 'BRL' ? 'USD' : 'BRL',
        }));
    };

    const handleSave = async () => {
        if (!formData.name || formData.value <= 0) return;
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setDeleting(true);
        await onDelete();
        setDeleting(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] sm:ml-8">
                <DialogHeader>
                    <DialogTitle>
                        {`${initialData ? t('edit') : t('add')} ${t(type).toLowerCase()}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="name"
                            type="text"
                            placeholder={t('name')}
                            className="col-span-4"
                            value={formData.name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Button
                            variant="outline"
                            className="col-span-1"
                            onClick={handleCurrencyToggle}
                        >
                            {formData.currency}
                        </Button>
                        <Input
                            id="value"
                            type="number"
                            placeholder={t('value')}
                            className="col-span-3"
                            value={formData.value === 0 ? '' : formData.value}
                            onChange={(e) =>
                                handleChange('value', Number(e.target.value))
                            }
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    {initialData && onDelete && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="sm:w-1/4 w-full"
                        >
                            {deleting ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                t('delete')
                            )}
                        </Button>
                    )}
                    <Button onClick={handleSave} className="sm:w-1/4 w-full">
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            t('save')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

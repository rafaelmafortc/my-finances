'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/providers/currency-provider';
import { auth } from '@/lib/firebase';

interface AddCardProps {
    name: string;
    onAdd?: () => void;
}

export function AddCard({ name, onAdd }: AddCardProps) {
    const { currency } = useCurrency();
    const t = useTranslations('dialog');

    const [formData, setFormData] = useState({
        currency: currency,
        name: '',
        value: 0,
        userId: auth?.currentUser?.uid,
    });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleFormData = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChangeCurrency = () => {
        setFormData((prev) => ({
            ...prev,
            ['currency']: formData.currency === 'BRL' ? 'USD' : 'BRL',
        }));
    };

    const addIncome = async () => {
        try {
            if (!formData.name || formData.value <= 0) return;

            setLoading(true);

            const res = await fetch('/api/income', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error);
                return;
            }

            onAdd?.();
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center bg-background space-x-4 rounded-md border p-4 lg:w-1/4 w-full h-16">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
            </div>
            <div className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] sm:ml-8">
                        <DialogHeader>
                            <DialogTitle>{name}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={t('name')}
                                    className="col-span-4"
                                    onChange={(e) =>
                                        handleFormData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="col-span-1"
                                    onClick={handleChangeCurrency}
                                >
                                    {formData.currency}
                                </Button>
                                <Input
                                    id="value"
                                    type="number"
                                    placeholder={t('value')}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        handleFormData(
                                            'value',
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={addIncome}
                                className="sm:w-1/4 w-full"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    t('save')
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db, auth } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: () => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    onCreated,
}: CategoryDialogProps) {
    const t = useTranslations('dialog');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId || !name.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'categories'), {
                name: name.trim(),
                userId,
            });
            setName('');
            onCreated();
            onOpenChange(false);
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] sm:ml-8">
                <DialogHeader>
                    <DialogTitle>{t('add')} Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            className="col-span-4"
                            placeholder="Description"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
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
    );
}

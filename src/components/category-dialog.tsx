'use client';

import { useEffect, useState } from 'react';
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
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: () => void;
    initialData?: { id: string; name: string };
}

export function CategoryDialog({
    open,
    onOpenChange,
    onCreated,
    initialData,
}: CategoryDialogProps) {
    const t = useTranslations('dialog');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        setName(initialData?.name ?? '');
    }, [initialData]);

    const handleSubmit = async () => {
        if (!userId || !name.trim()) return;
        setLoading(true);

        try {
            if (initialData) {
                const ref = doc(db, 'categories', initialData.id);
                await updateDoc(ref, { name: name.trim() });
            } else {
                await addDoc(collection(db, 'categories'), {
                    name: name.trim(),
                    userId,
                });
            }
            setName('');
            onCreated();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!userId || !initialData) return;

        setLoading(true);
        try {
            const expenseQuery = query(
                collection(db, 'expenses'),
                where('userId', '==', userId),
                where('category', '==', initialData.id)
            );

            const snap = await getDocs(expenseQuery);
            const deletePromises = snap.docs.map((docItem) =>
                deleteDoc(doc(db, 'expenses', docItem.id))
            );

            await Promise.all(deletePromises);
            await deleteDoc(doc(db, 'categories', initialData.id));

            onCreated();
            onOpenChange(false);
        } catch (err) {
            console.error('Erro ao excluir categoria:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] sm:ml-8">
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? `${t('edit')} ${t('category').toLowerCase()}`
                            : `${t('add')} ${t('category').toLowerCase()}`}
                    </DialogTitle>
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
                <DialogFooter className="flex gap-2">
                    {initialData && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="sm:w-1/4 w-full"
                            disabled={loading}
                        >
                            {t('delete')}
                        </Button>
                    )}
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

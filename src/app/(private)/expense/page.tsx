'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    getDocs,
    collection,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { EditableCard } from '@/components/editable-card';
import { AddCard } from '@/components/add-card';
import { TransactionDialog } from '@/components/transaction-dialog';
import { db, auth } from '@/lib/firebase';

interface Expense {
    id: string;
    name: string;
    value: number;
    currency: string;
    userId: string;
    category: string;
}

export default function Expense() {
    const t = useTranslations('dialog');

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);

    const getExpenses = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const q = query(
            collection(db, 'expenses'),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Expense, 'id'>),
        }));
        setExpenses(data);
    };

    const handleSubmitExpense = async (form: {
        name: string;
        value: number;
        currency: string;
        category?: string;
    }) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        if (editExpense) {
            const docRef = doc(db, 'expenses', editExpense.id);
            await updateDoc(docRef, { ...form });
        } else {
            await addDoc(collection(db, 'expenses'), {
                ...form,
                userId,
            });
        }

        setModalOpen(false);
        setEditExpense(null);
        getExpenses();
    };

    const handleDeleteExpense = async () => {
        if (!editExpense) return;
        const ref = doc(db, 'expenses', editExpense.id);
        await deleteDoc(ref);
        setEditExpense(null);
        setModalOpen(false);
        getExpenses();
    };

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('expense')}>
                <PieChart data={expenses} />
                <CardFooter className="flex flex-col gap-2">
                    {expenses.map((expense) => (
                        <EditableCard
                            key={expense.id}
                            name={expense.name}
                            value={expense.value}
                            currency={expense.currency}
                            onEdit={() => {
                                setEditExpense(expense);
                                setModalOpen(true);
                            }}
                        />
                    ))}
                    <AddCard
                        name={`${t('add')} ${t('expense').toLocaleLowerCase()}`}
                        onAddClick={() => {
                            setEditExpense(null);
                            setModalOpen(true);
                        }}
                    />
                </CardFooter>
                <TransactionDialog
                    type="expense"
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    initialData={editExpense || undefined}
                    onSubmit={handleSubmitExpense}
                    onDelete={handleDeleteExpense}
                />
            </PageLayout>
        </main>
    );
}

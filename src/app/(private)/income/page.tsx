'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
    getDocs,
    collection,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
} from 'firebase/firestore';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { EditableCard } from '@/components/editable-card';
import { AddCard } from '@/components/add-card';
import { TransactionDialog } from '@/components/transaction-dialog';
import { db, auth } from '@/lib/firebase';

interface Income {
    id: string;
    name: string;
    value: number;
    currency: string;
    userId: string;
}

export default function IncomePage() {
    const t = useTranslations('dialog');

    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editIncome, setEditIncome] = useState<Income | null>(null);

    const getIncomes = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const q = query(
            collection(db, 'incomes'),
            where('userId', '==', userId),
            orderBy('value', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Income, 'id'>),
        }));
        setIncomes(data);
    };

    const handleSubmitIncome = async (form: {
        name: string;
        value: number;
        currency: string;
    }) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        if (editIncome) {
            const docRef = doc(db, 'incomes', editIncome.id);
            await updateDoc(docRef, { ...form });
        } else {
            await addDoc(collection(db, 'incomes'), {
                ...form,
                userId,
            });
        }

        setModalOpen(false);
        setEditIncome(null);
        getIncomes();
    };

    const handleDeleteIncome = async () => {
        if (!editIncome) return;
        const ref = doc(db, 'incomes', editIncome.id);
        await deleteDoc(ref);
        setEditIncome(null);
        setModalOpen(false);
        getIncomes();
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getIncomes();
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('income')}>
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <PieChart data={incomes} />
                        <CardFooter className="flex flex-col gap-2">
                            {incomes.map((income) => (
                                <EditableCard
                                    key={income.id}
                                    name={income.name}
                                    value={income.value}
                                    currency={income.currency}
                                    onEdit={() => {
                                        setEditIncome(income);
                                        setModalOpen(true);
                                    }}
                                />
                            ))}
                            <AddCard
                                name={`${t('add')} ${t('income').toLowerCase()}`}
                                onAddClick={() => {
                                    setEditIncome(null);
                                    setModalOpen(true);
                                }}
                            />
                        </CardFooter>
                    </>
                )}
                <TransactionDialog
                    type="income"
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    initialData={editIncome || undefined}
                    onSubmit={handleSubmitIncome}
                    onDelete={handleDeleteIncome}
                />
            </PageLayout>
        </main>
    );
}

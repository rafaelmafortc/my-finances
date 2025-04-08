'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    getDocs,
    query,
    where,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { EditableCard } from '@/components/editable-card';
import { AddCard } from '@/components/add-card';
import { TransactionDialog } from '@/components/transaction-dialog';
import { db, auth } from '@/lib/firebase';
import { useCurrency } from '@/providers/currency-provider';
import { convertCurrency } from '@/lib/convertCurrency';

interface Expense {
    id: string;
    name: string;
    value: number;
    currency: string;
    userId: string;
    category: string;
}

export default function Category() {
    const { id: categoryId } = useParams();
    const router = useRouter();
    const t = useTranslations('dialog');
    const { currency: globalCurrency } = useCurrency();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);

    const fetchData = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId || !categoryId || typeof categoryId !== 'string') return;

        setLoading(true);

        const expensesSnap = await getDocs(
            query(
                collection(db, 'expenses'),
                where('userId', '==', userId),
                where('category', '==', categoryId)
            )
        );

        const data = expensesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Expense, 'id'>),
        }));

        setExpenses(data);

        const catSnap = await getDocs(
            query(collection(db, 'categories'), where('userId', '==', userId))
        );

        const cat = catSnap.docs.find((d) => d.id === categoryId);
        setCategoryName(cat?.data()?.name || 'Categoria');
        setLoading(false);
    };

    const handleSubmit = async (form: {
        name: string;
        value: number;
        currency: string;
        category?: string;
    }) => {
        const userId = auth.currentUser?.uid;
        if (!userId || typeof categoryId !== 'string') return;

        if (editExpense) {
            const ref = doc(db, 'expenses', editExpense.id);
            await updateDoc(ref, { ...form, category: categoryId });
        } else {
            await addDoc(collection(db, 'expenses'), {
                ...form,
                category: categoryId,
                userId,
            });
        }

        setModalOpen(false);
        setEditExpense(null);
        fetchData();
    };

    const handleDelete = async () => {
        if (!editExpense) return;
        const ref = doc(db, 'expenses', editExpense.id);
        await deleteDoc(ref);
        setModalOpen(false);
        setEditExpense(null);
        fetchData();
    };

    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    useEffect(() => {
        const convertAll = async () => {
            const converted = await Promise.all(
                expenses.map((e) =>
                    convertCurrency(e.value, e.currency, globalCurrency)
                )
            );

            const finalData = expenses.map((e, i) => ({
                name: e.name,
                value: converted[i],
                currency: globalCurrency,
            }));

            setChartData(finalData);
        };

        if (expenses.length) convertAll();
    }, [expenses, globalCurrency]);

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout
                title={
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        {categoryName && (
                            <>
                                <button
                                    onClick={() => router.push('/expense')}
                                    className="hover:underline text-muted-foreground transition"
                                >
                                    {t('expense')}
                                </button>
                                <span className="text-muted-foreground">
                                    {'>'}
                                </span>
                                <span>{categoryName}</span>
                            </>
                        )}
                    </div>
                }
            >
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <PieChart data={chartData} />
                        <CardFooter className="flex flex-col gap-2">
                            {expenses
                                .sort((a, b) => b.value - a.value)
                                .map((expense) => (
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
                                name={`${t('add')} ${t('expense').toLowerCase()}`}
                                onAddClick={() => {
                                    setEditExpense(null);
                                    setModalOpen(true);
                                }}
                            />
                        </CardFooter>
                    </>
                )}

                <TransactionDialog
                    type="expense"
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    initialData={editExpense || undefined}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                />
            </PageLayout>
        </main>
    );
}

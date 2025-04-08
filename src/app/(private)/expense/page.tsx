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
} from 'firebase/firestore';
import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { EditableCard } from '@/components/editable-card';
import { AddCard } from '@/components/add-card';
import { TransactionDialog } from '@/components/transaction-dialog';
import { CategoryDialog } from '@/components/category-dialog';
import { db, auth } from '@/lib/firebase';
import { useCurrency } from '@/providers/currency-provider';
import { convertCurrency } from '@/lib/convertCurrency';
import { useRouter } from 'next/navigation';

interface Expense {
    id: string;
    name: string;
    value: number;
    currency: string;
    userId: string;
    category?: string;
}

interface Category {
    id: string;
    name: string;
    userId: string;
}

interface MergedItem {
    id: string;
    name: string;
    value: number;
    currency: string;
    type: 'expense' | 'category';
    data?: Expense;
    categoryData?: { id: string; name: string };
}

export default function ExpensePage() {
    const t = useTranslations('dialog');
    const { currency: globalCurrency } = useCurrency();
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [mergedItems, setMergedItems] = useState<MergedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const fetchData = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        setLoading(true);
        const [expensesSnap, categoriesSnap] = await Promise.all([
            getDocs(
                query(collection(db, 'expenses'), where('userId', '==', userId))
            ),
            getDocs(
                query(
                    collection(db, 'categories'),
                    where('userId', '==', userId)
                )
            ),
        ]);
        const expensesData = expensesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Expense, 'id'>),
        }));
        const categoriesData = categoriesSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Category, 'id'>),
        }));
        setExpenses(expensesData);
        setCategories(categoriesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const mergeAll = async () => {
            const userCurrency = globalCurrency;
            const items: MergedItem[] = [];
            for (const cat of categories) {
                const related = expenses.filter((e) => e.category === cat.id);
                const converted = await Promise.all(
                    related.map((e) =>
                        convertCurrency(e.value, e.currency, userCurrency)
                    )
                );
                const total = converted.reduce((sum, val) => sum + val, 0);
                items.push({
                    id: cat.id,
                    name: cat.name,
                    value: total,
                    currency: userCurrency,
                    type: 'category',
                    categoryData: { id: cat.id, name: cat.name },
                });
            }
            for (const expense of expenses.filter((e) => !e.category)) {
                items.push({
                    id: expense.id,
                    name: expense.name,
                    value: expense.value,
                    currency: expense.currency,
                    type: 'expense',
                    data: expense,
                });
            }
            const sorted = items.sort((a, b) => b.value - a.value);
            setMergedItems(sorted);
        };

        if (expenses.length) mergeAll();
    }, [expenses, categories, globalCurrency]);

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
        fetchData();
    };

    const handleDeleteExpense = async () => {
        if (!editExpense) return;
        const ref = doc(db, 'expenses', editExpense.id);
        await deleteDoc(ref);
        setEditExpense(null);
        setModalOpen(false);
        fetchData();
    };

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('expense')}>
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <PieChart
                            data={mergedItems.map((item) => ({
                                name: item.name,
                                value: item.value,
                                currency: item.currency,
                            }))}
                        />
                        <CardFooter className="flex flex-col gap-2">
                            {mergedItems.map((item) =>
                                item.type === 'expense' ? (
                                    <EditableCard
                                        key={item.id}
                                        name={item.name}
                                        value={item.value}
                                        currency={item.currency}
                                        onEdit={() => {
                                            if (item.data) {
                                                setEditExpense(item.data);
                                                setModalOpen(true);
                                            }
                                        }}
                                    />
                                ) : (
                                    <EditableCard
                                        key={item.id}
                                        name={item.name}
                                        value={item.value}
                                        currency={globalCurrency}
                                        onNavigate={() =>
                                            router.push(
                                                `expense/category/${item.id}`
                                            )
                                        }
                                        onEdit={() => {
                                            if (item.categoryData) {
                                                setEditCategory(
                                                    item.categoryData
                                                );
                                                setCategoryDialogOpen(true);
                                            }
                                        }}
                                    />
                                )
                            )}
                            <AddCard
                                name={`${t('add')} ${t('expense').toLowerCase()}`}
                                onAddClick={() => {
                                    setEditExpense(null);
                                    setModalOpen(true);
                                }}
                            />
                            <AddCard
                                name={`${t('add')} Category`}
                                onAddClick={() => {
                                    setEditCategory(null);
                                    setCategoryDialogOpen(true);
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
                    onSubmit={handleSubmitExpense}
                    onDelete={handleDeleteExpense}
                />
                <CategoryDialog
                    open={categoryDialogOpen}
                    onOpenChange={setCategoryDialogOpen}
                    onCreated={fetchData}
                    initialData={editCategory || undefined}
                />
            </PageLayout>
        </main>
    );
}

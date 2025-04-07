'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteDoc, updateDoc, doc } from 'firebase/firestore';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { AddCard } from '@/components/add-card';
import { CardFooter } from '@/components/ui/card';
import { db, auth } from '@/lib/firebase';
import { PieFooterCard } from '@/components/pie-footer-card';

interface Income {
    id: string;
    value: number;
    currency: string;
    name: string;
    userId: string;
}

export default function Income() {
    const t = useTranslations('income');

    const [incomes, setIncomes] = useState<Income[]>([]);

    const getIncomes = async () => {
        try {
            const userId = auth?.currentUser?.uid;
            if (!userId) return;

            const res = await fetch(`/api/income?userId=${userId}`);
            const data = await res.json();

            if (!res.ok) {
                console.error(data.error);
                return;
            }
            setIncomes(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getIncomes();
    }, []);

    const deleteIncome = async (id: string) => {
        try {
            const incomeDoc = doc(db, 'incomes', id);
            await deleteDoc(incomeDoc);
            getIncomes();
        } catch (err) {
            console.error(err);
        }
    };

    const updateIncome = async (id: string) => {
        try {
            const incomeDoc = doc(db, 'incomes', id);
            await updateDoc(incomeDoc, { description: '' });
            getIncomes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('income')}>
                <PieChart data={incomes} />
                <CardFooter className="flex flex-col gap-2">
                    {incomes.map(({ value, name, currency }) => {
                        return (
                            <PieFooterCard
                                key={name}
                                value={value}
                                name={name}
                                currency={currency}
                            />
                        );
                    })}
                    <AddCard name={t('add_income')} onAdd={getIncomes} />
                </CardFooter>
            </PageLayout>
        </main>
    );
}

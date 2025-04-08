'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

import PageLayout from '@/components/layouts/page-layout';
import PieChart from '@/components/pie-chart';
import { CardFooter } from '@/components/ui/card';
import { PieFooterCard } from '@/components/pie-footer-card';
import { db, auth } from '@/lib/firebase';
import { useCurrency } from '@/providers/currency-provider';
import { convertCurrency } from '@/lib/convertCurrency';

interface FirestoreItem {
    value: number;
    currency: string;
}

export default function Resume() {
    const t = useTranslations('navbar');
    const { currency: globalCurrency } = useCurrency();

    const [resumeData, setResumeData] = useState<
        { value: number; name: string; currency: string; color: string }[]
    >([]);
    const [loading, setLoading] = useState(false);

    const getResume = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const [incomeSnap, expenseSnap] = await Promise.all([
            getDocs(
                query(collection(db, 'incomes'), where('userId', '==', userId))
            ),
            getDocs(
                query(collection(db, 'expenses'), where('userId', '==', userId))
            ),
        ]);

        const incomeData = incomeSnap.docs.map(
            (doc) => doc.data() as FirestoreItem
        );
        const expenseData = expenseSnap.docs.map(
            (doc) => doc.data() as FirestoreItem
        );

        const convertAll = async (items: FirestoreItem[]) => {
            const converted = await Promise.all(
                items.map(async ({ value, currency }) => {
                    const convertedValue = await convertCurrency(
                        value,
                        currency,
                        globalCurrency
                    );
                    return convertedValue;
                })
            );
            return converted.reduce((sum, val) => sum + val, 0);
        };

        const [totalIncome, totalExpense] = await Promise.all([
            convertAll(incomeData),
            convertAll(expenseData),
        ]);

        const chartData = [
            {
                value: totalIncome,
                name: 'income',
                currency: globalCurrency,
                color: '#91CC75',
            },
            {
                value: totalExpense,
                name: 'expense',
                currency: globalCurrency,
                color: '#EE6666',
            },
        ];

        setResumeData(chartData);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getResume();
            setLoading(false);
        };

        fetchData();
    }, [globalCurrency]);

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('resume')}>
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <PieChart
                            data={resumeData}
                            centerText={
                                resumeData[0]?.value - resumeData[1]?.value
                            }
                        />
                        <CardFooter className="flex flex-col gap-2">
                            {resumeData.map(({ value, name, currency }) => (
                                <PieFooterCard
                                    key={name}
                                    value={value}
                                    name={t(name)}
                                    currency={currency}
                                />
                            ))}
                        </CardFooter>
                    </>
                )}
            </PageLayout>
        </main>
    );
}

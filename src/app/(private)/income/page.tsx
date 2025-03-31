'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from 'firebase/firestore';

import PageLayout from '@/components/layouts/page-layout';
import { db, auth } from '@/lib/firebase';

export default function Income() {
    const t = useTranslations('navbar');
    const incomeCollegionRef = collection(db, 'incomes');

    const [incomes, setIncomes] = useState([]);

    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState(0);

    const [newDescription, setNewDescription] = useState('');

    const getIncomes = async () => {
        try {
            const data = await getDocs(incomeCollegionRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setIncomes(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getIncomes();
    }, []);

    const onSubmit = async () => {
        try {
            await addDoc(incomeCollegionRef, {
                amount: amount,
                currency: currency,
                description: description,
                userId: auth?.currentUser?.uid,
            });

            getIncomes();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteIncome = async (id: string) => {
        try {
            const incomeDoc = doc(db, 'incomes', id);
            await deleteDoc(incomeDoc);
            getIncomes();
        } catch (err) {
            console.error(err);
        }
    };

    const updateIncome = async (id) => {
        try {
            const incomeDoc = doc(db, 'incomes', id);
            await updateDoc(incomeDoc, { description: newDescription });
            getIncomes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="flex-1 flex flex-col">
            <PageLayout title={t('income')}>
                <div>
                    <input
                        placeholder="description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        placeholder="currency"
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="amount"
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button onClick={onSubmit}>Submit</button>
                </div>
                {incomes.map((income) => (
                    <div className="p-6" key={income.description}>
                        <p>
                            {`${income.description} - ${income.currency} ${income.amount}`}
                        </p>

                        <button onClick={() => deleteIncome(income.id)}>
                            Delete income
                        </button>
                        <div>
                            <input
                                placeholder="new description"
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                            />
                            <button onClick={() => updateIncome(income.id)}>
                                update description
                            </button>
                        </div>
                    </div>
                ))}
            </PageLayout>
        </main>
    );
}

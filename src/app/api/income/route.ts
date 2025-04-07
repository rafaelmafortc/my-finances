import { NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, value, currency } = body;

        const userId = auth?.currentUser?.uid;

        if (!name || value <= 0 || !userId) {
            return NextResponse.json(
                { error: 'Dados inválidos' },
                { status: 400 }
            );
        }

        const incomeCol = collection(db, 'incomes');
        const q = query(
            incomeCol,
            where('userId', '==', userId),
            where('name', '==', name)
        );
        const existing = await getDocs(q);

        if (!existing.empty) {
            return NextResponse.json(
                { error: 'Já existe uma entrada com esse nome' },
                { status: 409 }
            );
        }

        const docRef = await addDoc(incomeCol, {
            name,
            value,
            userId,
            currency,
        });
        return NextResponse.json({ id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

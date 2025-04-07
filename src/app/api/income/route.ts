import { NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

const incomeCol = collection(db, 'incomes');

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID não informado' },
            { status: 400 }
        );
    }

    try {
        const q = query(incomeCol, where('userId', '==', userId));
        const snapshot = await getDocs(q);

        const incomes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(incomes);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, value, currency, userId } = body;

        if (!name || value <= 0 || !userId) {
            return NextResponse.json(
                { error: 'Dados inválidos' },
                { status: 400 }
            );
        }

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

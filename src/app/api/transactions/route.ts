import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function GET() {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' },
        include: { category: true },
    });

    return NextResponse.json(transactions);
}

export async function POST(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const body = await req.json();

    const { description, amount, date, type, isFixed, categoryId } = body;

    try {
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                description,
                amount: Math.abs(Number(amount)),
                date: new Date(date),
                type,
                isFixed,
                categoryId,
            },
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao criar transação' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    try {
        const result = await prisma.transaction.deleteMany({
            where: { id, userId },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (err) {
        console.error('DELETE /api/transactions/:id', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

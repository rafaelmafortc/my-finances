import { NextResponse } from 'next/server';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

const transactionSchema = z.object({
    description: z.string().min(1),
    amount: z
        .union([z.number(), z.string()])
        .transform((v) => {
            const n = typeof v === 'string' ? Number(v.replace(',', '.')) : v;
            return Math.abs(n);
        })
        .refine((n) => Number.isFinite(n), 'amount inválido'),
    date: z.coerce.date(),
    type: z.enum(['INCOME', 'EXPENSE']),
    isFixed: z.boolean().optional().default(false),
    categoryId: z.string().min(1),
});

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

    const parsed = transactionSchema.parse(body);

    try {
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                description: parsed.description,
                amount: parsed.amount,
                date: parsed.date,
                type: parsed.type,
                isFixed: parsed.isFixed,
                categoryId: parsed.categoryId,
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

export async function PUT(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = await req.json();

    const parsed = transactionSchema.parse(body);

    try {
        const updated = await prisma.transaction.update({
            where: { id, userId },
            data: {
                userId,
                description: parsed.description,
                amount: parsed.amount,
                date: parsed.date,
                type: parsed.type,
                isFixed: parsed.isFixed,
                categoryId: parsed.categoryId,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error('PUT /api/transactions/:id', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
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

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function GET(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    const where: any = { userId };

    if (month) {
        const [y, m] = month.split('-').map(Number);
        if (!y || !m || m < 1 || m > 12) {
            return NextResponse.json(
                { error: 'Parâmetro month inválido. Use YYYY-MM.' },
                { status: 400 }
            );
        }

        const start = new Date(Date.UTC(y, m - 1, 1));
        const end = new Date(Date.UTC(y, m, 1));
        where.date = { gte: start, lt: end };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true },
    });

    return NextResponse.json(transactions);
}

export async function POST(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const body = await req.json();

    const {
        description,
        amount,
        date,
        type,
        isFixed,
        categoryId,
        newCategoryName,
    } = body;

    try {
        let finalCategoryId = categoryId;

        if (categoryId === 'new' && newCategoryName) {
            const newCategory = await prisma.category.create({
                data: {
                    name: newCategoryName,
                    type,
                    userId,
                },
            });

            finalCategoryId = newCategory.id;
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                description,
                amount: Math.abs(Number(amount)),
                date: new Date(date),
                type,
                isFixed,
                categoryId: finalCategoryId,
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

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function GET() {
    const { userId, response } = await getAuthenticatedUser();

    if (!userId && response) return response;

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: {
            category: true,
        },
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
                amount: Number(amount),
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

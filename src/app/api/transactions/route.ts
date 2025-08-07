import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function GET() {
    const { userId, response } = await getAuthenticatedUser();

    if (!userId) return response;

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: {
            category: true,
        },
    });

    return NextResponse.json(transactions);
}

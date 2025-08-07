import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function GET() {
    const { userId, response } = await getAuthenticatedUser();

    if (!userId && response) return response;

    const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'desc' },
    });

    return NextResponse.json(categories);
}

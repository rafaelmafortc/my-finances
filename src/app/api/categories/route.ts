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

export async function POST(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const body = await req.json();

    const { name, type } = body;

    try {
        const category = await prisma.category.create({
            data: {
                userId,
                name,
                type,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao criar categoria' },
            { status: 500 }
        );
    }
}

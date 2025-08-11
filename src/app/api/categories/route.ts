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

export async function PUT(req: Request) {
    const { userId, response } = await getAuthenticatedUser();
    if (!userId && response) return response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const body = await req.json();

    try {
        const updated = await prisma.category.update({
            where: { id, userId },
            data: body,
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error('PUT /api/categories/:id', err);
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
        const transactionsCount = await prisma.transaction.count({
            where: { userId, categoryId: id },
        });

        if (transactionsCount > 0) {
            return NextResponse.json(
                {
                    error: 'Não é possivel deletar, existem transações cadastradas com essa categoria',
                },
                { status: 409 }
            );
        }

        const result = await prisma.category.deleteMany({
            where: { id, userId },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (err) {
        console.error('DELETE /api/categories/:id', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

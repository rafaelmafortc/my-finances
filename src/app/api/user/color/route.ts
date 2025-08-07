import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/route-service';

export async function PUT(req: Request) {
    const { userId, response } = await getAuthenticatedUser();

    if (!userId) return response;

    const { color } = await req.json();

    const validColors = [
        'blue',
        'lime',
        'yellow',
        'red',
        'cian',
        'green',
        'orange',
        'purple',
        'image',
    ] as const;

    if (!validColors.includes(color)) {
        return NextResponse.json({ error: 'Invalid color' }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: userId },
        data: { color },
    });

    return NextResponse.json({ success: true });
}

export async function GET() {
    const { userId, response } = await getAuthenticatedUser();

    if (!userId) return response;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { color: true },
    });

    return NextResponse.json({ color: user?.color ?? 'purple' });
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

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
        where: { email: session.user.email },
        data: { color },
    });

    return NextResponse.json({ success: true });
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ color: 'purple' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { color: true },
    });

    return NextResponse.json({ color: user?.color ?? 'purple' });
}

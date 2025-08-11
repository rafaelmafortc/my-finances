import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';

export async function getAuthenticatedUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
            userId: null,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            ),
        };
    }

    return { userId: session.user.id, response: null };
}

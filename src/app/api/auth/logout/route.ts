import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ success: true });

        (await cookies()).delete('token');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}

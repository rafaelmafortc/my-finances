'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUserId() {
  const session = await getSession();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  return user?.id ?? null;
}

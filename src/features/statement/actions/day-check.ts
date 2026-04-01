'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { prisma } from '@/lib/prisma';
import { parseDateOnly } from '@/utils/parse';

export async function getDayChecks(year: number, month: number) {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  const checks = await prisma.statementDayCheck.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
  });

  return checks.map((c) => {
    const d = new Date(c.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    return { date: key, checked: true as const };
  });
}

export async function toggleDayCheck(dateStr: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const date = parseDateOnly(dateStr);

  const existing = await prisma.statementDayCheck.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (existing) {
    await prisma.statementDayCheck.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.statementDayCheck.create({
      data: { userId, date },
    });
  }

  revalidatePath('/statement');
}

'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { prisma } from '@/lib/prisma';

export async function getCategories() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function createCategory(name: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nome da categoria é obrigatório');
  const category = await prisma.category.create({
    data: { name: trimmed, userId },
  });
  revalidatePath('/statement');
  return category.id;
}

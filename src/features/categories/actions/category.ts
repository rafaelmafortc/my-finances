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
  revalidatePath('/fixes');
  revalidatePath('/categories');
  return category.id;
}

export async function updateCategory(id: string, name: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nome da categoria é obrigatório');

  const category = await prisma.category.findFirst({
    where: { id, userId },
  });
  if (!category) throw new Error('Categoria não encontrada');

  await prisma.category.updateMany({
    where: { id, userId },
    data: { name: trimmed },
  });
  revalidatePath('/statement');
  revalidatePath('/fixes');
  revalidatePath('/categories');
}

export async function deleteCategory(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const category = await prisma.category.findFirst({
    where: { id, userId },
    include: {
      transactions: true,
      fixedTransactions: true,
    },
  });

  if (!category) throw new Error('Categoria não encontrada');

  if (category.transactions.length > 0) {
    throw new Error(
      'Não é possível excluir esta categoria pois ela está sendo usada em transações'
    );
  }

  if (category.fixedTransactions.length > 0) {
    throw new Error(
      'Não é possível excluir esta categoria pois ela está sendo usada em transações fixas'
    );
  }

  await prisma.category.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/statement');
  revalidatePath('/fixes');
  revalidatePath('/categories');
}

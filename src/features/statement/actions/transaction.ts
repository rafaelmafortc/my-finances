'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { parseDateOnly } from '@/lib/parse';
import { prisma } from '@/lib/prisma';

import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../types/transaction';

export async function getTransactions() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const list = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  });
  return list.map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    value: Number(t.value),
    type: t.type,
    categoryName: t.category.name,
    categoryId: t.categoryId,
  }));
}

export async function createTransaction(input: CreateTransactionInput) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const value = parseFloat(input.value.replace(',', '.').replace(/\s/g, ''));
  if (Number.isNaN(value)) throw new Error('Valor inválido');

  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId },
  });
  if (!category) throw new Error('Categoria inválida');

  await prisma.transaction.create({
    data: {
      userId,
      date: parseDateOnly(input.date),
      description: input.description.trim(),
      categoryId: input.categoryId,
      type: input.type,
      value,
    },
  });
  revalidatePath('/statement');
}

export async function updateTransaction(input: UpdateTransactionInput) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const value = parseFloat(input.value.replace(',', '.').replace(/\s/g, ''));
  if (Number.isNaN(value)) throw new Error('Valor inválido');

  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId },
  });
  if (!category) throw new Error('Categoria inválida');

  await prisma.transaction.updateMany({
    where: { id: input.id, userId },
    data: {
      date: parseDateOnly(input.date),
      description: input.description.trim(),
      categoryId: input.categoryId,
      type: input.type,
      value,
    },
  });
  revalidatePath('/statement');
}

export async function deleteTransaction(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  await prisma.transaction.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/statement');
}

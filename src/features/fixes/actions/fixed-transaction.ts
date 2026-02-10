'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { prisma } from '@/lib/prisma';

import type {
  CreateFixedTransactionInput,
  UpdateFixedTransactionInput,
} from '../types/fixed-transaction';

export async function getFixedTransactions() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const list = await prisma.fixedTransaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: [{ type: 'asc' }, { dayOfMonth: 'asc' }],
  });
  return list.map((t) => ({
    id: t.id,
    description: t.description,
    value: Number(t.value),
    type: t.type,
    categoryName: t.category.name,
    categoryId: t.categoryId,
    dayOfMonth: t.dayOfMonth,
  }));
}

export async function createFixedTransaction(
  input: CreateFixedTransactionInput
) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const value = parseFloat(input.value.replace(',', '.').replace(/\s/g, ''));
  if (Number.isNaN(value)) throw new Error('Valor inválido');

  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId },
  });
  if (!category) throw new Error('Categoria inválida');

  if (input.dayOfMonth < 1 || input.dayOfMonth > 28) {
    throw new Error('Dia do mês deve estar entre 1 e 28');
  }

  await prisma.fixedTransaction.create({
    data: {
      userId,
      description: input.description.trim(),
      categoryId: input.categoryId,
      type: input.type,
      value,
      dayOfMonth: input.dayOfMonth,
    },
  });
  revalidatePath('/fixes');
}

export async function updateFixedTransaction(
  input: UpdateFixedTransactionInput
) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const value = parseFloat(input.value.replace(',', '.').replace(/\s/g, ''));
  if (Number.isNaN(value)) throw new Error('Valor inválido');

  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId },
  });
  if (!category) throw new Error('Categoria inválida');

  if (input.dayOfMonth < 1 || input.dayOfMonth > 28) {
    throw new Error('Dia do mês deve estar entre 1 e 28');
  }

  await prisma.fixedTransaction.updateMany({
    where: { id: input.id, userId },
    data: {
      description: input.description.trim(),
      categoryId: input.categoryId,
      type: input.type,
      value,
      dayOfMonth: input.dayOfMonth,
    },
  });
  revalidatePath('/fixes');
}

export async function deleteFixedTransaction(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  await prisma.fixedTransaction.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/fixes');
}

export async function applyFixedTransactionsToMonth(
  year: number,
  month: number
) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const fixedTransactions = await prisma.fixedTransaction.findMany({
    where: { userId },
    include: { category: true },
  });

  const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  await prisma.transaction.deleteMany({
    where: {
      userId,
      isFixed: true,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const transactionsToCreate = fixedTransactions.map((fixed) => {
    const lastDayOfMonth = endDate.getUTCDate();
    const day = Math.min(fixed.dayOfMonth, lastDayOfMonth);
    const date = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
    return {
      userId,
      date,
      description: fixed.description,
      value: fixed.value,
      type: fixed.type,
      categoryId: fixed.categoryId,
      isFixed: true,
    };
  });

  if (transactionsToCreate.length > 0) {
    await prisma.transaction.createMany({
      data: transactionsToCreate,
    });
  }

  revalidatePath('/statement');
}

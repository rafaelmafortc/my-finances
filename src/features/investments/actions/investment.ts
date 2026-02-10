'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { prisma } from '@/lib/prisma';

export async function getTotalPatrimony() {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPatrimony: true },
  });
  return user?.totalPatrimony ? Number(user.totalPatrimony) : null;
}

export async function updateTotalPatrimony(totalPatrimony: number) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');
  if (totalPatrimony < 0) throw new Error('Patrimônio não pode ser negativo');

  await prisma.user.update({
    where: { id: userId },
    data: { totalPatrimony },
  });

  // Recalcular valores de todos os investimentos
  const investments = await prisma.investment.findMany({
    where: { userId },
  });

  await Promise.all(
    investments.map((investment) =>
      prisma.investment.update({
        where: { id: investment.id },
        data: {
          value: (totalPatrimony * Number(investment.percentage)) / 100,
        },
      })
    )
  );

  revalidatePath('/investments');
}

export async function getInvestments() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const investments = await prisma.investment.findMany({
    where: { userId },
    include: {
      investmentClass: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return investments.map((inv) => ({
    id: inv.id,
    product: inv.product,
    percentage: Number(inv.percentage),
    value: Number(inv.value),
    investmentClassId: inv.investmentClassId,
    userId: inv.userId,
    investmentClass: inv.investmentClass,
  }));
}

export async function createInvestment(input: {
  product: string;
  percentage: number;
  investmentClassId: string;
}) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const trimmed = input.product.trim();
  if (!trimmed) throw new Error('Produto é obrigatório');
  if (input.percentage <= 0 || input.percentage > 100) {
    throw new Error('Percentual deve estar entre 0 e 100');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPatrimony: true },
  });

  const totalPatrimony = user?.totalPatrimony ? Number(user.totalPatrimony) : 0;
  const value = (totalPatrimony * input.percentage) / 100;

  const investment = await prisma.investment.create({
    data: {
      product: trimmed,
      percentage: input.percentage,
      value,
      investmentClassId: input.investmentClassId,
      userId,
    },
    include: {
      investmentClass: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  revalidatePath('/investments');
  return investment.id;
}

export async function updateInvestment(input: {
  id: string;
  product: string;
  percentage: number;
  investmentClassId: string;
}) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const trimmed = input.product.trim();
  if (!trimmed) throw new Error('Produto é obrigatório');
  if (input.percentage <= 0 || input.percentage > 100) {
    throw new Error('Percentual deve estar entre 0 e 100');
  }

  const investment = await prisma.investment.findFirst({
    where: { id: input.id, userId },
  });
  if (!investment) throw new Error('Investimento não encontrado');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPatrimony: true },
  });

  const totalPatrimony = user?.totalPatrimony ? Number(user.totalPatrimony) : 0;
  const value = (totalPatrimony * input.percentage) / 100;

  await prisma.investment.updateMany({
    where: { id: input.id, userId },
    data: {
      product: trimmed,
      percentage: input.percentage,
      value,
      investmentClassId: input.investmentClassId,
    },
  });

  revalidatePath('/investments');
}

export async function deleteInvestment(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const investment = await prisma.investment.findFirst({
    where: { id, userId },
  });

  if (!investment) throw new Error('Investimento não encontrado');

  await prisma.investment.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/investments');
}

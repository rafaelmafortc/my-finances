'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUserId } from '@/features/auth';
import { prisma } from '@/lib/prisma';

export async function getInvestmentClasses() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  return prisma.investmentClass.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function createInvestmentClass(name: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nome da classe é obrigatório');
  const investmentClass = await prisma.investmentClass.create({
    data: { name: trimmed, userId },
  });
  revalidatePath('/investments');
  revalidatePath('/categories');
  return investmentClass.id;
}

export async function updateInvestmentClass(id: string, name: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nome da classe é obrigatório');

  const investmentClass = await prisma.investmentClass.findFirst({
    where: { id, userId },
  });
  if (!investmentClass) throw new Error('Classe não encontrada');

  await prisma.investmentClass.updateMany({
    where: { id, userId },
    data: { name: trimmed },
  });
  revalidatePath('/investments');
  revalidatePath('/categories');
}

export async function deleteInvestmentClass(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Não autorizado');

  const investmentClass = await prisma.investmentClass.findFirst({
    where: { id, userId },
    include: {
      investments: true,
    },
  });

  if (!investmentClass) throw new Error('Classe não encontrada');

  if (investmentClass.investments.length > 0) {
    throw new Error(
      'Não é possível excluir esta classe pois ela está sendo usada em investimentos'
    );
  }

  await prisma.investmentClass.deleteMany({
    where: { id, userId },
  });
  revalidatePath('/investments');
  revalidatePath('/categories');
}

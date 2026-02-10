import type { TransactionType } from '@/prisma/generated/client';

export type { TransactionType };

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  value: number;
  type: TransactionType;
  categoryName: string;
  categoryId: string;
};

export type CreateTransactionInput = {
  date: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
};

export type UpdateTransactionInput = CreateTransactionInput & { id: string };

export type TransactionFormSubmit = {
  date: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
};

export type EditTransactionForm = {
  id: string;
  date: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
};

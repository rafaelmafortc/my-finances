import type { TransactionType } from '@/prisma/generated/client';

export type { TransactionType };

export type FixedTransaction = {
  id: string;
  description: string;
  value: number;
  type: TransactionType;
  categoryName: string;
  categoryId: string;
  dayOfMonth: number;
};

export type CreateFixedTransactionInput = {
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
  dayOfMonth: number;
};

export type UpdateFixedTransactionInput = CreateFixedTransactionInput & {
  id: string;
};

export type FixedTransactionFormSubmit = {
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
  dayOfMonth: number;
};

export type EditFixedTransactionForm = {
  id: string;
  description: string;
  categoryId: string;
  type: TransactionType;
  value: string;
  dayOfMonth: number;
};

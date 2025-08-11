'use client';

import { Loader2 } from 'lucide-react';

import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { useTransactions } from '@/hooks/use-transactions';

export default function TransactionsPage() {
    const { transactions, isLoading } = useTransactions();

    return isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ) : transactions.length ? (
        <TransactionsTable />
    ) : (
        <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
            <div className="w-full max-w-md ">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xl lg:text-nowrap">
                            Nenhuma transação cadastrada
                        </p>
                        <p className="text-base text-muted-foreground">
                            Adicione sua primeira transação para começar
                        </p>
                    </div>
                    <TransactionDialog />
                </div>
            </div>
        </div>
    );
}

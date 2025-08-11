'use client';

import { Loader2 } from 'lucide-react';

import NoDataTransactionsPage from '@/components/transactions/no-data-transactions-page';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { useTransactions } from '@/hooks/use-transactions';
import { useSelectedDate } from '@/providers/selected-date-provider';

export default function TransactionsPage() {
    const { month } = useSelectedDate();

    const { transactions, isLoading } = useTransactions(month);

    return isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ) : transactions.length ? (
        <TransactionsTable />
    ) : (
        <NoDataTransactionsPage />
    );
}

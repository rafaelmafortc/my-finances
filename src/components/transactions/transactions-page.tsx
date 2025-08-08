'use client';

import NoDataTransactionsPage from '@/components/transactions/no-data-transactions-page';
import TransactionsTable from '@/components/transactions/transactions-table';
import { useTransactions } from '@/hooks/use-transactions';

export default function TransactionsPageComponent() {
    const { transactions } = useTransactions();

    return transactions.length ? (
        <TransactionsTable />
    ) : (
        <NoDataTransactionsPage />
    );
}

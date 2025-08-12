import { toast } from 'sonner';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTransactions() {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/transactions',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            keepPreviousData: true,
        }
    );

    async function postTransaction(input: TransactionInput) {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error('Erro ao criar transação');

        const created = await res.json();

        await mutate((curr: any[] = []) => [created, ...(curr ?? [])], {
            revalidate: false,
            populateCache: true,
            rollbackOnError: true,
        });

        return created;
    }

    async function putTransaction(id: string, input: TransactionInput) {
        if (!id) return;
        await mutate(
            async (current: any[] = []) => {
                const res = await fetch(`/api/transactions?id=${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input),
                });
                if (!res.ok) {
                    toast.error('Erro ao alterar transação');
                } else {
                    toast.success('Sucesso ao alterar transação');
                }
                return current;
            },
            {
                rollbackOnError: true,
                revalidate: true,
                populateCache: true,
            }
        );
    }

    async function deleteTransaction(id: string) {
        if (!id) return;
        await mutate(
            async (current: any[] = []) => {
                const res = await fetch(`/api/transactions?id=${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Erro ao deletar');
                toast.success('Sucesso ao deletar transação');
                return current.filter((t) => t.id !== id);
            },
            {
                optimisticData: (current: any[] = []) =>
                    current.filter((t) => t.id !== id),
                rollbackOnError: true,
                revalidate: true,
            }
        );
    }

    return {
        transactions: data ?? [],
        isLoading,
        isError: error,
        postTransaction,
        putTransaction,
        deleteTransaction,
    };
}

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTransactions(month?: string) {
    const key = month
        ? `/api/transactions?month=${month}`
        : '/api/transactions';
    const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 3000,
        keepPreviousData: true,
    });

    async function deleteTransaction(id: string) {
        if (!id) return;
        await mutate(
            async (current: any[] = []) => {
                const res = await fetch(`/api/transactions?id=${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Erro ao deletar');
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
        deleteTransaction,
        reloadTransactions: () => mutate(),
    };
}

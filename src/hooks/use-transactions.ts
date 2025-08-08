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

    return {
        transactions: data ?? [],
        isLoading,
        isError: error,
        reloadTransactions: () => mutate(),
    };
}

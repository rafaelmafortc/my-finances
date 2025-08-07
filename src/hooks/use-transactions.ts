import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTransactions() {
    const { data, error, isLoading } = useSWR('/api/transactions', fetcher);

    return {
        transactions: data ?? [],
        isLoading,
        isError: error,
    };
}

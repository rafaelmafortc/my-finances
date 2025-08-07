import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
    const { data, error, isLoading } = useSWR('/api/categories', fetcher);

    return {
        categories: data ?? [],
        isLoading,
        isError: error,
    };
}

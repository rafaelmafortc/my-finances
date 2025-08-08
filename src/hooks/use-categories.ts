import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/categories',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            keepPreviousData: true,
        }
    );

    async function postCategory(input: CategoryInput) {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error('Erro ao criar categoria');

        const created = await res.json();

        await mutate((curr: any[] = []) => [created, ...(curr ?? [])], {
            revalidate: false,
            populateCache: true,
            rollbackOnError: true,
        });

        return created;
    }

    return {
        categories: data ?? [],
        isLoading,
        isError: error,
        postCategory,
    };
}

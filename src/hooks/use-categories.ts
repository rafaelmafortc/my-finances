import { toast } from 'sonner';
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

    async function putCategory(id: string, input: CategoryInput) {
        if (!id) return;
        await mutate(
            async (current: any[] = []) => {
                const res = await fetch(`/api/categories?id=${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input),
                });
                if (!res.ok) {
                    toast.error('Erro ao alterar categoria');
                } else {
                    toast.success('Sucesso ao alterar categoria');
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

    async function deleteCategory(id: string) {
        if (!id) return;
        await mutate(
            async (current: any[] = []) => {
                const res = await fetch(`/api/categories?id=${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) {
                    const data = await res.json();
                    let message = 'Erro ao deletar';
                    if (data?.error) {
                        message = data.error;
                    }
                    toast.error(message);
                    return current;
                }
                toast.success('Sucesso ao deletar categoria');
                return current.filter((t) => t.id !== id);
            },
            {
                rollbackOnError: true,
                revalidate: true,
            }
        );
    }

    return {
        categories: data ?? [],
        isLoading,
        isError: error,
        postCategory,
        putCategory,
        deleteCategory,
    };
}

'use client';

import { Loader2 } from 'lucide-react';

import { CategoriesTable } from '@/components/categories/categories-table';
import { useCategories } from '@/hooks/use-categories';

export default function CategoriesPage() {
    const { categories, isLoading } = useCategories();

    return isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ) : categories.length ? (
        <CategoriesTable />
    ) : (
        <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
            <div className="w-full max-w-md ">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xl lg:text-nowrap">
                            Nenhuma categoria cadastrada
                        </p>
                        <p className="text-base text-muted-foreground">
                            Adicione sua primeira categoria para começar
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

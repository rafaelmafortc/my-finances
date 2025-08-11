'use client';

import { useState } from 'react';

import { Loader2, Plus } from 'lucide-react';

import { CategoriesTable } from '@/components/categories/categories-table';
import { CategoryDialog } from '@/components/categories/category-dialog';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';

export default function CategoriesPage() {
    const { categories, isLoading } = useCategories();
    const [open, setOpen] = useState(false);

    return isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    ) : categories.length ? (
        <CategoriesTable />
    ) : (
        <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
            <CategoryDialog open={open} onOpenChange={setOpen} />
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
                    <Button
                        className="text-primary bg-lime hover:bg-lime/80"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        <Plus />
                        Adicionar categoria
                    </Button>
                </div>
            </div>
        </div>
    );
}

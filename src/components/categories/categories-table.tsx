'use client';

import * as React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, EllipsisVertical, Settings2, Trash } from 'lucide-react';

import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { TypeBadge } from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/hooks/use-categories';

export type TransactionColumn = {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    category: Category;
};

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends unknown> {
        deleteCategory?: (id: string) => void;
    }
}

export const columns: ColumnDef<TransactionColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('name')}</div>
        ),
    },
    {
        accessorKey: 'type',
        header: () => <div className="text-center">Tipo</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <TypeBadge type={row.original.type} />
            </div>
        ),
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row, table }) => {
            const categoryId = row.original?.id;

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Ações"
                            >
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => null}
                                className="gap-2"
                            >
                                <Settings2 className="size-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    table.options.meta?.deleteCategory?.(
                                        categoryId
                                    )
                                }
                                className="gap-2 text-red focus:text-red"
                            >
                                <Trash className="size-4 text-red" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export function CategoriesTable() {
    const { deleteCategory, categories } = useCategories();

    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [typeTab, setTypeTab] = React.useState<'ALL' | 'INCOME' | 'EXPENSE'>(
        'ALL'
    );

    const table = useReactTable({
        data: categories ?? [],
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnFilters,
        },
        meta: { deleteCategory },
    });

    React.useEffect(() => {
        const col = table.getColumn('type');
        if (!col) return;
        if (typeTab === 'ALL') col.setFilterValue(undefined);
        else col.setFilterValue(typeTab);
    }, [typeTab, table]);

    return (
        <div className="w-full">
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center justify-between py-4">
                <Tabs
                    value={typeTab}
                    onValueChange={(v) => setTypeTab(v as any)}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="ALL">Todas</TabsTrigger>
                        <TabsTrigger value="INCOME">Receitas</TabsTrigger>
                        <TabsTrigger value="EXPENSE">Despesas</TabsTrigger>
                    </TabsList>
                </Tabs>
                <TransactionDialog />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-accent/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Sem categorias cadastradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

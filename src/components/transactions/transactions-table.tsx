'use client';

import * as React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { TypeBadge } from '@/components/type-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactions } from '@/hooks/use-transactions';

export type TransactionColumn = {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    category: Category;
};

export const columns: ColumnDef<TransactionColumn>[] = [
    {
        accessorKey: 'description',
        header: 'Descrição',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('description')}</div>
        ),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Valor
                        <ArrowUpDown />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const raw = row.getValue<number | string>('amount');
            const amount =
                typeof raw === 'string' ? parseFloat(raw) : (raw ?? 0);

            return (
                <div className="text-right">
                    {amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Data
                        <ArrowUpDown />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="text-right">
                {new Date(row.getValue('date')).toLocaleDateString('pt-BR')}
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: () => <div className="text-center">Data</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <TypeBadge type={row.original.type} />
            </div>
        ),
    },
    {
        accessorKey: 'category.name',
        header: 'Categoria',
    },
    {
        accessorKey: 'isFixed',
        header: () => <div className="text-center">Fixa</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <Checkbox disabled checked={row.original.isFixed} />
            </div>
        ),
    },
];

export function TransactionsTable() {
    const { transactions } = useTransactions();

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [typeTab, setTypeTab] = React.useState<'ALL' | 'INCOME' | 'EXPENSE'>(
        'ALL'
    );

    const table = useReactTable({
        data: transactions ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
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
                            <TableRow key={headerGroup.id}>
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
                                <TableRow key={row.id}>
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
                                    Sem transações cadastradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

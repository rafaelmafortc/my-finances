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
import { ArrowUpDown, EllipsisVertical, Plus, Trash } from 'lucide-react';

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
        header: () => <div className="text-center">Tipo</div>,
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
    {
        id: 'actions',
        header: () => <div className="text-right">Ações</div>,
        cell: ({ row, table }) => {
            const transactionId = row.original?.id;

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

                        <DropdownMenuContent align="end" className="w-40">
                            {/* <DropdownMenuItem
                                onClick={() => null}
                                className="gap-2"
                            >
                                <Settings2 className="size-4" />
                                Editar
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                onClick={() =>
                                    table.options.meta?.deleteTransaction?.(
                                        transactionId
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
declare module '@tanstack/table-core' {
    interface TableMeta<TData extends unknown> {
        deleteTransaction?: (id: string) => void;
    }
}
export function TransactionsTable() {
    const { transactions, deleteTransaction } = useTransactions();
    const [open, setOpen] = React.useState(false);

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
        meta: { deleteTransaction },
    });

    React.useEffect(() => {
        const col = table.getColumn('type');
        if (!col) return;
        if (typeTab === 'ALL') col.setFilterValue(undefined);
        else col.setFilterValue(typeTab);
    }, [typeTab, table]);

    return (
        <div className="w-full">
            <TransactionDialog open={open} onOpenChange={setOpen} />
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
                <Button
                    className="text-primary bg-cian hover:bg-cian/80"
                    onClick={() => setOpen(!open)}
                >
                    <Plus />
                    Adicionar transação
                </Button>
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

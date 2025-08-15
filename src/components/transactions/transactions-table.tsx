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
import {
    ChevronLeft,
    ChevronRight,
    EllipsisVertical,
    Plus,
    Settings2,
    Trash,
} from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTransactions } from '@/hooks/use-transactions';

export type TransactionColumn = {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    categoryId: string;
    category: Category;
};

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends unknown> {
        deleteTransaction?: (id: string) => void;
        onEditTransaction?: (transaction: Transaction) => void;
    }
}

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
        header: () => <div className="text-right">Valor</div>,
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
        header: () => <div className="text-right">Data</div>,
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
            const transaction = row.original;

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
                            <DropdownMenuItem
                                onClick={() =>
                                    table.options.meta?.onEditTransaction?.(
                                        transaction
                                    )
                                }
                                className="gap-2"
                            >
                                <Settings2 className="size-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    table.options.meta?.deleteTransaction?.(
                                        transaction?.id
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

export function TransactionsTable() {
    const { transactions, deleteTransaction } = useTransactions();
    const [open, setOpen] = React.useState(false);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [editing, setEditing] = React.useState<Transaction | null>(null);

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
        meta: {
            deleteTransaction,
            onEditTransaction: (transaction) => {
                setEditing(transaction);
                setOpen(true);
            },
        },
    });

    return (
        <div className="w-full">
            <TransactionDialog
                open={open}
                onOpenChange={setOpen}
                transaction={editing}
            />
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center justify-between py-4">
                <Input
                    placeholder="Filtrar descrição..."
                    value={
                        (table
                            .getColumn('description')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) => {
                        table
                            .getColumn('description')
                            ?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-full sm:w-[250px]"
                />
                <Button
                    className="text-primary bg-cian hover:bg-cian/80"
                    onClick={() => {
                        setEditing(null);
                        setOpen(!open);
                    }}
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
                            <TableRow className="hover:bg-primary">
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-[52.5px] text-center"
                                >
                                    Sem transações cadastradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {transactions.length > 10 && (
                <div className="flex items-center justify-end py-4 px-2">
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-sm font-medium"
                            >
                                Transações por página
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-20"
                                    id="rows-per-page"
                                >
                                    <SelectValue
                                        placeholder={
                                            table.getState().pagination.pageSize
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem
                                            key={pageSize}
                                            value={`${pageSize}`}
                                        >
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Página {table.getState().pagination.pageIndex + 1}{' '}
                            de {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

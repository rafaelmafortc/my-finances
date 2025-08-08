type Transaction = {
    id: string | null;
    description: string;
    amount: number;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    categoryId: string | null;
};

type TransactionInput = {
    description: string;
    amount: number | string;
    date: string | Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    categoryId: string | null;
    newCategoryName?: string;
};

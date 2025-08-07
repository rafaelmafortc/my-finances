type Transaction = {
    id: string | null;
    description: string;
    amount: number;
    date: Date;
    type: 'INCOME' | 'EXPENSE';
    isFixed: boolean;
    categoryId: string | null;
};

type Category = {
    id: string | null;
    name: string;
    type: 'INCOME' | 'EXPENSE';
};

type CategoryInput = {
    name: string;
    type: 'INCOME' | 'EXPENSE';
};

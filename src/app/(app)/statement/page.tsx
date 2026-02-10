import { StatementPage, getCategories, getTransactions } from '@/features/statement';

export default async function Page() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return <StatementPage transactions={transactions} categories={categories} />;
}

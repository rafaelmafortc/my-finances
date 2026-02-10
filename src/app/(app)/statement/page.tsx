import { getCategories } from '@/features/categories';
import { StatementPage, getTransactions } from '@/features/statement';

export default async function Page() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return <StatementPage transactions={transactions} categories={categories} />;
}

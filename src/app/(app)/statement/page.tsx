import { getCategories } from '@/features/categories';
import {
  StatementPage,
  getDayChecks,
  getTransactions,
} from '@/features/statement';

export default async function Page() {
  const [transactions, categories, dayChecks] = await Promise.all([
    getTransactions(),
    getCategories(),
    getDayChecks(new Date().getFullYear(), new Date().getMonth()),
  ]);

  return (
    <StatementPage
      transactions={transactions}
      categories={categories}
      initialDayChecks={dayChecks}
    />
  );
}

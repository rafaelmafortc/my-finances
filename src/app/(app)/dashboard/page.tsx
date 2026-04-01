import { DashboardPage } from '@/features/dashboard';
import { getTransactions } from '@/features/statement';

export default async function Page() {
  const transactions = await getTransactions();

  return <DashboardPage transactions={transactions} />;
}

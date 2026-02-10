import { PageShell } from '@/components/layout/page-shell';
import {
  PeriodSummary,
  StatementTable,
  getCategories,
  getTransactions,
} from '@/features/statement';

export default async function Page() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return (
    <PageShell
      title="Extrato"
      subtitle="Acompanhe suas receitas e despesas mensais"
    >
      <PeriodSummary transactions={transactions} />
      <StatementTable transactions={transactions} categories={categories} />
    </PageShell>
  );
}

import { PageShell } from '@/components/layout/page-shell';
import { getCategories } from '@/features/categories';
import {
  FixedTransactionsTable,
  IncomeCommitmentChart,
  getFixedTransactions,
} from '@/features/fixes';

export default async function Page() {
  const [fixedTransactions, categories] = await Promise.all([
    getFixedTransactions(),
    getCategories(),
  ]);

  return (
    <PageShell
      title="Gastos Fixos"
      subtitle="Acompanhe quanto seus gastos fixos comprometem sua renda mensal"
    >
      <IncomeCommitmentChart fixedTransactions={fixedTransactions} />
      <FixedTransactionsTable
        fixedTransactions={fixedTransactions}
        categories={categories}
      />
    </PageShell>
  );
}

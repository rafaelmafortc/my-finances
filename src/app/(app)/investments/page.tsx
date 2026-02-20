import { PageShell } from '@/components/layout/page-shell';
import { getInvestmentClasses } from '@/features/categories';
import {
  EmergencyReserveCard,
  InvestmentsByClass,
  InvestmentsTable,
  TotalPatrimony,
  getInvestments,
} from '@/features/investments';
import { getTransactions } from '@/features/statement';

export default async function Page() {
  const [transactions, investments, investmentClasses] = await Promise.all([
    getTransactions(),
    getInvestments(),
    getInvestmentClasses(),
  ]);

  return (
    <PageShell
      title="Investimentos"
      subtitle="Gerencie sua carteira e alocação de ativos"
      actions={<TotalPatrimony />}
    >
      <EmergencyReserveCard transactions={transactions} />
      <InvestmentsByClass investments={investments} />
      <InvestmentsTable
        investments={investments}
        investmentClasses={investmentClasses}
      />
    </PageShell>
  );
}

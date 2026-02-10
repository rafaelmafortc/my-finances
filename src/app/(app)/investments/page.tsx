import { PageShell } from '@/components/layout/page-shell';
import { getInvestmentClasses } from '@/features/investment-classes';
import {
  EmergencyReserveCard,
  InvestmentsByClass,
  InvestmentsTable,
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
    >
      <div className="space-y-6">
        <EmergencyReserveCard transactions={transactions} />
        <InvestmentsTable
          investments={investments}
          investmentClasses={investmentClasses}
        />
        <InvestmentsByClass investments={investments} />
      </div>
    </PageShell>
  );
}

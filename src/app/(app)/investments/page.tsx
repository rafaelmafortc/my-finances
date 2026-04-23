import { PageShell } from '@/components/layout/page-shell';
import { getInvestmentClasses } from '@/features/categories';
import {
  InvestmentsByClass,
  InvestmentsTable,
  TotalPatrimony,
  getInvestments,
} from '@/features/investments';

export default async function Page() {
  const [investments, investmentClasses] = await Promise.all([
    getInvestments(),
    getInvestmentClasses(),
  ]);

  return (
    <PageShell
      title="Investimentos"
      subtitle="Gerencie sua carteira e alocação de ativos"
      actions={<TotalPatrimony />}
    >
      <InvestmentsByClass investments={investments} />
      <InvestmentsTable
        investments={investments}
        investmentClasses={investmentClasses}
      />
    </PageShell>
  );
}

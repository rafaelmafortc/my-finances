import { PageShell } from '@/components/layout/page-shell';
import { getTransactions } from '@/features/statement';
import { EmergencyReserveCard } from '@/features/investments/components/emergency-reserve-card';

export default async function Page() {
  const transactions = await getTransactions();

  return (
    <PageShell
      title="Investimentos"
      subtitle="Gerencie sua carteira e alocação de ativos"
    >
      <EmergencyReserveCard transactions={transactions} />
    </PageShell>
  );
}

import { PageShell } from '@/components/layout/page-shell';
import {
  CategoriesTable,
  InvestmentClassesTable,
  getCategories,
  getInvestmentClasses,
} from '@/features/categories';

export default async function Page() {
  const [categories, investmentClasses] = await Promise.all([
    getCategories(),
    getInvestmentClasses(),
  ]);

  return (
    <PageShell title="Categorias" subtitle="Gerencie suas categorias">
      <div className="space-y-6">
        <CategoriesTable categories={categories} />
        <InvestmentClassesTable investmentClasses={investmentClasses} />
      </div>
    </PageShell>
  );
}

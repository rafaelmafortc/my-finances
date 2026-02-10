import { PageShell } from '@/components/layout/page-shell';
import { CategoriesTable, getCategories } from '@/features/categories';

export default async function Page() {
  const categories = await getCategories();

  return (
    <PageShell title="Categorias" subtitle="Gerencie suas categorias">
      <CategoriesTable categories={categories} />
    </PageShell>
  );
}

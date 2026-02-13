import { AppSidebar } from '@/components/layout/app-sidebar';
import { PayCoffeeFab } from '@/components/layout/pay-coffee-fab';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <AppSidebar />
      <PayCoffeeFab />
      <div className="flex-1 md:ml-12 pb-16 md:pb-0 p-2 sm:p-4 w-0 min-w-0">
        {children}
      </div>
    </div>
  );
}

import { AppSidebar } from '@/components/layout/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 md:ml-12 pb-16 md:pb-0 p-4">{children}</div>
    </div>
  );
}

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { PrivatePageHeader } from '@/components/sidebar/private-page-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function PrivatePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <PrivatePageHeader />
                <div className="h-full w-full p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}

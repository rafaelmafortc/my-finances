import { MonthPicker } from '@/components/month-picker';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

export default function PrivatePageLayout({
    children,
    title,
    hasMonthPicker = false,
}: Readonly<{
    children: React.ReactNode;
    title: string;
    hasMonthPicker?: boolean;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-sidebar border-b-2 flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    {hasMonthPicker && (
                        <div className="px-4">
                            <MonthPicker />
                        </div>
                    )}
                </header>
                <div className="h-full w-full p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}

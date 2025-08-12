'use client';

import { usePathname } from 'next/navigation';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { navbar } from '@/lib/navbar';

export function PrivatePageHeader() {
    const pathname = usePathname();
    const currentPage = navbar.find((n) => n.url === pathname);

    if (!currentPage) return null;

    return (
        <header className="bg-sidebar border-b-2 flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
        </header>
    );
}

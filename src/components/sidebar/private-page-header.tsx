'use client';

import { usePathname } from 'next/navigation';

import { MonthPicker } from '@/components/month-picker';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const headerTitles: Record<string, { title: string; hasMonthPicker: boolean }> =
    {
        transactions: {
            title: 'Transações',
            hasMonthPicker: true,
        },
        dashboard: {
            title: 'Dashboard',
            hasMonthPicker: true,
        },
        categories: {
            title: 'Categorias',
            hasMonthPicker: false,
        },
        fixes: {
            title: 'Fixos',
            hasMonthPicker: false,
        },
    };

export function PrivatePageHeader() {
    const pathname = usePathname().split('/')[1].toString();

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
                        <BreadcrumbPage>
                            {headerTitles[pathname].title}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            {headerTitles[pathname].hasMonthPicker && (
                <div className="px-4">
                    <MonthPicker />
                </div>
            )}
        </header>
    );
}

'use client';

import * as React from 'react';
import {
    ArrowUpDown,
    ChartPie,
    FileText,
    GalleryVerticalEnd,
    LineChart,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavHeader } from '@/components/nav-header';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '#',
            icon: ChartPie,
            isActive: true,
        },
        {
            title: 'Transações',
            url: '#',
            icon: FileText,
        },
        {
            title: 'Fixos',
            url: '#',
            icon: ArrowUpDown,
        },
        {
            title: 'Metas',
            url: '#',
            icon: LineChart,
        },
        {
            title: 'Categorias',
            url: '#',
            icon: GalleryVerticalEnd,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

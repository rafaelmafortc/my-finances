'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChartPie, FileText, GalleryVerticalEnd } from 'lucide-react';

import { Collapsible } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export const navbarMain = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: ChartPie,
        defaultOpen: true,
    },
    {
        title: 'Transações',
        url: '/transactions',
        icon: FileText,
    },

    {
        title: 'Categorias',
        url: '/categories',
        icon: GalleryVerticalEnd,
    },
];

export function NavMain() {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {navbarMain.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.defaultOpen}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <Link href={item.url} prefetch>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                >
                                    {item.icon && (
                                        <item.icon className="text-muted-foreground" />
                                    )}
                                    <span className="text-sm">
                                        {item.title}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

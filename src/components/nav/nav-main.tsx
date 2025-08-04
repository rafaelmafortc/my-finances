'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible } from '@/components/ui/collapsible';
import { navbarMain } from '@/lib/navbar';

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

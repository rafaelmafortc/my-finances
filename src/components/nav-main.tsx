'use client';

import Link from 'next/link';

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible } from '@/components/ui/collapsible';
import { navbarItems } from '@/lib/navbar';

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {navbarItems.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <Link href={item.url}>
                                <SidebarMenuButton tooltip={item.title}>
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

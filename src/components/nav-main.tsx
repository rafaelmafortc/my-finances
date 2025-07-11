'use client';

import { type LucideIcon } from 'lucide-react';

import { Collapsible } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
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

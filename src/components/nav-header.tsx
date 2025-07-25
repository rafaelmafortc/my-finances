'use client';

import * as React from 'react';
import { PiggyBank } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import Link from 'next/link';

export function NavHeader() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {/* <Link href="/"> */}
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent active:bg-transparent"
                >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <PiggyBank className="size-6" />
                    </div>
                    <div className="grid flex-1 text-left text-lg  leading-tight">
                        <h1 className="truncate font-base">MyFinances</h1>
                    </div>
                </SidebarMenuButton>
                {/* </Link> */}
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

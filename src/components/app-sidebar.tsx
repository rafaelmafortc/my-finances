'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav/nav-main';
import { NavUser } from '@/components/nav/nav-user';
import { NavHeader } from '@/components/nav/nav-header';
import { SettingsDialog } from '@/components/settings-dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [openSettings, setOpenSettings] = React.useState(false);

    return (
        <>
            <SettingsDialog
                open={openSettings}
                onOpenChange={setOpenSettings}
            />
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <NavHeader />
                </SidebarHeader>
                <SidebarContent>
                    <NavMain />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser setOpenSettings={setOpenSettings} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </>
    );
}

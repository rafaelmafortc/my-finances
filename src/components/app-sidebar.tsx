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
    const [activeTab, setActiveTab] = React.useState('');

    const handleOpenSettings = async (open: boolean, tab: string) => {
        setOpenSettings(open);
        setActiveTab(tab);
    };

    return (
        <React.Fragment>
            <SettingsDialog
                open={openSettings}
                onOpenChange={setOpenSettings}
                activeTab={activeTab}
            />
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <NavHeader />
                </SidebarHeader>
                <SidebarContent>
                    <NavMain />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser handleOpenSettings={handleOpenSettings} />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </React.Fragment>
    );
}

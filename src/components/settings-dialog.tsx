'use client';

import * as React from 'react';

import { navbarConfig } from '@/lib/navbar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar';

export function SettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogHeader>Configurações da conta</DialogHeader>
                <SidebarProvider className="items-start">
                    <Sidebar collapsible="none" className="hidden md:flex">
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {navbarConfig.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild>
                                                    <a href="#">
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <main className="flex h-[480px] flex-1 flex-col overflow-hidden pt-12">
                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-muted/50 aspect-video max-w-3xl rounded-xl"
                                />
                            ))}
                        </div>
                    </main>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
}

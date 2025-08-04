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
            <DialogContent className="overflow-hidden p-0 w-full max-w-1xl rounded-xl gap-0">
                <div className="border-b py-2 px-4">
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Configurações
                    </DialogTitle>
                </div>
                <div className="flex h-[600px]">
                    <SidebarProvider className="items-start">
                        <Sidebar collapsible="none" className="w-1/3 border-r">
                            <SidebarContent className="h-full">
                                <SidebarGroup>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {navbarConfig.map((item) => (
                                                <SidebarMenuItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <a
                                                            href="#"
                                                            className="w-full text-left text-sm font-medium hover:bg-muted/50 rounded-md transition-colors"
                                                        >
                                                            <item.icon className="mr-2 inline size-4" />
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

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col p-6">
                            {/* Conteúdo da aba ativa */}
                        </div>
                    </SidebarProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}

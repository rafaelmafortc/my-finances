'use client';

import * as React from 'react';
import { navbarConfig } from '@/lib/navbar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { AccountSettings } from '@/components/settings-tabs/account-settings';
import { PaymentSettings } from '@/components/settings-tabs/payment-settings';

const contentMap: Record<string, React.ReactNode> = {
    account: <AccountSettings />,
    payment: <PaymentSettings />,
};

export function SettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [activeTab, setActiveTab] = React.useState<string>('account');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full overflow-hidden p-0 gap-0 sm:max-w-1/2">
                <div className="border-b py-2 px-4">
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        Configurações
                    </DialogTitle>
                </div>
                <DialogDescription className="sr-only">
                    Descrição
                </DialogDescription>
                <div className="flex h-[600px]">
                    <SidebarProvider className="items-start">
                        {/* <Sidebar collapsible="none" className="w-fit border-r">
                            <SidebarContent className="h-full">
                                <SidebarGroup>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {navbarConfig.map((item) => (
                                                <SidebarMenuItem key={item.id}>
                                                    <SidebarMenuButton
                                                        onClick={() =>
                                                            setActiveTab(
                                                                item.id
                                                            )
                                                        }
                                                        isActive={
                                                            activeTab ===
                                                            item.id
                                                        }
                                                    >
                                                        <item.icon className="text-muted-foreground" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            </SidebarContent>
                        </Sidebar> */}
                        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                            {contentMap[activeTab] ?? (
                                <div>Conteúdo não disponível.</div>
                            )}
                        </div>
                    </SidebarProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}

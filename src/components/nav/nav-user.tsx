'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Settings } from 'lucide-react';

import { useUser } from '@/providers/user-provider';
import { navbarConfig } from '@/lib/navbar';
import { SettingsDialog } from '@/components/settings-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavUser() {
    const { isMobile } = useSidebar();
    const { firstName, lastName, initials } = useUser();
    const [open, setOpen] = useState(false);

    return (
        <SidebarMenu>
            <SettingsDialog open={open} onOpenChange={setOpen} />
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg bg-purple">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {`${firstName} ${lastName}`}
                                </span>
                            </div>
                            <Settings className="ml-auto size-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem
                            onSelect={(e) => {
                                setOpen(true);
                            }}
                        >
                            <Settings />
                            Configurações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                signOut({ callbackUrl: '/login' });
                            }}
                        >
                            <LogOut className="text-red" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Settings2, Settings } from 'lucide-react';

import { useUser } from '@/providers/user-provider';
import { SettingsDialog } from '@/components/settings-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
    setOpenSettings,
}: {
    setOpenSettings: (open: boolean) => void;
}) {
    const { isMobile, setOpenMobile } = useSidebar();
    const { firstName, lastName, initials, avatarColor, user } = useUser();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar
                                key={avatarColor}
                                className="h-8 w-8 rounded-lg"
                            >
                                {avatarColor === 'image' ? (
                                    <AvatarImage
                                        src={user?.image || ''}
                                        alt="Profile Image"
                                    />
                                ) : (
                                    <AvatarFallback
                                        className={`rounded-lg bg-${avatarColor}`}
                                    >
                                        {initials}
                                    </AvatarFallback>
                                )}
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
                                if (isMobile) setOpenMobile(false);
                                setOpenSettings(true);
                            }}
                        >
                            <Settings2 />
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

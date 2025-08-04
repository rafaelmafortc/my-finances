'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { CircleUser, CreditCard, LogOut, Settings } from 'lucide-react';

import { useUser } from '@/providers/user-provider';
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
    const { user } = useUser();

    const fullName = user?.name ?? '';
    const nameParts = fullName.trim().split(' ');
    const displayName =
        nameParts.length >= 2
            ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
            : fullName;
    const initials = displayName
        .split(' ')
        .filter((n) => n.length > 0)
        .map((n) => n[0].toUpperCase())
        .join('');

    return (
        <SidebarMenu>
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
                                    {displayName}
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
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm font-bold">
                                <span>Configurações</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/account">
                                <DropdownMenuItem>
                                    <CircleUser />
                                    Conta
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem disabled>
                                <CreditCard />
                                Pagamento
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
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

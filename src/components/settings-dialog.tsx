'use client';

import { AccountSettings } from '@/components/settings-tabs/account-settings';
import { PaymentSettings } from '@/components/settings-tabs/payment-settings';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';

const contentMap: Record<string, React.ReactNode> = {
    account: <AccountSettings />,
    payment: <PaymentSettings />,
};

export function SettingsDialog({
    open,
    onOpenChange,
    activeTab,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activeTab: string;
}) {
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
                <div className="flex h-full">
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                        {contentMap[activeTab] ?? (
                            <div>Conteúdo não disponível.</div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

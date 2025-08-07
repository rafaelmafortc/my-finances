import PrivatePageLayout from '@/components/private-page-layout';
import { TransactionDialog } from '@/components/transaction-dialog';

export default function TransactionsPage() {
    return (
        <PrivatePageLayout title="Transações" hasMonthPicker>
            <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
                <div className="w-full max-w-md ">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center text-center">
                            <p className="text-xl">
                                Nenhuma transação cadastrada
                            </p>
                            <p className="text-base text-muted-foreground">
                                Adicione sua primeira transação para começar
                            </p>
                        </div>
                        <TransactionDialog />
                    </div>
                </div>
            </div>
        </PrivatePageLayout>
    );
}

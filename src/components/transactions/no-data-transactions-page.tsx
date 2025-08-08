import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { useSelectedDate } from '@/providers/selected-date-provider';

export default function NoDataTransactionsPage() {
    const { month } = useSelectedDate();

    return (
        <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
            <div className="w-full max-w-md ">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xl lg:text-nowrap">{`Nenhuma transação cadastrada para o mês ${month}`}</p>
                        <p className="text-base text-muted-foreground">
                            Adicione sua primeira transação para começar
                        </p>
                    </div>
                    <TransactionDialog />
                </div>
            </div>
        </div>
    );
}

import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { useSelectedDate } from '@/providers/selected-date-provider';

export default function NoDataTransactionsPage() {
    const { month } = useSelectedDate();

    const dateObj = month ? parse(month, 'yyyy-MM', new Date()) : new Date();

    const formattedMonth = format(dateObj, "MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
            <div className="w-full max-w-md ">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center text-center">
                        <p className="text-xl lg:text-nowrap">{`Nenhuma transação cadastrada para o mês ${formattedMonth}`}</p>
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

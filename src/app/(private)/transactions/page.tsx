import PrivatePageLayout from '@/components/private-page-layout';
import { Button } from '@/components/ui/button';

export default function Transactions() {
    return (
        <PrivatePageLayout title="Transação">
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
                        <Button color="lime">Adicionar transação</Button>
                    </div>
                </div>
            </div>
        </PrivatePageLayout>
    );
}

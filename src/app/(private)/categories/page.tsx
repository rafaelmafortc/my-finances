import PrivatePageLayout from '@/components/private-page-layout';
import { Button } from '@/components/ui/button';

export default function Categories() {
    return (
        <PrivatePageLayout title="Categorias">
            <div className="flex items-center justify-center min-h-full border-2 border-dashed rounded-lg p-4 border-accent">
                <div className="w-full max-w-md ">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center">
                            <p className="text-xl">
                                Nenhuma categoria cadastrada
                            </p>
                            <p className="text-base text-muted-foreground">
                                Adicione sua primeira categoria para começar
                            </p>
                        </div>
                        <Button color="cian">Adicionar Categoria</Button>
                    </div>
                </div>
            </div>
        </PrivatePageLayout>
    );
}

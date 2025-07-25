import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
    return (
        <div className="flex flex-col justify-between items-center pt-8 border-t-2 gap-4">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-2xl font-semibold">MyFinances</h1>
                <div className="flex flex-col gap-4">
                    <span>Atualizações direto na sua caixa de email</span>
                    <div className="flex gap-4">
                        <Input type="email" placeholder="Email" />
                        <Button color="cian" className="w-32">
                            Participar
                        </Button>
                    </div>
                </div>
            </div>
            <span className="text-xs text-muted-foreground">
                powered by Rafael Mafort Coimbra
            </span>
        </div>
    );
}

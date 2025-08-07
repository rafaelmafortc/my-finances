import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">MyFinances</h1>
            <Link prefetch href="/login">
                <Button className="w-32 text-primary bg-lime hover:bg-lime/80">
                    Entrar
                </Button>
            </Link>
        </div>
    );
}

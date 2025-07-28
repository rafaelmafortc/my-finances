import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">MyFinances</h1>
            <Link prefetch href="/login">
                <Button color="lime" className="w-32">
                    Entrar
                </Button>
            </Link>
        </div>
    );
}

import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

export function LinkLogo() {
    return (
        <Link href="/" className="flex items-center p-2 gap-2 font-medium">
            <div className="bg-primary-foreground text-primary flex size-8 items-center justify-center rounded-md">
                <PiggyBank className="size-6" />
            </div>
            <h1>MyFinances</h1>
        </Link>
    );
}

import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

import { LoginForm } from '@/components/login-form';

export default function Login() {
    return (
        <div className="bg-primary flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 items-center">
                <Link
                    href="/"
                    className="flex items-center p-2 gap-2 font-medium"
                >
                    <div className="bg-primary-foreground text-primary flex size-8 items-center justify-center rounded-md">
                        <PiggyBank className="size-6" />
                    </div>
                    <h1>MyFinances</h1>
                </Link>
                <LoginForm />
            </div>
        </div>
    );
}

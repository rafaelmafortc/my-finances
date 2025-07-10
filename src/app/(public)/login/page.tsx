import { PiggyBank } from 'lucide-react';

import { LoginForm } from './components/login-form';

export default function Login() {
    return (
        <div className="bg-secondary flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary-foreground text-primary flex size-7 items-center justify-center rounded-md">
                        <PiggyBank className="size-6" />
                    </div>
                    <h1>MyFinances</h1>
                </a>
                <LoginForm />
            </div>
        </div>
    );
}

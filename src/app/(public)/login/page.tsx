import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { PiggyBank } from 'lucide-react';
import Link from 'next/link';
import { LoginForm } from '@/components/login-form';

export default function Login() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full flex flex-col gap-4 max-w-sm">
                <Link href="/" prefetch={false} className="flex justify-center">
                    <PiggyBank className={'h-8 w-8 '} />
                </Link>
                <LoginForm />
                <div className="flex gap-2  justify-center">
                    <div>
                        <ThemeToggle />
                    </div>
                    <div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
}

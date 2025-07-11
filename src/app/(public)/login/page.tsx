import { LoginForm } from './_components/login-form';
import { LinkLogo } from '@/components/link-logo';

export default function Login() {
    return (
        <div className="bg-primary flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 items-center">
                <LinkLogo />
                <LoginForm />
            </div>
        </div>
    );
}

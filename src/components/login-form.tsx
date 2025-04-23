'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signInWithPopup } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { auth, googleProvider } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const t = useTranslations('login');

    const [loading, setLoading] = useState(false);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            if (response.status === 200) {
                router.push('/resume');
            }
        } catch (err) {
            console.error('error signInWithGoogle function', err);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{t('welcome')}!</CardTitle>
                <CardDescription>{t('login_description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={signInWithGoogle}
                            variant="outline"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    {t('google_btn')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

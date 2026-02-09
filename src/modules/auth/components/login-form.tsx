'use client';

import { useState } from 'react';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginGoogle = () => {
    setIsLoading(true);
    try {
      signIn('google', { callbackUrl: '/wallet' });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Card className="w-full max-w-sm rounded-2xl bg-card px-6 inset-shadow-sm border border-border/60 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <CardTitle>Bem vindo!</CardTitle>
          <CardDescription>Faça login para acessar sua conta.</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            className="w-full gap-2"
            onClick={handleLoginGoogle}
            isLoading={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

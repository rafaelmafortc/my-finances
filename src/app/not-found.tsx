'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
            <h1 className="text-2xl p-2 font-bold text-white">
                404 | Page not found
            </h1>
            <Button
                variant={'outline'}
                size={'lg'}
                onClick={() => router.back()}
            >
                Voltar
            </Button>
        </div>
    );
}

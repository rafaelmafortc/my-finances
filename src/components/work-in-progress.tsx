'use client';

import Lottie from 'lottie-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import constructionAnimation from '@/public/construction.json';

export function WorkInProgressCard() {
    return (
        <div className="flex justify-center h-full w-full items-center bg-background">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>🚧 Em construção</CardTitle>
                    <CardDescription>
                        Esta tela ainda está em construção. Volte em breve!
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Lottie
                        animationData={constructionAnimation}
                        loop={true}
                        className="w-full mx-auto"
                    />
                </CardContent>
            </Card>
        </div>
    );
}

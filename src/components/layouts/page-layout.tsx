import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function PageLayout({
    title,
    children,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 flex flex-col">
            <Card className="flex flex-col h-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle className="text-3xl">{title}</CardTitle>
                </CardHeader>
                {children}
            </Card>
        </main>
    );
}

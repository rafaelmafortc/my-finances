import { Navbar } from '@/components/navbar';
import { AuthGate } from '@/components/auth-gate';

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="sm:ml-16 p-4 flex-1 flex flex-col">
                <AuthGate>{children}</AuthGate>
            </div>
        </div>
    );
}

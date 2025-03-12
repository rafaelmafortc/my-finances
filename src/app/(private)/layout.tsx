import { Navbar } from '@/components/navbar';

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Navbar />
            <div className="sm:ml-16 p4">{children}</div>
        </div>
    );
}

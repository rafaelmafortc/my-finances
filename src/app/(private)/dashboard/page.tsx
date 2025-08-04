import PrivatePageLayout from '@/components/private-page-layout';

export default function Dashboard() {
    return (
        <PrivatePageLayout title="Dashboard" hasCalendarFilter>
            <div>Dashboard</div>
        </PrivatePageLayout>
    );
}

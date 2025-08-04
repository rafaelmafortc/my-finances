import PrivatePageLayout from '@/components/private-page-layout';

export default function Dashboard() {
    return (
        <PrivatePageLayout title="Dashboard" hasMonthPicker>
            <div>Dashboard</div>
        </PrivatePageLayout>
    );
}

import { prisma } from '@/lib/prisma';
import SalesDashboardLoader from '@/components/admin/reports/SalesDashboardLoader';

export default async function ReportsPage() {
    const orders = await prisma.order.findMany({
        include: { items: true }
    });

    // We pass all orders to the client component to allow dynamic filtering without server roundtrips
    return <SalesDashboardLoader orders={orders} />;
}

import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';

const SalesDashboard = dynamic(() => import('@/components/admin/reports/SalesDashboard'), {
    ssr: false,
    loading: () => <p className="p-8 text-gray-500">Rapor yükleniyor...</p>
});

export default async function ReportsPage() {
    const orders = await prisma.order.findMany({
        include: { items: true }
    });

    // We pass all orders to the client component to allow dynamic filtering without server roundtrips
    return <SalesDashboard orders={orders as any} />;
}

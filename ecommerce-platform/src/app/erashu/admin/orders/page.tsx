import { prisma } from '@/lib/prisma';
import { Order, OrderItem } from '@prisma/client';
type OrderWithItems = Order & { items: OrderItem[] };
import { updateOrderStatus } from '@/app/actions';
import OrderStatusForm from './OrderStatusForm';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatRelativeTime } from '@/lib/dateUtils';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    try {
        const user = JSON.parse(session.value);
        const { hasPermission, PERMISSIONS } = await import('@/lib/rbac');
        const canView = await hasPermission(user.id, PERMISSIONS.ORDERS_VIEW);
        if (!canView) {
            return <div className="p-8 text-center text-red-600">Bu sayfayı görüntüleme yetkiniz yok.</div>;
        }
    } catch (e) {
        console.error("Permission check failed", e);
    }

    const query = q?.toLowerCase();

    // Build filter
    const where: any = {};
    if (query) {
        where.OR = [
            { id: { contains: query } },
            { customerName: { contains: query } }
        ];
    }

    const ordersRaw = await prisma.order.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
            items: true
        }
    });

    // Map to legacy Order interface
    // Map to legacy Order interface
    const orders: OrderWithItems[] = ordersRaw.map((o: any) => ({
        ...o,
        // date: o.date.toISOString(), // Keep it as Date object for Prisma type compatibility? 
        // Prisma Order type has date as DateTime (Date). 
        // But renderOrderTable uses formatRelativeTime(order.date).
        // formatRelativeTime likely expects string or Date.
        // Let's keep it as Date and fix formatRelativeTime if needed, OR cast to any if we want to keep string.
        // Actually, Prisma Client returns Date objects. 
        // If we want to match Prisma types, we should keep it as Date.
        items: o.items
    }));

    const activeOrders = orders.filter(o => o.status === 'Hazırlanıyor' || o.status === 'Kargolandı' || !o.status);
    const passiveOrders = orders.filter(o => o.status === 'Teslim Edildi' || o.status === 'İptal');

    const renderOrderTable = (orderList: OrderWithItems[], title: string, emptyMessage: string) => (
        <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#334155' }}>{title} ({orderList.length})</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Sipariş No</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tarih</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Müşteri</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Adres</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Ürünler</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tutar</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((order) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>
                                    #{order.id}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem' }} title={new Date(order.date).toLocaleString('tr-TR')}>
                                        {formatRelativeTime(order.date)}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{order.customerEmail}</div>
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', maxHeight: '60px', overflowY: 'auto' }}>
                                        {order.address}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-light)' }}>{item.quantity}x</span> {item.productName}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>{order.total} TL</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                                </td>
                            </tr>
                        ))}
                        {orderList.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="title">Sipariş Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Sipariş No veya Müşteri ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                </div>
            </header>

            {renderOrderTable(activeOrders, 'Aktif Siparişler', 'Bekleyen veya işlenen sipariş bulunmuyor.')}
            {renderOrderTable(passiveOrders, 'Pasif Siparişler (Tamamlanan/İptal)', 'Tamamlanmış veya iptal edilmiş sipariş bulunmuyor.')}
        </main>
    );
}

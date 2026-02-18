import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createDiscount, deleteDiscount, toggleDiscountStatus } from '@/app/actions';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminDiscountsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q?.toLowerCase();

    const where: any = {};
    if (query) {
        where.name = { contains: query };
    }

    const discounts = await prisma.discount.findMany({
        where,
        orderBy: { startDate: 'desc' }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>İndirim Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Kampanya ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Panele Dön</Link>
                </div>
            </div>

            {/* Add New Discount Form */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Yeni İndirim Oluştur</h2>
                <form action={createDiscount} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kampanya Adı</label>
                        <input type="text" name="name" required placeholder="Örn: Yaz İndirimi" style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: '0 0 100px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Yüzde (%)</label>
                        <input type="number" name="percentage" required min="1" max="100" placeholder="20" style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: '0 0 150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Başlangıç Tarihi</label>
                        <input type="date" name="startDate" required style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: '0 0 150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bitiş Tarihi</label>
                        <input type="date" name="endDate" required style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <input type="checkbox" name="isActive" id="isActive" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
                        <label htmlFor="isActive" style={{ cursor: 'pointer' }}>Aktif</label>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Oluştur</button>
                    </div>
                </form>
            </div>

            {/* Discount List */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Kampanya Adı</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Yüzde</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Tarih Aralığı</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Durum</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                    {query ? 'Aradığınız kriterlere uygun kampanya bulunamadı.' : 'Henüz indirim kampanyası yok.'}
                                </td>
                            </tr>
                        ) : (
                            discounts.map(discount => (
                                <tr key={discount.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{discount.name}</td>
                                    <td style={{ padding: '1rem' }}>%{discount.percentage}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {new Date(discount.startDate).toLocaleDateString('tr-TR')} - {new Date(discount.endDate).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <form action={async (formData) => {
                                            'use server';
                                            await toggleDiscountStatus(discount.id, !discount.isActive);
                                        }}>
                                            <button
                                                type="submit"
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: discount.isActive ? '#dcfce7' : '#fee2e2',
                                                    color: discount.isActive ? '#166534' : '#991b1b',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {discount.isActive ? 'AKTİF' : 'PASİF'}
                                            </button>
                                        </form>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <form action={deleteDiscount}>
                                            <input type="hidden" name="id" value={discount.id} />
                                            <button type="submit" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Sil</button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

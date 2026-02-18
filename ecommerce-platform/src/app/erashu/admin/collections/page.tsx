import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCollection, toggleCollectionStatus } from '@/app/actions';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminCollectionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q?.toLowerCase();

    const collections = await prisma.collection.findMany({
        where: query ? {
            title: { contains: query }
        } : {},
        include: {
            products: {
                select: { id: true }
            }
        }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Koleksiyon Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Koleksiyon ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Panele Dön</Link>
                    <Link href="/erashu/admin/collections/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Yeni Koleksiyon</Link>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Resim</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Başlık</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Slug</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Ürün Sayısı</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Durum</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                    {query ? 'Aradığınız kriterlere uygun koleksiyon bulunamadı.' : 'Henüz koleksiyon bulunmuyor.'}
                                </td>
                            </tr>
                        ) : (
                            collections.map(c => (
                                <tr key={c.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {c.imageUrl ? (
                                            <img src={c.imageUrl} alt={c.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : (
                                            <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#999' }}>Yok</div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                                        <Link href={`/erashu/admin/collections/${c.id}`} className="hover:underline text-blue-600">
                                            {c.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#666' }}>{c.slug}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{c.products.length}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <form action={async () => {
                                            'use server';
                                            await toggleCollectionStatus(c.id, !c.isActive);
                                        }}>
                                            <button
                                                type="submit"
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: c.isActive ? '#d1fae5' : '#fee2e2',
                                                    color: c.isActive ? '#065f46' : '#991b1b'
                                                }}
                                            >
                                                {c.isActive ? 'Yayında' : 'Pasif'}
                                            </button>
                                        </form>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <form action={deleteCollection}>
                                            <input type="hidden" name="id" value={c.id} />
                                            <button
                                                type="submit"
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                                onClick={(e) => {
                                                    /* Confirmation logic would ideally be client-side only */
                                                }}
                                            >
                                                Sil
                                            </button>
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

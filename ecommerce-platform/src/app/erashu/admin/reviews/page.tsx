import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteReview } from '@/app/actions';
import ReviewDeleteButton from './ReviewDeleteButton';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q?.toLowerCase();

    const where: any = {};
    if (query) {
        where.OR = [
            { userName: { contains: query } },
            { comment: { contains: query } },
            { product: { name: { contains: query } } }
        ];
    }

    const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { product: true }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Değerlendirme Yönetimi</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Kullanıcı, ürün veya yorum ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: '#6cbd7e' }}>&larr; Panele Dön</Link>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Ürün</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Kullanıcı</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Puan</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666', width: '40%' }}>Yorum</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                    {query ? 'Aradığınız kriterlere uygun değerlendirme bulunamadı.' : 'Henüz değerlendirme yapılmamış.'}
                                </td>
                            </tr>
                        ) : (
                            reviews.map(r => {
                                const productName = r.product ? r.product.name : 'Silinmiş Ürün';

                                return (
                                    <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{productName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>ID: {r.productId.substring(0, 6)}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '500' }}>{r.userName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{'★'.repeat(r.rating)}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#333' }}>
                                            {r.comment}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <ReviewDeleteButton reviewId={r.id} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

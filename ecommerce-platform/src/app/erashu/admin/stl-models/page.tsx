import { prisma } from '@/lib/prisma';
import { deleteStlModel } from '@/app/actions';
import Link from 'next/link';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminStlModelsPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q?.toLowerCase();
    const where: any = {};
    if (query) {
        where.name = { contains: query };
    }

    const models = await prisma.stlModel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { tags: true, category: true }
    });

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="title">3D Modeller</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Model ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                    <Link href="/erashu/admin/stl-models/new" className="btn">
                        + Yeni Model
                    </Link>
                </div>
            </header>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Görsel</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Model Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tür</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Kategori</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Fiyat</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Etiketler</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Tarih</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map((model) => (
                            <tr key={model.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                        <img
                                            src={model.imageUrl}
                                            alt={model.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{model.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor: model.fileUrl && model.fileUrl.endsWith('.3mf') ? '#e0f2fe' : '#fef3c7',
                                        color: model.fileUrl && model.fileUrl.endsWith('.3mf') ? '#0284c7' : '#d97706',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        {model.fileUrl && model.fileUrl.endsWith('.3mf') ? '3MF' : 'STL'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {model.category ? (
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.85rem',
                                            color: 'var(--text)'
                                        }}>
                                            {model.category.name}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {model.isFree ? (
                                        <span style={{
                                            backgroundColor: '#dcfce7',
                                            color: '#15803d',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            Ücretsiz
                                        </span>
                                    ) : (
                                        <span style={{ fontWeight: 500 }}>{model.price} TL</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                        {model.tags.length > 0 ? model.tags.map(tag => (
                                            <span key={tag.id} style={{ fontSize: '0.75rem', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                                                {tag.name}
                                            </span>
                                        )) : <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>-</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    {new Date(model.createdAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/erashu/admin/stl-models/${model.id}`}
                                            style={{
                                                textDecoration: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text)',
                                                fontSize: '0.9rem'
                                            }}>
                                            Düzenle
                                        </Link>
                                        <form action={async (formData) => {
                                            'use server';
                                            await deleteStlModel(formData);
                                        }}>
                                            <input type="hidden" name="id" value={model.id} />
                                            <button type="submit" style={{
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}>
                                                Sil
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {models.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📂</div>
                                    <p>Henüz hiç 3D model eklenmemiş.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

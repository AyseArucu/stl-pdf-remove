import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function CategoriesPage({ searchParams }: { searchParams: { q?: string } }) {
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const allCategories = await prisma.category.findMany();
    let categories = allCategories;

    const query = searchParams.q?.toLowerCase();
    if (query) {
        const matches = categories.filter(c => c.name.toLowerCase().includes(query));
        const visibleIds = new Set(matches.map(c => c.id));

        // Add parents of matched subcategories so they appear in the tree
        matches.forEach(c => {
            if (c.parentId) visibleIds.add(c.parentId);
        });

        categories = categories.filter(c => visibleIds.has(c.id));
    }

    // Separate main categories and subcategories
    const mainCategories = categories.filter(c => !c.parentId);
    const subCategories = categories.filter(c => c.parentId);

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="title">Kategoriler</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Kategori ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                {/* Kategori Ekleme Formu */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    height: 'fit-content'
                }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Yeni Kategori Ekle</h2>
                    <form action={createCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kategori Adı</label>
                            <input name="name" type="text" required placeholder="Örn: Ayakkabı" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ana Kategori (Opsiyonel)</label>
                            <select name="parentId" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}>
                                <option value="">Yok (Ana Kategori)</option>
                                {/* Use allCategories here to always show all potential parents for the form, regardless of search */}
                                {allCategories.filter(c => !c.parentId).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>
                            Kategori Oluştur
                        </button>
                    </form>
                </div>

                {/* Kategori Listesi */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Mevcut Kategoriler</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {mainCategories.map((category) => {
                            const children = subCategories.filter(sc => sc.parentId === category.id);
                            return (
                                <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {/* Main Category Item */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <span style={{ fontWeight: 600 }}>{category.name}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/erashu/admin/categories/${category.id}/edit`}
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
                                            <form action={deleteCategory}>
                                                <input type="hidden" name="id" value={category.id} />
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
                                    </div>

                                    {/* Subcategories */}
                                    {children.length > 0 && (
                                        <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {children.map(child => (
                                                <div key={child.id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f8fafc',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    <span style={{ fontSize: '0.9rem' }}>↳ {child.name}</span>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <Link href={`/erashu/admin/categories/${child.id}/edit`}
                                                            style={{
                                                                textDecoration: 'none',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '4px',
                                                                border: '1px solid var(--border)',
                                                                color: 'var(--text)',
                                                                fontSize: '0.8rem'
                                                            }}>
                                                            Düzenle
                                                        </Link>
                                                        <form action={deleteCategory}>
                                                            <input type="hidden" name="id" value={child.id} />
                                                            <button type="submit" style={{
                                                                backgroundColor: '#ef4444',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem'
                                                            }}>
                                                                Sil
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {categories.length === 0 && (
                            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                                {query ? 'Aradığınız kriterlere uygun kategori bulunamadı.' : 'Henüz hiç kategori yok.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

import { prisma } from '@/lib/prisma';
import { deleteProduct } from '@/app/actions';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProductStatusToggle from '@/components/admin/ProductStatusToggle';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminProductsPage({ searchParams }: { searchParams: { q?: string } }) {
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    try {
        const user = JSON.parse(session.value);
        const { hasPermission, PERMISSIONS } = await import('@/lib/rbac');
        const canView = await hasPermission(user.id, PERMISSIONS.PRODUCTS_VIEW);
        if (!canView) {
            return <div className="p-8 text-center text-red-600">Bu sayfayı görüntüleme yetkiniz yok.</div>;
        }
    } catch (e) {
        console.error("Permission check failed", e);
    }

    const categories = await prisma.category.findMany();

    // Build category lookup map for performance
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const query = searchParams.q?.toLowerCase();
    const where: any = {};
    if (query) {
        where.name = { contains: query };
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }, // Good practice for admin list
        include: { media: true }
    });

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="title">Ürünler</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="Ürün ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                    <Link href="/erashu/admin/products/new" className="btn">
                        + Yeni Ürün
                    </Link>
                </div>
            </header>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Resim</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Ürün Adı</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Kategori</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Alt Kategori</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>İndirim</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Fiyat</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Stok</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Kargo</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Durum</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            // Determine Category Display
                            const cat = categoryMap.get(product.categoryId);
                            let mainCategoryName = '-';
                            let subCategoryName = '-';

                            if (cat) {
                                if (cat.parentId) {
                                    // It's a subcategory
                                    subCategoryName = cat.name;
                                    const parent = categoryMap.get(cat.parentId);
                                    mainCategoryName = parent ? parent.name : '-';
                                } else {
                                    // It's a main category
                                    mainCategoryName = cat.name;
                                }
                            }

                            const isDiscounted = (product.salePrice || 0) > 0 && (product.salePrice || 0) < product.price;

                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <img src={product.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.85rem',
                                            color: 'var(--text)'
                                        }}>
                                            {mainCategoryName}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            {subCategoryName}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {isDiscounted ? (
                                            <span style={{
                                                backgroundColor: '#fee2e2',
                                                color: '#ef4444',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '99px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                İndirimli
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Normal</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {isDiscounted ? (
                                            <div>
                                                <div style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '0.8rem' }}>{product.price} TL</div>
                                                <div style={{ color: '#ef4444', fontWeight: 600 }}>{product.salePrice} TL</div>
                                            </div>
                                        ) : (
                                            <>{product.price} TL</>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: product.stock > 0 ? 'green' : 'red', fontWeight: product.stock === 0 ? 600 : 400 }}>
                                            {product.stock === 0 ? 'Stok Yok' : product.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {product.freeShipping ? (
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
                                            <span style={{
                                                backgroundColor: '#f3f4f6',
                                                color: '#4b5563',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '99px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                Ücretli
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <ProductStatusToggle productId={product.id} initialStatus={product.isActive ?? true} />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/erashu/admin/products/${product.id}/edit`}
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
                                            <form action={deleteProduct}>
                                                <input type="hidden" name="id" value={product.id} />
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
                            );
                        })}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    Henüz hiç ürün bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

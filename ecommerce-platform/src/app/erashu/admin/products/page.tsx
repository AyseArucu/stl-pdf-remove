import { prisma } from '@/lib/prisma';
import { deleteProduct } from '@/app/actions';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProductStatusToggle from '@/components/admin/ProductStatusToggle';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
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

    const query = q?.toLowerCase();
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Resim</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Ürün Adı</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">İndirim</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Fiyat</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">Stok</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Durum</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
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
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 md:p-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <div className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-xs">{product.name}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{product.stock} Stok</div>
                                        </td>
                                        <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{mainCategoryName}</span>
                                                <span className="text-xs text-gray-400">{subCategoryName}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4 hidden md:table-cell">
                                            {isDiscounted ? (
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                                    İndirimli
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">Normal</span>
                                            )}
                                        </td>
                                        <td className="p-3 md:p-4">
                                            {isDiscounted ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 line-through">{product.price} TL</span>
                                                    <span className="text-sm font-bold text-red-600">{product.salePrice} TL</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium text-gray-900">{product.price} TL</span>
                                            )}
                                        </td>
                                        <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                                            <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {product.stock === 0 ? 'Stok Yok' : product.stock}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <ProductStatusToggle productId={product.id} initialStatus={product.isActive ?? true} />
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/erashu/admin/products/${product.id}/edit`}
                                                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"
                                                >
                                                    Düzenle
                                                </Link>
                                                <form action={deleteProduct}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button type="submit"
                                                        className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
                                                        onClick={(e) => {
                                                            if (!confirm('Silmek istediğinize emin misiniz?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
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
                                    <td colSpan={10} className="p-8 text-center text-gray-500">
                                        Henüz hiç ürün bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

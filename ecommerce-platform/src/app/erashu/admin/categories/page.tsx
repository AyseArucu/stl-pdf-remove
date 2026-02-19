import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const allCategories = await prisma.category.findMany();
    let categories = allCategories;

    const query = q?.toLowerCase();
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

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Kategori Ekleme Formu */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Yeni Kategori Ekle</h2>
                    <form action={createCategory} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Kategori Adı</label>
                            <input name="name" type="text" required placeholder="Örn: Ayakkabı" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Ana Kategori (Opsiyonel)</label>
                            <select name="parentId" className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                                <option value="">Yok (Ana Kategori)</option>
                                {/* Use allCategories here to always show all potential parents for the form, regardless of search */}
                                {allCategories.filter(c => !c.parentId).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                            Kategori Oluştur
                        </button>
                    </form>
                </div>

                {/* Kategori Listesi */}
                <div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Mevcut Kategoriler</h2>
                    <div className="space-y-4">
                        {mainCategories.map((category) => {
                            const children = subCategories.filter(sc => sc.parentId === category.id);
                            return (
                                <div key={category.id} className="space-y-2">
                                    {/* Main Category Item */}
                                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <span className="font-semibold text-gray-800">{category.name}</span>
                                        <div className="flex gap-2">
                                            <Link href={`/erashu/admin/categories/${category.id}/edit`}
                                                className="px-3 py-1.5 text-sm text-blue-600 border border-blue-100 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                                            >
                                                Düzenle
                                            </Link>
                                            <form action={deleteCategory}>
                                                <input type="hidden" name="id" value={category.id} />
                                                <button type="submit"
                                                    className="px-3 py-1.5 text-sm text-red-600 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition"
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
                                    </div>

                                    {/* Subcategories */}
                                    {children.length > 0 && (
                                        <div className="pl-6 space-y-2">
                                            {children.map(child => (
                                                <div key={child.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="text-gray-400">↳</span> {child.name}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Link href={`/erashu/admin/categories/${child.id}/edit`}
                                                            className="p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded"
                                                        >
                                                            Düzenle
                                                        </Link>
                                                        <form action={deleteCategory}>
                                                            <input type="hidden" name="id" value={child.id} />
                                                            <button type="submit"
                                                                className="p-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                                                            >
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
                            <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg">
                                {query ? 'Aradığınız kriterlere uygun kategori bulunamadı.' : 'Henüz hiç kategori yok.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

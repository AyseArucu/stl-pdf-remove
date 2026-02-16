
import { prisma } from '@/lib/prisma';
import { createRole } from '@/actions/rbac-actions';
import { redirect } from 'next/navigation';

export default async function NewRolePage() {
    const permissions = await prisma.permission.findMany({
        orderBy: { module: 'asc' }
    });

    // Custom Grouping Logic
    const permissionsByModule = permissions.reduce((acc, perm) => {
        // 1. Skip Orders & Products (except Blog)
        if (perm.module === 'ORDERS') return acc;
        if (perm.module === 'PRODUCTS' && perm.key !== 'blog_view') return acc;

        // 2. Remap Blog
        let moduleKey = perm.module;
        if (perm.key === 'blog_view') {
            moduleKey = 'BLOG';
        }

        if (!acc[moduleKey]) acc[moduleKey] = [];
        acc[moduleKey].push(perm);
        return acc;
    }, {} as Record<string, typeof permissions>);

    async function handleSubmit(formData: FormData) {
        'use server';
        await createRole(formData);
        redirect('/erashu/admin/roles');
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Rol Oluştur</h1>

            <form action={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rol Adı</label>
                        <input name="name" type="text" required placeholder="Örn: Editör" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <input name="description" type="text" placeholder="Bu rolün amacı nedir?" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Permissions Grid */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">İzinler</h3>
                    <div className="space-y-6">
                        {Object.entries(permissionsByModule).map(([module, perms]) => {
                            const moduleTr = {
                                'DASHBOARD': 'Genel Bakış',
                                'USERS': 'Kullanıcılar',
                                'BLOG': 'Blog / Haber Yönetimi',
                                'PRODUCTS': 'Ürünler & İçerik',
                                'ORDERS': 'Siparişler',
                                'SETTINGS': 'Ayarlar',
                                'SYSTEM': 'Sistem Yönetimi'
                            }[module] || module;

                            return (
                                <div key={module} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-purple-800 mb-3 border-b border-gray-200 pb-2">{moduleTr}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {perms.map((perm) => {
                                            const descTr = {
                                                'View Dashboard': 'Paneli Görüntüle',
                                                'View Users List': 'Kullanıcı Listesi',
                                                'Edit/Delete Users': 'Kullanıcı Düzenle/Sil',
                                                'View Products': 'Ürünleri Görüntüle',
                                                'View Blog': 'Blog Görüntüle',
                                                'Create/Edit/Delete Products': 'Ürün Düzenle/Sil',
                                                'View Orders': 'Siparişleri Görüntüle',
                                                'Manage Orders': 'Sipariş Yönetimi',
                                                'View Settings': 'Ayarları Görüntüle',
                                                'Manage Roles & Permissions': 'Rol ve İzin Yönetimi',
                                                'Manage Sub Admins': 'Personel Yönetimi'
                                            }[perm.description || ''] || perm.description;

                                            return (
                                                <label key={perm.id} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-white rounded transition">
                                                    <input type="checkbox" name="permissions" value={perm.id} className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-900">{descTr}</span>
                                                        <span className="block text-xs text-gray-500">{perm.key}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="submit" className="bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-800 transition shadow-sm">
                        Rolü Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}

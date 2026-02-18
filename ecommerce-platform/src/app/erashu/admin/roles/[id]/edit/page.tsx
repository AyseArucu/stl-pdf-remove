
import { prisma } from '@/lib/prisma';
import { updateRole, deleteRole } from '@/actions/rbac-actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: roleId } = await params;

    // Fetch role with its permissions
    const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: { permissions: true }
    });

    if (!role) {
        return <div>Rol bulunamadı.</div>;
    }

    const currentPermissionIds = role.permissions.map(p => p.permissionId);

    const allPermissions = await prisma.permission.findMany({
        orderBy: { module: 'asc' }
    });

    // Custom Grouping Logic
    const permissionsByModule = allPermissions.reduce((acc, perm) => {
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
    }, {} as Record<string, typeof allPermissions>);

    async function handleUpdate(formData: FormData) {
        'use server';
        await updateRole(roleId, formData);
        redirect('/erashu/admin/roles');
    }

    // Separate delete action because it can't be in the same form easily without JS handling
    // or using multiple buttons with formaction.
    async function handleDelete(formData: FormData) {
        'use server';
        await deleteRole(roleId);
        redirect('/erashu/admin/roles');
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Rolü Düzenle: {role.name}</h1>
                <form action={handleDelete}>
                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition">
                        Rolü Sil
                    </button>
                </form>
            </div>

            <form action={handleUpdate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Role Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rol Adı</label>
                        <input name="name" type="text" defaultValue={role.name} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <input name="description" type="text" defaultValue={role.description || ''} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
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
                                                    <input
                                                        type="checkbox"
                                                        name="permissions"
                                                        value={perm.id}
                                                        defaultChecked={currentPermissionIds.includes(perm.id)}
                                                        className="mt-1 w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                    />
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
                    <Link href="/erashu/admin/roles" className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">
                        İptal
                    </Link>
                    <button type="submit" className="bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-800 transition shadow-sm">
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}

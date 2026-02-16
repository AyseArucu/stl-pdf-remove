
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RolesPage() {
    const roles = await prisma.role.findMany({
        include: {
            _count: {
                select: { users: true }
            }
        }
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Rol Yönetimi</h1>
                <Link href="/erashu/admin/roles/new" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition">
                    + Yeni Rol Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                            <th className="p-4 font-semibold">Rol Adı</th>
                            <th className="p-4 font-semibold">Açıklama</th>
                            <th className="p-4 font-semibold">Kullanıcı Sayısı</th>
                            <th className="p-4 font-semibold text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Henüz hiç rol oluşturulmamış.
                                </td>
                            </tr>
                        ) : (
                            roles.map(role => (
                                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{role.name}</td>
                                    <td className="p-4 text-gray-600">{role.description || '-'}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {role._count.users} Kullanıcı
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <Link href={`/erashu/admin/roles/${role.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                Düzenle
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                const { deleteRole } = await import('@/actions/rbac-actions');
                                                await deleteRole(role.id);
                                            }}>
                                                <button className="text-red-600 hover:text-red-800 font-medium" type="submit">
                                                    Sil
                                                </button>
                                            </form>
                                        </div>
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

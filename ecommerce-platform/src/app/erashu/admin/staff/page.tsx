
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteStaff } from '@/actions/staff-actions';

export default async function StaffPage() {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: { in: ['SUB_ADMIN', 'AUTHOR'] }
            },
            include: {
                userRole: true
            }
        });

        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Personel Yönetimi</h1>
                    <Link href="/erashu/admin/staff/new" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition">
                        + Yeni Personel Ekle
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Ad Soyad</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Rol</th>
                                <th className="p-4 font-semibold text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Henüz hiç personel eklenmemiş.
                                    </td>
                                </tr>
                            ) : (
                                staff.map(user => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4 text-xs font-mono text-gray-500" title={user.id}>
                                            #{user.id.substring(0, 8)}...
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200">
                                                {user.userRole?.name || 'Rol Yok'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={deleteStaff.bind(null, user.id)}>
                                                <button className="text-red-600 hover:text-red-800 font-medium text-sm" type="submit">
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
    } catch (error) {
        console.error('Error fetching staff:', error);
        return (
            <div className="p-6 text-red-600">
                <h1 className="text-2xl font-bold mb-4">Bir hata oluştu</h1>
                <p>Personel listesi yüklenirken bir sorun oluştu.</p>
                <pre className="bg-gray-100 p-4 rounded mt-4 overflow-auto text-sm text-black">
                    {JSON.stringify(error, null, 2)}
                    {(error as Error)?.message}
                </pre>
            </div>
        );
    }

}

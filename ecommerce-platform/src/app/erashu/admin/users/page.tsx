import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserRoleSelect from './UserRoleSelect';
import UserStatusToggle from './UserStatusToggle';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const session = (await cookies()).get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const query = q?.toLowerCase();
    const where: any = {};
    if (query) {
        where.OR = [
            { name: { contains: query } },
            { email: { contains: query } }
        ];
    }

    const users = await prisma.user.findMany({
        where
    });

    return (
        <main className="container">
            <header className="header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="title">Kayıtlı Üyeler</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AdminSearch placeholder="İsim veya E-posta ara..." />
                    <Link href="/erashu/admin" className="btn" style={{ backgroundColor: 'var(--secondary)' }}>
                        ← Panele Dön
                    </Link>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">ID</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">İsim Soyisim</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">E-posta</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Rol</th>
                                <th className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-600">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 md:p-4 text-xs md:text-sm text-gray-500">
                                        #{user.id.substring(0, 8)}...
                                    </td>
                                    <td className="p-3 md:p-4 font-medium text-gray-900 text-xs md:text-sm">
                                        {user.name}
                                        <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                                    </td>
                                    <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                                        {user.email}
                                    </td>
                                    <td className="p-3 md:p-4">
                                        <UserRoleSelect userId={user.id} currentRole={user.role as any} />
                                    </td>
                                    <td className="p-3 md:p-4">
                                        <UserStatusToggle userId={user.id} initialStatus={user.isActive ?? true} />
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Henüz kayıtlı üye bulunmuyor.
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

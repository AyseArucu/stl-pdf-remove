import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserRoleSelect from './UserRoleSelect';
import UserStatusToggle from './UserStatusToggle';
import AdminSearch from '@/components/admin/AdminSearch';

export default async function AdminUsersPage({ searchParams }: { searchParams: { q?: string } }) {
    const session = cookies().get('user_session');
    if (!session) {
        redirect('/erashu/admin/login');
    }

    const query = searchParams.q?.toLowerCase();
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

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>İsim Soyisim</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>E-posta</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Rol</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                    #{user.id.substring(0, 8)}...
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>
                                    {user.name}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {user.email}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <UserRoleSelect userId={user.id} currentRole={user.role as any} />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <UserStatusToggle userId={user.id} initialStatus={user.isActive ?? true} />
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    Henüz kayıtlı üye bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

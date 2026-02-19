import { cookies } from 'next/headers';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
// import { AdminProvider } from '@/context/AdminContext'; // Moved to Client
// import AdminGuard from '@/components/admin/AdminGuard'; // Moved to Client

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check session for ADMIN role
    const sessionCookie = (await cookies()).get('user_session');
    let isAdmin = false;
    let permissions: string[] = [];

    if (sessionCookie) {
        try {
            const user = JSON.parse(sessionCookie.value);
            if (user && (user.role === 'ADMIN' || user.role === 'SUB_ADMIN' || user.role === 'AUTHOR')) {
                isAdmin = true;
                // Fetch permissions (Server-Side)
                const { getUserPermissions } = await import('@/lib/rbac');
                if (user.id) {
                    permissions = await getUserPermissions(user.id);
                }
            }
        } catch (e) {
            // Ignore parse error
        }
    }

    return (
        <AdminLayoutClient isAdmin={isAdmin} permissions={permissions}>
            {children}
        </AdminLayoutClient>
    );
}


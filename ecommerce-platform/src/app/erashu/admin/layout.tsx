import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminProvider } from '@/context/AdminContext';
import AdminGuard from '@/components/admin/AdminGuard';

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
        <AdminProvider initialPermissions={permissions}>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
                {/* Sidebar (Fixed Width) - Only show if Admin */}
                {isAdmin && <AdminSidebar />}

                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <AdminHeader />

                    {/* Page Content */}
                    <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                        <AdminGuard>
                            {children}
                        </AdminGuard>
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}

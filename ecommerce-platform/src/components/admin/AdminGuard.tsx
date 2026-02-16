'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { PERMISSIONS } from '@/lib/permission-constants';

const ADMIN_PATH = '/erashu/admin';

// Map path segments to permissions
const PATH_PERMISSIONS: Record<string, string> = {
    '/stl-models': PERMISSIONS.PRODUCTS_EDIT,
    '/blog': PERMISSIONS.BLOG_VIEW,
    '/messages': PERMISSIONS.DASHBOARD_VIEW,
    '/contact-settings': PERMISSIONS.SETTINGS_VIEW,
    '/slider': PERMISSIONS.SETTINGS_VIEW,
    '/services': PERMISSIONS.SETTINGS_VIEW,
    '/categories': PERMISSIONS.PRODUCTS_EDIT,
    '/questions': PERMISSIONS.DASHBOARD_VIEW,
    '/roles': PERMISSIONS.ROLES_MANAGE,
    '/staff': PERMISSIONS.STAFF_MANAGE,
    // Add others if needed
};

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { permissions } = useAdmin();

    useEffect(() => {
        // Skip login page
        if (pathname.includes('/login')) return;

        // Strip prefix
        const relativePath = pathname.replace(ADMIN_PATH, '');

        // Find required permission based on start of path
        // e.g. /stl-models/new -> checks '/stl-models'
        let requiredPerm: string | null = null;

        for (const [key, perm] of Object.entries(PATH_PERMISSIONS)) {
            if (relativePath.startsWith(key)) {
                requiredPerm = perm;
                break;
            }
        }

        // Check permission
        if (requiredPerm) {
            const hasAccess = permissions.includes(requiredPerm);
            if (!hasAccess) {
                console.warn(`Access Denied: ${pathname}. Missing permission: ${requiredPerm}`);
                router.replace('/erashu/admin?error=unauthorized');
            }
        }
    }, [pathname, permissions, router]);

    return <>{children}</>;
}

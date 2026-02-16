
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';


// Constants are imported from permission-constants.ts
import { PERMISSIONS, MODULES } from '@/lib/permission-constants';
export { PERMISSIONS, MODULES };

/**
 * Checks if a user has a specific permission.
 * 
 * Strategy:
 * 1. If user is SUPER ADMIN (role === 'ADMIN'), return true.
 * 2. If user has a Role, check if Role has permission.
 * 3. Check if User has explicit direct permission (UserPermission).
 */
export async function hasPermission(userId: string, permissionKey: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userRole: {
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            },
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    if (!user) return false;

    // 1. Super Admin Bypass
    if (user.role === 'ADMIN') return true;

    // 2. Role Permissions
    if ((user as any).userRole) {
        const roleHas = (user as any).userRole.permissions.some((rp: any) => rp.permission.key === permissionKey);
        if (roleHas) return true;
    }

    // 3. Direct User Permissions (Overrides)
    const userHas = (user as any).permissions.some((up: any) => up.permission.key === permissionKey);
    if (userHas) return true;

    return false;
}

/**
 * Log an action to AuditLog
 */
export async function logAudit(action: string, performedBy: string, details: any = {}, targetUser?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                performedBy,
                targetUser,
                details: JSON.stringify(details),
            }
        });
    } catch (e) {
        console.error("Failed to write audit log", e);
    }
}

/**
 * Seed initial permissions (Helper to run once)
 */
export async function seedPermissions() {
    const permissions = [
        { key: PERMISSIONS.DASHBOARD_VIEW, module: MODULES.DASHBOARD, description: "View Dashboard" },

        { key: PERMISSIONS.USERS_VIEW, module: MODULES.USERS, description: "View Users List" },
        { key: PERMISSIONS.USERS_EDIT, module: MODULES.USERS, description: "Edit/Delete Users" },

        { key: PERMISSIONS.PRODUCTS_VIEW, module: MODULES.PRODUCTS, description: "View Products" },
        { key: PERMISSIONS.BLOG_VIEW, module: MODULES.PRODUCTS, description: "View Blog" }, // Added
        { key: PERMISSIONS.PRODUCTS_EDIT, module: MODULES.PRODUCTS, description: "Create/Edit/Delete Products" },

        { key: PERMISSIONS.ORDERS_VIEW, module: MODULES.ORDERS, description: "View Orders" },
        { key: PERMISSIONS.ORDERS_EDIT, module: MODULES.ORDERS, description: "Manage Orders" },

        { key: PERMISSIONS.SETTINGS_VIEW, module: MODULES.SETTINGS, description: "View Settings" },

        { key: PERMISSIONS.ROLES_MANAGE, module: MODULES.SYSTEM, description: "Manage Roles & Permissions" },
        { key: PERMISSIONS.STAFF_MANAGE, module: MODULES.SYSTEM, description: "Manage Sub Admins" },
    ];

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { key: p.key },
            update: {},
            create: p,
        });
    }
    console.log("Permissions seeded.");
}

/**
 * Get all permissions for a user as an array of keys.
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userRole: {
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            },
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    if (!user) return [];

    if (user.role === 'ADMIN') {
        // Return all defined permissions to ensure full access
        return Object.values(PERMISSIONS);
    }

    // Author Role defaults (Hardcoded for now to avoid DB migration complexity)
    if (user.role === 'AUTHOR') {
        return ['blog_view', 'dashboard_view'];
    }

    const perms = new Set<string>();

    // Role Permissions
    if ((user as any).userRole) {
        (user as any).userRole.permissions.forEach((rp: any) => perms.add(rp.permission.key));
    }

    // Direct Permissions
    (user as any).permissions.forEach((up: any) => perms.add(up.permission.key));

    return Array.from(perms);
}

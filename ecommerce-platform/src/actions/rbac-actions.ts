
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/rbac';

// Create a new Role
export async function createRole(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const permissions = formData.getAll('permissions') as string[]; // Array of permission IDs

    if (!name) throw new Error("Role name is required");

    try {
        const role = await prisma.role.create({
            data: {
                name,
                description,
                permissions: {
                    create: permissions.map(permId => ({
                        permissionId: permId
                    }))
                }
            }
        });

        // TO DO: Get current user ID for audit log (need auth context)
        // await logAudit('CREATE_ROLE', 'system', { roleId: role.id, name });

        revalidatePath('/erashu/admin/roles');
        return { success: true, message: 'Role created successfully' };
    } catch (error) {
        console.error("Failed to create role:", error);
        return { success: false, message: 'Failed to create role' };
    }
}

// Update an existing Role
export async function updateRole(roleId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const permissions = formData.getAll('permissions') as string[];

    try {
        // Transaction to update role and recreate permissions
        await prisma.$transaction(async (tx) => {
            // Update details
            await tx.role.update({
                where: { id: roleId },
                data: { name, description }
            });

            // Wipe existing permissions for this role
            await tx.rolePermission.deleteMany({
                where: { roleId }
            });

            // Re-assign selected permissions
            if (permissions.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissions.map(pId => ({
                        roleId,
                        permissionId: pId
                    }))
                });
            }
        });

        revalidatePath('/erashu/admin/roles');
        return { success: true, message: 'Role updated successfully' };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { success: false, message: 'Failed to update role' };
    }
}

// Delete a Role
export async function deleteRole(roleId: string) {
    try {
        await prisma.role.delete({
            where: { id: roleId }
        });
        revalidatePath('/erashu/admin/roles');
        return { success: true, message: 'Role deleted successfully' };
    } catch (error) {
        console.error("Failed to delete role:", error);
        return { success: false, message: 'Failed to delete role' };
    }
}

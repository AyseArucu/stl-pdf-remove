
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// Create a new Sub Admin
export async function createSubAdmin(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const roleId = formData.get('roleId') as string;

    if (!name || !email || !password || !roleId) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for Built-in AUTHOR role
        let userRole = 'SUB_ADMIN';
        let dbRoleId = roleId;

        if (roleId === 'AUTHOR') {
            userRole = 'AUTHOR';
            dbRoleId = undefined as any; // Allow null
        } else {
            // Fetch Role to determine User.role type
            const role = await prisma.role.findUnique({ where: { id: roleId } });
            if (role) {
                const roleName = role.name.toUpperCase();
                if (roleName === 'ADMIN') {
                    userRole = 'ADMIN';
                }
            }
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
                roleId: dbRoleId ? dbRoleId : undefined,
            }
        });

        revalidatePath('/erashu/admin/staff');
        return { success: true, message: 'Staff member created successfully' };
    } catch (error) {
        console.error("Failed to create staff:", error);
        return { success: false, message: 'Failed to create staff member' };
    }
}

// Update Staff Role
export async function updateStaffRole(userId: string, roleId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { roleId }
        });
        revalidatePath('/erashu/admin/staff');
        return { success: true, message: 'Staff role updated' };
    } catch (error) {
        return { success: false, message: 'Failed to update role' };
    }
}

// Delete Staff (or deactivate)
// Delete Staff (or deactivate)
export async function deleteStaff(userId: string) {
    try {
        // Ideally just deactivate, but delete for now
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath('/erashu/admin/staff');
    } catch (error) {
        console.error("Failed to remove staff", error);
    }
}

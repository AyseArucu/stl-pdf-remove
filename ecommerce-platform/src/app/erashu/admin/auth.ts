'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const rawEmail = formData.get('email') as string;
    const rawPassword = formData.get('password') as string;

    const email = rawEmail?.trim().toLowerCase();
    const password = rawPassword?.trim(); // Trim password just in case

    console.log('Admin login attempt:', { rawEmail, email });

    // Real DB check
    try {
        const { prisma } = await import('@/lib/prisma');
        const user = await prisma.user.findFirst({ // Use findFirst for potentially case-insensitive match if unique index failed
            where: { email: email }
        });

        if (user && (user.role === 'ADMIN' || user.role === 'SUB_ADMIN')) {
            console.log('User found:', user.email, 'Role:', user.role);

            // Verify password
            const bcrypt = await import('bcryptjs');
            const isValid = await bcrypt.compare(password, user.password || '');

            console.log('Password valid:', isValid);

            if (isValid) {
                // Remove password from session data
                const userSession = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image
                };

                const callbackUrl = formData.get('callbackUrl') as string;
                cookies().set('user_session', JSON.stringify(userSession), { httpOnly: true, path: '/' });
                console.log('Admin session created successfully');

                const target = (callbackUrl && callbackUrl.startsWith('/')) ? callbackUrl : '/erashu/admin';
                redirect(target);
            } else {
                console.log('Password mismatch for user:', email);
                // Redirect with explicit error
                redirect('/erashu/admin/login?error=invalid_password');
            }
        } else {
            console.log('User not found or unauthorized:', email, user ? user.role : 'Does not exist');
            redirect('/erashu/admin/login?error=user_not_found');
        }
    } catch (error) {
        if ((error as any).message?.includes('NEXT_REDIRECT')) {
            throw error; // Let redirect propagate
        }
        console.error('Login error:', error);
        redirect('/erashu/admin/login?error=server_error');
    }
}

export async function logout() {
    cookies().delete('user_session');
    redirect('/erashu/admin/login');
}

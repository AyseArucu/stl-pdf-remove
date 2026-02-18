
'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function loginUserClient(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('[AuthClient Error] Login attempt:', email);

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                role: { in: ['CUSTOMER', 'ADMIN', 'EDITOR'] }
            }
        });

        if (user) {
            // Set Cookie
            (await cookies()).set('user_session', JSON.stringify(user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });

            console.log('[AuthClient Error] Success');

            // Return user data (exclude sensitive if needed, but session is JSON)
            return { success: true, user };
        } else {
            console.log('[AuthClient Error] Invalid credentials');
            return { success: false, message: 'Geçersiz email veya şifre.' };
        }
    } catch (e) {
        console.error('[AuthClient Error] System error', e);
        return { success: false, message: 'Sistem hatası oluştu.' };
    }
}

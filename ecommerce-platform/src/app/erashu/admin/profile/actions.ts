'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function changeAdminPassword(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'Tüm alanları doldurunuz.' };
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Yeni şifreler eşleşmiyor.' };
    }

    if (newPassword.length < 6) {
        return { error: 'Yeni şifre en az 6 karakter olmalıdır.' };
    }

    // Real DB Update
    try {
        const { prisma } = await import('@/lib/prisma');
        const userSession = JSON.parse(cookies().get('user_session')?.value || '{}');

        if (!userSession.email) {
            return { error: 'Oturum bulunamadı.' };
        }

        const user = await prisma.user.findUnique({ where: { email: userSession.email } });

        if (!user) {
            return { error: 'Kullanıcı bulunamadı.' };
        }

        const bcrypt = await import('bcryptjs');
        const isCurrentValid = await bcrypt.compare(currentPassword, user.password || '');

        if (!isCurrentValid) {
            return { error: 'Mevcut şifre hatalı.' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email: userSession.email },
            data: { password: hashedPassword }
        });

        return { success: 'Şifreniz başarıyla güncellendi.' };

    } catch (error) {
        console.error('Password change error:', error);
        return { error: 'Bir hata oluştu.' };
    }
}

export async function logoutAllDevices() {
    // Clear the session cookie
    cookies().delete('user_session');

    // In a real app, you would also invalidate sessions in the DB

    redirect('/erashu/admin/login');
}

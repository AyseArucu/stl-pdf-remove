'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createQrCode(payload: any) {
    let targetUrl = '';
    let name = '';
    let password = '';
    let design = '';
    let type = 'url';
    let data = null;
    let userId = null;

    if (payload instanceof FormData) {
        targetUrl = payload.get('targetUrl') as string;
        password = payload.get('password') as string;
        design = payload.get('design') as string;
        name = payload.get('name') as string;
        // Legacy support/defaults
    } else {
        // It's a JSON object
        targetUrl = payload.targetUrl || '';
        password = payload.password || '';
        design = payload.design ? JSON.stringify(payload.design) : '';
        name = payload.name || '';
        type = payload.type || 'url';
        data = payload.data ? JSON.stringify(payload.data) : null;
        userId = payload.userId || null;

        // If type is video or vcard, targetUrl might be missing or derived
        if (!targetUrl && (type === 'video' || type === 'vcard')) {
            targetUrl = '#'; // Placeholder, will be generated or handled dynamically
        }
    }

    // Try to get userId from session if not provided
    if (!userId) {
        const cookieStore = await cookies();
        const userSession = cookieStore.get('user_session')?.value;
        if (userSession) {
            try {
                const user = JSON.parse(userSession);
                userId = user.id;
            } catch (e) {
                console.error('Failed to parse user session in action', e);
            }
        }
    }

    console.log('Creating QR Code:', { type, targetUrl, name, hasPassword: !!password, userId });

    // For generic URL type, targetUrl is required
    if (type === 'url' && !targetUrl) {
        return { success: false, error: 'Target URL is required' };
    }

    try {
        const qr = await prisma.qrCode.create({
            data: {
                targetUrl,
                type,
                name: name || null,
                password: password || null,
                design: design || null,
                data: data || null,
                userId: userId || null,
                viewCount: 0
            },
        });

        return { success: true, id: qr.id };
    } catch (error) {
        console.error('Error creating QR code:', error);
        return { success: false, error: 'Failed to create QR code' };
    }
}

export async function getQrCode(id: string) {
    try {
        const qr = await prisma.qrCode.findUnique({
            where: { id },
        });
        return qr;
    } catch (error) {
        console.error('Error fetching QR code:', error);
        return null;
    }
}

export async function verifyQrPassword(id: string, password: string) {
    try {
        const qr = await prisma.qrCode.findUnique({
            where: { id },
        });

        if (!qr) return { success: false, error: 'QR code not found' };

        if (qr.password === password) {
            // Increment view count
            await prisma.qrCode.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });

            // Set cookie for access
            (await cookies()).set(`qr_access_${id}`, 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return { success: true, targetUrl: qr.targetUrl };
        } else {
            return { success: false, error: 'Incorrect password' };
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return { success: false, error: 'Verification failed' };
    }
}

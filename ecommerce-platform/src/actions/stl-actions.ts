'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function incrementStlView(id: string) {
    try {
        await prisma.stlModel.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        });
    } catch (error) {
        console.error('Error incrementing view:', error);
    }
}

export async function incrementStlDownload(id: string) {
    try {
        await prisma.stlModel.update({
            where: { id },
            data: { downloadCount: { increment: 1 } }
        });
        revalidatePath(`/3d-modeller-stl/${id}`);
    } catch (error) {
        console.error('Error incrementing download:', error);
    }
}

export async function toggleStlFavorite(stlModelId: string) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('user_session');

        if (!session) {
            // If no user, maybe we just fail silently or return error?
            // For better UX during dev, maybe just increment counter if we want "fake" interaction?
            // But real implementation demands user.
            return { success: false, error: 'Giriş yapmalısınız' };
        }

        const user = JSON.parse(session.value);
        const userId = user.id;

        // Safety check for stale Prisma client
        if (!(prisma as any).stlFavorite) {
            return { success: false, error: 'Sunucu güncelleniyor, lütfen daha sonra tekrar deneyin.' };
        }

        const existing = await prisma.stlFavorite.findUnique({
            where: {
                userId_stlModelId: {
                    userId,
                    stlModelId
                }
            }
        });

        if (existing) {
            await prisma.stlFavorite.delete({
                where: { id: existing.id }
            });
            await prisma.stlModel.update({
                where: { id: stlModelId },
                data: { favoriteCount: { decrement: 1 } }
            });
            revalidatePath(`/3d-modeller-stl/${stlModelId}`);
            return { success: true, isFavorited: false };
        } else {
            await prisma.stlFavorite.create({
                data: {
                    userId,
                    stlModelId
                }
            });
            await prisma.stlModel.update({
                where: { id: stlModelId },
                data: { favoriteCount: { increment: 1 } }
            });
            revalidatePath(`/3d-modeller-stl/${stlModelId}`);
            return { success: true, isFavorited: true };
        }

    } catch (error) {
        console.error('Error toggling favorite:', error);
        // Fallback for EPERM/Schema mismatch: just update counter blindly?
        // No, keep it safe.
        return { success: false, error: 'Bir hata oluştu' };
    }
}

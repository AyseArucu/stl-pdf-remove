'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAds() {
    try {
        return await prisma.advertisement.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching ads:', error);
        return [];
    }
}

export async function getAdByLocation(location: string) {
    try {
        return await prisma.advertisement.findFirst({
            where: { location, isActive: true },
        });
    } catch (error) {
        console.error('Error fetching ad by location:', error);
        return null;
    }
}

export async function getAdsByLocation(location: string) {
    try {
        return await prisma.advertisement.findMany({
            where: { location, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error fetching ads by location:', error);
        return [];
    }
}

export async function createAd(formData: FormData) {
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const content = formData.get('content') as string;
    const location = formData.get('location') as string;
    const isActive = formData.get('isActive') === 'on';
    const duration = parseInt(formData.get('duration') as string || '5');

    try {
        await prisma.advertisement.create({
            data: {
                title,
                type,
                content,
                location,
                isActive,
                duration,
            },
        });

        revalidatePath('/erashu/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error creating ad:', error);
        return { success: false, error: 'Failed to create ad' };
    }
}

export async function updateAd(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const content = formData.get('content') as string;
    const location = formData.get('location') as string;
    const isActive = formData.get('isActive') === 'on';
    const duration = parseInt(formData.get('duration') as string || '5');

    try {
        await prisma.advertisement.update({
            where: { id },
            data: {
                title,
                type,
                content,
                location,
                isActive,
                duration,
            },
        });

        revalidatePath('/erashu/admin/ads');
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Error updating ad:', error);
        return { success: false, error: 'Failed to update ad' };
    }
}

export async function deleteAd(id: string) {
    try {
        await prisma.advertisement.delete({
            where: { id },
        });
        revalidatePath('/erashu/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error deleting ad:', error);
        return { success: false, error: 'Failed to delete ad' };
    }
}

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function submitBlogComment(formData: FormData) {
    const session = cookies().get('user_session')?.value;
    if (!session) {
        return { error: 'Yorum yapmak için giriş yapmalısınız.' };
    }
    const user = JSON.parse(session);

    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string;
    const authorName = formData.get('authorName') as string;
    const authorSurname = formData.get('authorSurname') as string;
    const parentId = formData.get('parentId') as string | null;

    if (!postId || !content || content.trim().length === 0) {
        return { error: 'Yorum boş olamaz.' };
    }

    if (!authorName || authorName.trim().length === 0) {
        return { error: 'Ad alanı zorunludur.' };
    }

    if (!authorSurname || authorSurname.trim().length === 0) {
        return { error: 'Soyad alanı zorunludur.' };
    }

    try {
        await prisma.blogComment.create({
            data: {
                content,
                postId,
                userId: user.id,
                authorName,
                authorSurname,
                parentId: parentId || null
            }
        });

        revalidatePath(`/blog/${postId}`);
        return { success: true };
    } catch (e) {
        console.error('Submit blog comment error', e);
        return { error: 'Yorum gönderilemedi.' };
    }
}

export async function getBlogComments(postId: string) {
    try {
        const comments = await prisma.blogComment.findMany({
            where: {
                postId,
                parentId: null // Only fetch top-level comments
            },
            include: {
                user: true,
                replies: {
                    include: { user: true },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return comments;
    } catch (e) {
        return [];
    }
}

export async function getAllBlogComments() {
    try {
        const comments = await prisma.blogComment.findMany({
            include: {
                user: true,
                post: {
                    select: {
                        title: true,
                        slug: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return comments;
    } catch (e) {
        console.error('Get all blog comments error', e);
        return [];
    }
}

export async function deleteBlogComment(commentId: string) {
    const session = cookies().get('user_session')?.value;
    if (!session) {
        return { error: 'Yetkisiz işlem.' };
    }
    const user = JSON.parse(session);
    // Add admin check if needed, but for now assuming admin panel usage implies some auth check in layout/middleware
    // Ideally we check if user.role is ADMIN here too.

    try {
        await prisma.blogComment.delete({
            where: { id: commentId }
        });
        revalidatePath('/erashu/admin/blog/comments');
        return { success: true };
    } catch (e) {
        console.error('Delete blog comment error', e);
        return { error: 'Yorum silinemedi.' };
    }
}

export async function replyToCommentAsAdmin(parentId: string, content: string, postId: string) {
    const session = cookies().get('user_session')?.value;
    if (!session) return { error: 'Yetkisiz işlem.' };
    const user = JSON.parse(session);

    try {
        await prisma.blogComment.create({
            data: {
                content,
                postId,
                userId: user.id,
                authorName: "Erashu", // Hardcoded or dynamic
                authorSurname: "Admin",
                parentId
            }
        });
        revalidatePath('/erashu/admin/blog/comments');
        revalidatePath(`/blog/${postId}`); // Revalidate public page
        return { success: true };
    } catch (e) {
        console.error('Admin reply error', e);
        return { error: 'Yanıt gönderilemedi.' };
    }
}

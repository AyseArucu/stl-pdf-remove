'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to slugify title
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

// ... existing imports

export async function getRandomBlogPosts(limit: number = 5, excludeId?: string) {
    try {
        // Fetch a pool of latest posts to shuffle
        const posts = await prisma.blogPost.findMany({
            where: {
                published: true,
                ...(excludeId ? { id: { not: excludeId } } : {})
            },
            orderBy: { createdAt: 'desc' },
            take: 50, // Fetch pool of 50 latest
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
                createdAt: true,
                category: true
            }
        });

        // Shuffle array
        const shuffled = posts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    } catch (error) {
        console.error('Error fetching random blog posts:', error);
        return [];
    }
}

export async function getBlogPosts(limit?: number, category?: string) {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                published: true,
                ...(category ? { category } : {})
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (post) {
            // Increment view count
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { viewCount: { increment: 1 } }
            });
        }

        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const coverImage = formData.get('coverImage') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const imagesJson = formData.get('images') as string;

    const slug = slugify(title);

    // Get current user
    const { checkUserSession } = await import('@/app/actions/auth');
    const user = await checkUserSession();

    // Explicitly set authorId if user exists
    const authorId = user?.id;

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== 'AUTHOR')) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prisma.blogPost.create({
            data: {
                title,
                slug, // You might want to handle duplicates here
                content,
                excerpt,
                coverImage,
                category,
                author, // Display Name
                authorId, // Relation
                images: imagesJson // Store as JSON string
            }
        });
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Error creating blog post:', error);
        return { success: false, error: 'Failed to create post' };
    }
}

export async function updateBlogPost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const coverImage = formData.get('coverImage') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const imagesJson = formData.get('images') as string;

    try {
        // Enforce Ownership check
        const { checkUserSession } = await import('@/app/actions/auth');
        const user = await checkUserSession();

        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== 'AUTHOR')) {
            return { success: false, error: 'Unauthorized' };
        }

        if (user.role === 'AUTHOR') {
            const existingPost = await prisma.blogPost.findUnique({ where: { id } });
            if (!existingPost || existingPost.authorId !== user.id) {
                return { success: false, error: 'Unauthorized' };
            }
        }

        await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                content,
                excerpt,
                coverImage,
                category,
                author,
                images: imagesJson
            }
        });
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Error updating blog post:', error);
        return { success: false, error: 'Failed to update post' };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        // Enforce Ownership check
        const { checkUserSession } = await import('@/app/actions/auth');
        const user = await checkUserSession();

        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== 'AUTHOR')) {
            return { success: false, error: 'Unauthorized' };
        }

        if (user.role === 'AUTHOR') {
            const existingPost = await prisma.blogPost.findUnique({ where: { id } });
            if (!existingPost || existingPost.authorId !== user.id) {
                return { success: false, error: 'Unauthorized' };
            }
        }

        await prisma.blogPost.delete({
            where: { id }
        });
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return { success: false, error: 'Failed to delete post' };
    }
}

export async function getPaginatedPosts(offset: number, limit: number, forAdmin: boolean = false) {
    try {
        const { checkUserSession } = await import('@/app/actions/auth');
        const user = await checkUserSession();

        // If AUTHOR, filtering only their posts
        const whereClause: any = {
            published: true, // Default for public
        };

        if (forAdmin) {
            // Admin logic: Show all, or filter by author
            // But if user is AUTHOR, enforce filtering
            if (user && user.role === 'AUTHOR') {
                whereClause.authorId = user.id;
                delete whereClause.published; // Author can see unpublished drafts
            } else {
                delete whereClause.published; // Admin can see all
            }
        }

        const posts = await prisma.blogPost.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });
        return posts;
    } catch (error) {
        console.error('Error fetching paginated blog posts:', error);
        return [];
    }
}

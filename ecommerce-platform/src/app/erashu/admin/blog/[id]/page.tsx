import { prisma } from '@/lib/prisma';
import BlogForm from '@/components/admin/BlogForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { id }
    });

    if (!post) {
        return <div>Yazı bulunamadı</div>;
    }

    return <BlogForm initialData={post as any} isEdit={true} />;
}
